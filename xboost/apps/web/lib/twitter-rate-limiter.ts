import { ApiResponseError } from 'twitter-api-v2';

interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

/**
 * Execute a Twitter API call with exponential backoff retry
 * Handles 429 (rate limit) and 5xx (server error) responses
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, baseDelayMs = 1000, maxDelayMs = 30000 } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on non-retryable errors
      if (!isRetryableError(error)) {
        throw error;
      }

      // Don't retry if we've exhausted attempts
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff + jitter
      let delayMs: number;

      if (error instanceof ApiResponseError && error.code === 429) {
        // Use Retry-After header if available
        const retryAfter = error.headers?.get?.('retry-after') ?? error.headers?.['retry-after'];
        if (retryAfter) {
          delayMs = parseInt(String(retryAfter), 10) * 1000;
        } else {
          // Default: use rate limit reset time or exponential backoff
          const resetTime = error.headers?.get?.('x-rate-limit-reset') ?? error.headers?.['x-rate-limit-reset'];
          if (resetTime) {
            delayMs = Math.max(
              0,
              parseInt(String(resetTime), 10) * 1000 - Date.now()
            );
          } else {
            delayMs = Math.min(
              baseDelayMs * Math.pow(2, attempt),
              maxDelayMs
            );
          }
        }
      } else {
        // Exponential backoff with jitter for other retryable errors
        delayMs = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
        delayMs += Math.random() * delayMs * 0.1; // 10% jitter
      }

      console.warn(
        `Twitter API retry ${attempt + 1}/${maxRetries} after ${Math.round(delayMs)}ms:`,
        lastError.message
      );

      await sleep(delayMs);
    }
  }

  throw lastError!;
}

/**
 * Check if an error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof ApiResponseError) {
    // 429 = rate limited, 5xx = server errors
    return error.code === 429 || error.code >= 500;
  }

  // Network errors are retryable
  if (error instanceof Error) {
    return (
      error.message.includes('ECONNRESET') ||
      error.message.includes('ETIMEDOUT') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('fetch failed')
    );
  }

  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Per-user posting rate tracker
 * X API hard limit: 200 posts per 15-minute window per user
 */
const postingTracker = new Map<
  string,
  { count: number; windowStart: number }
>();

const POSTING_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const POSTING_LIMIT = 200;

export function checkPostingRateLimit(userId: string): {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
} {
  const now = Date.now();
  let entry = postingTracker.get(userId);

  if (!entry || now - entry.windowStart >= POSTING_WINDOW_MS) {
    entry = { count: 0, windowStart: now };
    postingTracker.set(userId, entry);
  }

  const remaining = POSTING_LIMIT - entry.count;
  const resetAt = new Date(entry.windowStart + POSTING_WINDOW_MS);

  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    resetAt,
  };
}

export function recordPostingAction(userId: string): void {
  const entry = postingTracker.get(userId);
  if (entry) {
    entry.count++;
  }
}
