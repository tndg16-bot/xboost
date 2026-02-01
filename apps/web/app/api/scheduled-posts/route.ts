import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - List all scheduled posts
export async function GET(_request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const posts = await prisma.scheduledPost.findMany({
    where: { userId: session.user.id },
    orderBy: { scheduledAt: 'asc' },
    include: {
      twitterAccount: {
        select: {
          id: true,
          username: true,
          displayName: true,
          role: true,
        },
      },
    },
  });

  return NextResponse.json(posts);
}

// POST - Create a new scheduled post
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { content, scheduledAt, twitterAccountId } = body;

    // Validate
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    if (!scheduledAt) {
      return NextResponse.json({ error: 'Scheduled time is required' }, { status: 400 });
    }

    // Verify twitter account belongs to user if provided
    if (twitterAccountId) {
      const account = await prisma.twitterAccount.findFirst({
        where: { id: twitterAccountId, userId: session.user.id },
      });
      if (!account) {
        return NextResponse.json({ error: 'Twitter account not found' }, { status: 403 });
      }
    }

    const post = await prisma.scheduledPost.create({
      data: {
        userId: session.user.id,
        twitterAccountId,
        content,
        mediaUrls: [],
        scheduledAt: new Date(scheduledAt),
        status: 'SCHEDULED',
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating scheduled post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
