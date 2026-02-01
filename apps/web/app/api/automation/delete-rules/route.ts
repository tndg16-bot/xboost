import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - List all delete rules
export async function GET(_request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rules = await prisma.autoDeleteRule.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
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

  return NextResponse.json(rules);
}

// POST - Create a new delete rule
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { twitterAccountId, deleteAfterDays, enabled = true } = body;

    // Validate
    if (!deleteAfterDays || deleteAfterDays < 1) {
      return NextResponse.json({ error: 'Invalid deleteAfterDays value' }, { status: 400 });
    }

    // Verify twitter account belongs to user
    if (twitterAccountId) {
      const account = await prisma.twitterAccount.findFirst({
        where: { id: twitterAccountId, userId: session.user.id },
      });
      if (!account) {
        return NextResponse.json({ error: 'Twitter account not found' }, { status: 403 });
      }
    }

    const rule = await prisma.autoDeleteRule.create({
      data: {
        userId: session.user.id,
        twitterAccountId,
        deleteAfterDays,
        enabled,
      },
    });

    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    console.error('Error creating delete rule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
