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
    const rules = await db.autoDeleteRule.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ rules });
  } catch (error) {
    console.error('Auto delete rules fetch error:', error);
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
    const { conditionType, daysThreshold, impressionsThreshold, isEnabled = true } = body;

    const rule = await db.autoDeleteRule.create({
      data: {
        userId: session.user.id,
        conditionType: conditionType || 'DAYS_AFTER_PUBLISH',
        daysThreshold: daysThreshold || 30,
        impressionsThreshold: impressionsThreshold,
        isEnabled,
      },
    });

    return NextResponse.json({ rule }, { status: 201 });
  } catch (error) {
    console.error('Auto delete rule creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create rule', code: 'CREATE_ERROR' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const ruleId = searchParams.get('id');

    if (!ruleId) {
      return NextResponse.json(
        { error: 'Rule ID is required', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    await db.autoDeleteRule.delete({
      where: {
        id: ruleId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Auto delete rule deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete rule', code: 'DELETE_ERROR' },
      { status: 500 }
    );
  }
}
