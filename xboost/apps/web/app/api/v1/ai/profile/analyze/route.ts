import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { addRateLimitHeaders } from '@/lib/rate-limit';
import { analyzeProfileWithAI } from '@/services/ai-profile-analyzer';
import type { AnalyzeProfileRequest } from '@/services/ai-profile-types';

/**
 * POST /api/v1/ai/profile/analyze
 * Analyze a Twitter profile and provide actionable insights
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
    const rateLimitKey = `ai-profile-analyze:${session.user.id}`;
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
    const body: AnalyzeProfileRequest = await request.json();

    // Validate required fields
    if (!body.profile) {
      return NextResponse.json(
        { error: 'Missing required field: profile', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const { profile } = body;

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

    // Validate optional context fields
    if (body.context) {
      if (body.context.tone && !['professional', 'casual', 'humorous', 'inspirational', 'controversial'].includes(body.context.tone)) {
        return NextResponse.json(
          { error: 'Invalid tone value. Must be one of: professional, casual, humorous, inspirational, controversial', code: 'VALIDATION_ERROR' },
          { status: 400 }
        );
      }
    }

    // Call AI service to analyze profile
    console.log(`[AI Profile Analyze] User ${session.user.id} analyzing profile`);
    const startTime = Date.now();

    const analysis = await analyzeProfileWithAI(body);

    const duration = Date.now() - startTime;
    console.log(`[AI Profile Analyze] Analysis completed in ${duration}ms`);

    // Build response with rate limit headers
    const response = NextResponse.json({
      ...analysis,
      meta: {
        userId: session.user.id,
        analyzedAt: new Date().toISOString(),
        processingTimeMs: duration,
      },
    });

    return addRateLimitHeaders(response, {
      remaining: rateLimitInfo.remaining,
      resetAt: rateLimitInfo.resetAt,
    });
  } catch (error) {
    console.error('[AI Profile Analyze] Error:', error);

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
        error: 'Failed to analyze profile',
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Simple in-memory rate limiter for session-based requests
 * Note: For production, use Redis or a persistent store
 */
const sessionRateLimitStore = new Map<string, { count: number; resetAt: number }>();

async function checkRateLimitForSession(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<{ remaining: number; resetAt: string; exceeded: boolean }> {
  const now = Date.now();
  let entry = sessionRateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    // Create new entry or reset expired one
    entry = {
      count: 1,
      resetAt: now + windowMs,
    };
    sessionRateLimitStore.set(key, entry);
  } else {
    // Increment count
    entry.count++;
  }

  const remaining = Math.max(0, maxRequests - entry.count);
  const resetAt = new Date(entry.resetAt).toISOString();
  const exceeded = entry.count > maxRequests;

  return { remaining, resetAt, exceeded };
}
