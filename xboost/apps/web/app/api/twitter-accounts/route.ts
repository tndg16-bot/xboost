import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

type TwitterAccountRole = 'MAIN' | 'SUB' | 'NICHE';

export async function GET(_request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accounts = await db.twitterAccount.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' },
    ],
    include: {
      _count: {
        select: {
          posts: true,
          scheduledPosts: true,
        },
      },
    },
  });

  return NextResponse.json({ accounts });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { twitterId, username, displayName, profileImageUrl, accessToken, refreshToken, tokenExpiresAt, role = 'SUB', color, description } = body;

  // Validate required fields
  if (!twitterId || !username || !accessToken) {
    return NextResponse.json(
      { error: 'Missing required fields: twitterId, username, accessToken' },
      { status: 400 }
    );
  }

  // Check if account already exists for this user
  const existing = await db.twitterAccount.findFirst({
    where: {
      userId: session.user.id,
      twitterId,
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: 'Twitter account already linked' },
      { status: 409 }
    );
  }

  // Get current max order for sorting
  const maxOrder = await db.twitterAccount.findFirst({
    where: { userId: session.user.id },
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  const account = await db.twitterAccount.create({
    data: {
      userId: session.user.id,
      twitterId,
      username,
      displayName,
      profileImageUrl,
      accessToken,
      refreshToken,
      tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : null,
      role: role as TwitterAccountRole,
      color: color || '#3B82F6',
      description,
      order: (maxOrder?.order || 0) + 1,
    },
  });

  return NextResponse.json({ account }, { status: 201 });
}
