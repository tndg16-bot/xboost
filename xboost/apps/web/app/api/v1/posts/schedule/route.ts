import { NextResponse } from 'next/server';
import { withApiAuthAndRateLimit, addRateLimitHeaders, checkRateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function POST(request: Request) {
  const authResponse = await withApiAuthAndRateLimit(request);
  if (authResponse) return authResponse;

  const body = await request.json();
  const { content, mediaUrls = [], twitterAccountId, scheduledAt } = body;
  const limitInfo = await checkRateLimit(request);

  const user = await (await import('@/lib/api-auth')).authenticateApiKey(request);

  if (!content || typeof content !== 'string') {
    return NextResponse.json(
      { error: 'Content is required', code: 'INVALID_INPUT' },
      { status: 400 }
    );
  }

  if (content.length > 280) {
    return NextResponse.json(
      { error: 'Content exceeds 280 characters', code: 'CONTENT_TOO_LONG' },
      { status: 400 }
    );
  }

  if (!scheduledAt) {
    return NextResponse.json(
      { error: 'scheduledAt is required', code: 'INVALID_INPUT' },
      { status: 400 }
    );
  }

  const scheduleDate = new Date(scheduledAt);
  if (scheduleDate < new Date()) {
    return NextResponse.json(
      { error: 'scheduledAt must be in the future', code: 'INVALID_DATE' },
      { status: 400 }
    );
  }

  const scheduledPost = await db.scheduledPost.create({
    data: {
      userId: user!.id,
      content,
      mediaUrls,
      twitterAccountId,
      scheduledAt: scheduleDate,
      status: 'SCHEDULED',
    },
    include: {
      twitterAccount: {
        select: {
          id: true,
          username: true,
          displayName: true,
          profileImageUrl: true,
          role: true,
        },
      },
    },
  });

  const response = NextResponse.json(
    { scheduledPost },
    { status: 201 }
  );
  return addRateLimitHeaders(response, limitInfo);
}
