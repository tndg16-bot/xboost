import { NextResponse } from 'next/server';
import { withApiAuthAndRateLimit, addRateLimitHeaders, checkRateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';

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

  // Create a new post as a repost
  const repostContent = comment
    ? `${comment}\n\nRT: ${originalPost.content.substring(0, 200)}`
    : `RT: ${originalPost.content.substring(0, 280)}`;

  const repost = await db.post.create({
    data: {
      userId: user!.id,
      content: repostContent,
      twitterAccountId: originalPost.twitterAccountId,
      status: scheduledAt ? 'SCHEDULED' : 'PUBLISHED',
      publishedAt: scheduledAt ? null : new Date(),
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
    {
      repost,
      originalPostId: originalPost.id,
    },
    { status: 201 }
  );
  return addRateLimitHeaders(response, limitInfo);
}
