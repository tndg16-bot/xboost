import { NextResponse } from 'next/server';
import { withApiAuthAndRateLimit, addRateLimitHeaders, checkRateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED' | 'DELETED';

export async function GET(request: Request) {
  const authResponse = await withApiAuthAndRateLimit(request);
  if (authResponse) return authResponse;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as PostStatus | null;
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const twitterAccountId = searchParams.get('twitterAccountId');

  const user = await (await import('@/lib/api-auth')).authenticateApiKey(request);
  const limitInfo = await checkRateLimit(request);

  const where = {
    userId: user!.id,
    ...(status && { status }),
    ...(twitterAccountId && { twitterAccountId }),
  };

  const [posts, total] = await Promise.all([
    db.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
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
    }),
    db.post.count({ where }),
  ]);

  const response = NextResponse.json({ posts, total, limit, offset });
  return addRateLimitHeaders(response, limitInfo);
}

export async function POST(request: Request) {
  const authResponse = await withApiAuthAndRateLimit(request);
  if (authResponse) return authResponse;

  const body = await request.json();
  const { content, mediaUrls = [], twitterAccountId, status = 'DRAFT' } = body;
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

  const post = await db.post.create({
    data: {
      userId: user!.id,
      content,
      mediaUrls,
      twitterAccountId,
      status: status as PostStatus,
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

  const response = NextResponse.json({ post }, { status: 201 });
  return addRateLimitHeaders(response, limitInfo);
}
