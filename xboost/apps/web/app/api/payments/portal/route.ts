import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe-server';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No subscription found', code: 'NO_SUBSCRIPTION' },
        { status: 404 }
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    } as any);

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Portal session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session', code: 'PORTAL_ERROR' },
      { status: 500 }
    );
  }
}
