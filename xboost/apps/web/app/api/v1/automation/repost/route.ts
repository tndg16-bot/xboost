import { NextResponse } from 'next/server';
import { withApiAuthAndRateLimit, addRateLimitHeaders, checkRateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';
import { quoteRetweet, retweet } from '@/services/twitter-publisher';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function POST(request: Request) {
  const authResponse = await withApiAuthAndRateLimit(request);
  if (authResponse) return authResponse;

  const body = await request.json();
  const { postId, comment, scheduledAt } = body;
  const limitInfo = await checkRateLimit(request);

  const user = await (await import('@/lib/api-auth')).authenticateApiKey(request);

  if (!postId) {
    return NextResponse.json(
      { error: 'postId is required', code: 'INVALID_INPUT' },
      { status: 400 }
    );
  }

  // Find the original post to repost
  const originalPost = await db.post.findFirst({
    where: {
      id: postId,
      userId: user!.id,
      status: 'PUBLISHED',
    },
  });

  if (!originalPost) {
    return NextResponse.json(
      { error: 'Original post not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  // If scheduledAt is provided, create a scheduled post for later
  if (scheduledAt) {
    const scheduledPost = await db.scheduledPost.create({
      data: {
        userId: user!.id,
        twitterAccountId: originalPost.twitterAccountId,
        content: comment
          ? `${comment}\n\nRT: ${originalPost.content.substring(0, 200)}`
          : `RT: ${originalPost.content.substring(0, 280)}`,
        scheduledAt: new Date(scheduledAt),
        status: 'SCHEDULED',
      },
    });

    const response = NextResponse.json(
      { scheduledPost, originalPostId: originalPost.id },
      { status: 201 }
    );
    return addRateLimitHeaders(response, limitInfo);
  }

  // Immediate repost via Twitter API
  if (!originalPost.twitterPostId || !originalPost.twitterAccountId) {
    return NextResponse.json(
      { error: 'Original post has no Twitter ID', code: 'NO_TWITTER_ID' },
      { status: 400 }
    );
  }

  let publishResult;
  if (comment) {
    publishResult = await quoteRetweet(
      originalPost.twitterPostId,
      comment,
      originalPost.twitterAccountId,
      user!.id
    );
  } else {
    publishResult = await retweet(
      originalPost.twitterPostId,
      originalPost.twitterAccountId,
      user!.id
    );
  }

  if (!publishResult.success) {
    return NextResponse.json(
      { error: `Repost failed: ${publishResult.error}`, code: 'REPOST_FAILED' },
      { status: 500 }
    );
  }

  const response = NextResponse.json(
    {
      success: true,
      twitterPostId: publishResult.twitterPostId,
      originalPostId: originalPost.id,
    },
    { status: 201 }
  );
  return addRateLimitHeaders(response, limitInfo);
}
