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
    const rules = await db.autoRepostRule.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ rules });
  } catch (error) {
    console.error('Auto repost rules fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rules', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { condition, threshold, delayHours, maxReposts, addComment, comment } = body;

    const rule = await db.autoRepostRule.create({
      data: {
        userId: session.user.id,
        enabled: true,
        condition: condition || 'IMPRESSIONS',
        threshold: threshold || 100000,
        delayHours: delayHours || 24,
        maxReposts: maxReposts || 3,
        addComment: addComment || false,
        comment: addComment ? comment : null,
      },
    });

    return NextResponse.json({ rule }, { status: 201 });
  } catch (error) {
    console.error('Auto repost rule creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create rule', code: 'CREATE_ERROR' },
      { status: 500 }
    );
  }
}
