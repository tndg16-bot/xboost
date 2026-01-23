import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import type { FixedPostRequest } from '@/services/ai-profile-types';
import { generateProfilePosts } from '@/services/ai-profile-analyzer';

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
 * POST /api/v1/ai/profile/fixed-post
 * Generate profile introduction posts based on profile data
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
    const rateLimitKey = `ai-profile-fixed-post:${session.user.id}`;
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
    const body: FixedPostRequest = await request.json();

    // Validate required fields
    if (!body.profile) {
      return NextResponse.json(
        { error: 'Missing required field: profile', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!body.targetAudience || typeof body.targetAudience !== 'string') {
      return NextResponse.json(
        { error: 'targetAudience is required and must be a string', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const { profile, targetAudience: _targetAudience, industry: _industry, variations, tone, includeHashtags: _includeHashtags, maxLength } = body;

    // Validate profile fields
    if (!profile.name || typeof profile.name !== 'string') {
      return NextResponse.json(
        { error: 'profile.name is required and must be a string', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!profile.bio || typeof profile.bio !== 'string') {
      return NextResponse.json(
        { error: 'profile.bio is required and must be a string', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!profile.location || typeof profile.location !== 'string') {
      return NextResponse.json(
        { error: 'profile.location is required and must be a string', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (profile.website && typeof profile.website !== 'string') {
      return NextResponse.json(
        { error: 'profile.website must be a string', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Validate optional parameters
    if (variations !== undefined && (typeof variations !== 'number' || variations < 1 || variations > 10)) {
      return NextResponse.json(
        { error: 'variations must be a number between 1 and 10', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (tone && !['professional', 'casual', 'humorous', 'inspirational', 'controversial'].includes(tone)) {
      return NextResponse.json(
        { error: 'Invalid tone value. Must be one of: professional, casual, humorous, inspirational, controversial', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (maxLength !== undefined && (typeof maxLength !== 'number' || maxLength < 50 || maxLength > 500)) {
      return NextResponse.json(
        { error: 'maxLength must be a number between 50 and 500', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Call AI service to generate posts
    console.log(`[AI Profile Fixed Post] User ${session.user.id} generating ${variations || 3} post variations`);
    const startTime = Date.now();

    const result = await generateProfilePosts(body);

    const duration = Date.now() - startTime;
    console.log(`[AI Profile Fixed Post] Generation completed in ${duration}ms`);

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
    console.error('[AI Profile Fixed Post] Error:', error);

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
        error: 'Failed to generate profile posts',
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
