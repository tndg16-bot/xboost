import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - List all plug rules
export async function GET(_request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rules = await prisma.autoPlugRule.findMany({
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
      plugTemplate: true,
    },
  });

  return NextResponse.json(rules);
}

// POST - Create a new plug rule
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { twitterAccountId, plugTemplateId, enabled = true } = body;

    // Verify twitter account belongs to user
    if (twitterAccountId) {
      const account = await prisma.twitterAccount.findFirst({
        where: { id: twitterAccountId, userId: session.user.id },
      });
      if (!account) {
        return NextResponse.json({ error: 'Twitter account not found' }, { status: 403 });
      }
    }

    // Verify plug template belongs to user
    if (plugTemplateId) {
      const template = await prisma.plugTemplate.findFirst({
        where: { id: plugTemplateId, userId: session.user.id },
      });
      if (!template) {
        return NextResponse.json({ error: 'Plug template not found' }, { status: 403 });
      }
    }

    const rule = await prisma.autoPlugRule.create({
      data: {
        userId: session.user.id,
        twitterAccountId,
        plugTemplateId,
        enabled,
      },
    });

    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    console.error('Error creating plug rule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
