import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED' | 'DELETED';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as PostStatus | null;
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  const where = {
    userId: session.user.id,
    ...(status && { status }),
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
          },
        },
      },
    }),
    db.post.count({ where }),
  ]);

  return NextResponse.json({ posts, total, limit, offset });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { content, mediaUrls = [], twitterAccountId, status = 'DRAFT' } = body;

  if (!content || typeof content !== 'string') {
    return NextResponse.json(
      { error: 'Content is required' },
      { status: 400 }
    );
  }

  if (content.length > 280) {
    return NextResponse.json(
      { error: 'Content exceeds 280 characters' },
      { status: 400 }
    );
  }

  const post = await db.post.create({
    data: {
      userId: session.user.id,
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
        },
      },
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
