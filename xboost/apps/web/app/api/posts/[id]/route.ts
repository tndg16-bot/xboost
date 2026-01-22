import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'FAILED' | 'DELETED';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const post = await db.post.findFirst({
    where: {
      id,
      userId: session.user.id,
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

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { content, mediaUrls, twitterAccountId, status } = body;

  const existingPost = await db.post.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!existingPost) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  if (content && content.length > 280) {
    return NextResponse.json(
      { error: 'Content exceeds 280 characters' },
      { status: 400 }
    );
  }

  const post = await db.post.update({
    where: { id },
    data: {
      ...(content !== undefined && { content }),
      ...(mediaUrls !== undefined && { mediaUrls }),
      ...(twitterAccountId !== undefined && { twitterAccountId }),
      ...(status !== undefined && { status: status as PostStatus }),
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

  return NextResponse.json({ post });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const existingPost = await db.post.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!existingPost) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  await db.post.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
