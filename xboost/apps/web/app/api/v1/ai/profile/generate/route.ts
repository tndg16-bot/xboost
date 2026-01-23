import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import type { GenerateProfileRequest } from '@/services/ai-profile-types';
import { generateProfile } from '@/services/ai-profile-analyzer';

// Reuse session-based rate limiter
const sessionRateLimitStore = new Map<string, { count: number; resetAt: number }>();

async function checkRateLimitForSession(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<{ remaining: number; resetAt: string; exceeded: boolean }> {
  const now = Date.now();
  let entry = sessionRateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    entry = {
      count: 1,
      resetAt: now + windowMs,
    };
    sessionRateLimitStore.set(key, entry);
  } else {
    entry.count++;
  }

  const remaining = Math.max(0, maxRequests - entry.count);
  const resetAt = new Date(entry.resetAt).toISOString();
  const exceeded = entry.count > maxRequests;

  return { remaining, resetAt, exceeded };
}

function addRateLimitHeaders(
  response: NextResponse,
  limitInfo: { remaining: number; resetAt: string }
): NextResponse {
  response.headers.set('X-RateLimit-Remaining', Math.max(0, limitInfo.remaining).toString());
  if (limitInfo.resetAt) {
    response.headers.set('X-RateLimit-Reset', limitInfo.resetAt);
  }

  return response;
}

/**
 * POST /api/v1/ai/profile/generate
 * Generate a complete Twitter profile from scratch
 *
 * Authentication: NextAuth session required
 * Rate Limit: 10 requests per minute
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication: Check NextAuth session
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Rate Limit: Check rate limit for this user
    const rateLimitKey = `ai-profile-generate:${session.user.id}`;
    const rateLimitInfo = await checkRateLimitForSession(
      rateLimitKey,
      10, // 10 requests
      60 * 1000 // per minute (60 seconds)
    );

    if (rateLimitInfo.exceeded) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          resetAt: rateLimitInfo.resetAt,
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((Date.parse(rateLimitInfo.resetAt) - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Parse request body
    const body: GenerateProfileRequest = await request.json();

    // Validate required fields
    if (!body.expertise || typeof body.expertise !== 'string') {
      return NextResponse.json(
        { error: 'expertise is required and must be a string', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!body.targetAudience || typeof body.targetAudience !== 'string') {
      return NextResponse.json(
        { error: 'targetAudience is required and must be a string', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!body.industry || typeof body.industry !== 'string') {
      return NextResponse.json(
        { error: 'industry is required and must be a string', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!body.goals || !Array.isArray(body.goals) || body.goals.length === 0) {
      return NextResponse.json(
        { error: 'goals is required and must be a non-empty array', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const { expertise, targetAudience, industry, goals: _goals, uniquePoints, tone, language } = body;

    // Validate optional parameters
    if (uniquePoints && !Array.isArray(uniquePoints)) {
      return NextResponse.json(
        { error: 'uniquePoints must be an array', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (tone && !['professional', 'casual', 'humorous', 'inspirational', 'controversial'].includes(tone)) {
      return NextResponse.json(
        { error: 'Invalid tone value. Must be one of: professional, casual, humorous, inspirational, controversial', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (language && !['ja', 'en'].includes(language)) {
      return NextResponse.json(
        { error: 'Invalid language value. Must be one of: ja, en', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Validate string length limits
    if (expertise.length > 1000) {
      return NextResponse.json(
        { error: 'expertise must be under 1000 characters', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (targetAudience.length > 500) {
      return NextResponse.json(
        { error: 'targetAudience must be under 500 characters', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (industry.length > 200) {
      return NextResponse.json(
        { error: 'industry must be under 200 characters', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Call AI service to generate profile
    console.log(`[AI Profile Generate] User ${session.user.id} generating profile`);
    const startTime = Date.now();

    const result = await generateProfile(body);

    const duration = Date.now() - startTime;
    console.log(`[AI Profile Generate] Generation completed in ${duration}ms`);

    // Build response with rate limit headers
    const response = NextResponse.json({
      ...result,
      meta: {
        userId: session.user.id,
        generatedAt: new Date().toISOString(),
        processingTimeMs: duration,
      },
    });

    return addRateLimitHeaders(response, {
      remaining: rateLimitInfo.remaining,
      resetAt: rateLimitInfo.resetAt,
    });
  } catch (error) {
    console.error('[AI Profile Generate] Error:', error);

    // Handle AI API errors
    if (error instanceof Error) {
      if (error.message.includes('AI API key not configured')) {
        return NextResponse.json(
          { error: 'AI service not configured', code: 'SERVICE_UNAVAILABLE' },
          { status: 503 }
        );
      }
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error: 'Failed to generate profile',
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
