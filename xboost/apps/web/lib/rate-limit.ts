import { NextResponse } from 'next/server';
import { RATE_LIMIT_CONFIGS, getApiKeyTier } from './api-auth';

type ApiTier = 'FREE' | 'PRO' | 'ENTERPRISE';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Simple in-memory rate limiter (Map-based)
// For production, consider Redis or a persistent store
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Clean up expired rate limit entries
 * Runs periodically to prevent memory leaks
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

/**
 * Get rate limit identifier for a request
 * Uses API key as identifier
 */
function getRateLimitIdentifier(request: Request): string | null {
  const apiKey = request.headers.get('X-API-Key') ||
                request.headers.get('Authorization')?.replace('Bearer ', '');

  return apiKey || null;
}

/**
 * Check rate limit for a request
 * @param request Next.js Request object
 * @returns Object with remaining requests, reset time, and whether limit is exceeded
 */
export async function checkRateLimit(request: Request) {
  const identifier = getRateLimitIdentifier(request);

  if (!identifier) {
    // No API key, allow but don't track
    return {
      remaining: Infinity,
      resetAt: null,
      exceeded: false,
    };
  }

  const tier = await getApiKeyTier(request);
  const config = RATE_LIMIT_CONFIGS[tier || 'FREE'];
  const now = Date.now();

  // Get or create rate limit entry
  let entry = rateLimitStore.get(identifier);

  if (!entry || entry.resetAt < now) {
    // Create new entry or reset expired one
    entry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(identifier, entry);
  } else {
    // Increment count
    entry.count++;
  }

  const remaining = Math.max(0, config.requests - entry.count);
  const resetAt = new Date(entry.resetAt).toISOString();
  const exceeded = entry.count > config.requests;

  return {
    remaining,
    resetAt,
    exceeded,
  };
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders(response: NextResponse, limitInfo: { remaining: number; resetAt: string | null }) {
  response.headers.set('X-RateLimit-Limit', limitInfo.remaining === Infinity ? 'unlimited' : limitInfo.remaining.toString());
  response.headers.set('X-RateLimit-Remaining', Math.max(0, limitInfo.remaining).toString());
  if (limitInfo.resetAt) {
    response.headers.set('X-RateLimit-Reset', limitInfo.resetAt);
  }

  return response;
}

/**
 * Rate limiting middleware for Next.js API routes
 * Returns 429 response if rate limit exceeded
 */
export async function requireRateLimit(request: Request): Promise<NextResponse | null> {
  const limitInfo = await checkRateLimit(request);

  if (limitInfo.exceeded) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        resetAt: limitInfo.resetAt,
      },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((Date.parse(limitInfo.resetAt || '') - Date.now()) / 1000).toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': limitInfo.resetAt || '',
        },
      }
    );
  }

  return null; // Continue to handler
}

/**
 * Wrapper for API routes that handles both authentication and rate limiting
 */
export async function withApiAuthAndRateLimit(request: Request) {
  // First check rate limit (faster check)
  const rateLimitResponse = await requireRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Then check authentication
  // Import here to avoid circular dependency
  const { authenticateApiKey } = await import('./api-auth');
  const user = await authenticateApiKey(request);

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized', code: 'INVALID_API_KEY' },
      { status: 401 }
    );
  }

  return null; // Continue to handler with authenticated user
}
