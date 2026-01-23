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
    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription) {
      return NextResponse.json({ subscription: null });
    }

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        planType: subscription.planType,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        accountsLimit: subscription.accountsLimit,
        automationEnabled: subscription.automationEnabled,
      },
    });
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}
