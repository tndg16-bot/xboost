import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const hours = parseInt(searchParams.get('hours') || '24', 10);
    const threshold = parseInt(searchParams.get('threshold') || '100000', 10);

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const viralPosts = await db.post.findMany({
      where: {
        userId: session.user.id,
        status: 'PUBLISHED',
        publishedAt: {
          gte: since,
        },
        impressions: {
          gte: threshold,
        },
      },
      orderBy: {
        impressions: 'desc',
      },
      take: 50,
      select: {
        id: true,
        content: true,
        impressions: true,
        likes: true,
        retweets: true,
        replies: true,
        publishedAt: true,
        twitterPostId: true,
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

    return NextResponse.json({
      posts: viralPosts,
      count: viralPosts.length,
      threshold,
      since,
    });
  } catch (error) {
    console.error('Viral posts fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch viral posts', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}
