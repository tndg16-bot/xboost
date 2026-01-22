import { NextResponse } from 'next/server';
import { withApiAuthAndRateLimit, addRateLimitHeaders, checkRateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED' | 'DELETED';

interface RouteContext {
  params: { id: string };
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const authResponse = await withApiAuthAndRateLimit(request);
  if (authResponse) return authResponse;

  const user = await (await import('@/lib/api-auth')).authenticateApiKey(request);
  const limitInfo = await checkRateLimit(request);

  const post = await db.post.findFirst({
    where: {
      id: params.id,
      userId: user!.id,
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

  if (!post) {
    return NextResponse.json(
      { error: 'Post not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  const response = NextResponse.json({ post });
  return addRateLimitHeaders(response, limitInfo);
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  const authResponse = await withApiAuthAndRateLimit(request);
  if (authResponse) return authResponse;

  const body = await request.json();
  const { content, mediaUrls, status, twitterAccountId } = body;
  const limitInfo = await checkRateLimit(request);

  const user = await (await import('@/lib/api-auth')).authenticateApiKey(request);

  // Verify ownership
  const existing = await db.post.findFirst({
    where: { id: params.id, userId: user!.id },
  });

  if (!existing) {
    return NextResponse.json(
      { error: 'Post not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  // Validate content update
  if (content !== undefined) {
    if (typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content must be a string', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }
    if (content.length > 280) {
      return NextResponse.json(
        { error: 'Content exceeds 280 characters', code: 'CONTENT_TOO_LONG' },
        { status: 400 }
      );
    }
  }

  const post = await db.post.update({
    where: { id: params.id },
    data: {
      ...(content !== undefined && { content }),
      ...(mediaUrls !== undefined && { mediaUrls }),
      ...(status !== undefined && { status: status as PostStatus }),
      ...(twitterAccountId !== undefined && { twitterAccountId }),
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

  const response = NextResponse.json({ post });
  return addRateLimitHeaders(response, limitInfo);
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  const authResponse = await withApiAuthAndRateLimit(request);
  if (authResponse) return authResponse;

  const user = await (await import('@/lib/api-auth')).authenticateApiKey(request);
  const limitInfo = await checkRateLimit(request);

  // Verify ownership
  const existing = await db.post.findFirst({
    where: { id: params.id, userId: user!.id },
  });

  if (!existing) {
    return NextResponse.json(
      { error: 'Post not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  await db.post.update({
    where: { id: params.id },
    data: { status: 'DELETED' },
  });

  const response = NextResponse.json({ success: true });
  return addRateLimitHeaders(response, limitInfo);
}
