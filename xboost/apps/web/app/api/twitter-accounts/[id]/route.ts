import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

type TwitterAccountRole = 'MAIN' | 'SUB' | 'NICHE';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const account = await db.twitterAccount.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      _count: {
        select: {
          posts: true,
          scheduledPosts: true,
        },
      },
    },
  });

  if (!account) {
    return NextResponse.json({ error: 'Twitter account not found' }, { status: 404 });
  }

  return NextResponse.json({ account });
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { role, color, description, displayName, isActive, order } = body;

  // Verify ownership
  const existing = await db.twitterAccount.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Twitter account not found' }, { status: 404 });
  }

  const account = await db.twitterAccount.update({
    where: { id },
    data: {
      ...(role !== undefined && { role: role as TwitterAccountRole }),
      ...(color !== undefined && { color }),
      ...(description !== undefined && { description }),
      ...(displayName !== undefined && { displayName }),
      ...(isActive !== undefined && { isActive }),
      ...(order !== undefined && { order }),
    },
  });

  return NextResponse.json({ account });
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify ownership
  const existing = await db.twitterAccount.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Twitter account not found' }, { status: 404 });
  }

  await db.twitterAccount.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
