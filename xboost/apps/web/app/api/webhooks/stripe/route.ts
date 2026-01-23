import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { prisma } from '@/lib/prisma';
import _crypto from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaid(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handleInvoiceFailed(event.data.object);
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: any) {
  const subscriptionId = session.subscription as string;
  const userId = session.metadata?.userId;

  if (!userId) {
    throw new Error('Missing userId in session metadata');
  }

  const existing = await db.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (existing) {
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['items.data.price'],
  });

  const price = subscription.items.data[0].price as any;

  await syncSubscriptionToDb(subscription, userId, price);
}

async function handleSubscriptionCreated(subscription: any) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    throw new Error('Missing userId in subscription metadata');
  }

  const existing = await db.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (existing) {
    return;
  }

  const price = subscription.items.data[0].price as any;
  await syncSubscriptionToDb(subscription, userId, price);
}

async function handleSubscriptionUpdated(subscription: any) {
  const planType = mapPriceIdToPlanType(subscription.items.data[0].price.id);

  await db.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status.toUpperCase(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      planType,
    },
  });
}

async function handleSubscriptionDeleted(subscription: any) {
  await db.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: 'CANCELED',
      canceledAt: new Date(),
    },
  });
}

async function handleInvoicePaid(invoice: any) {
  await db.subscription.update({
    where: { stripeSubscriptionId: invoice.subscription },
    data: {
      status: 'ACTIVE',
    },
  });

  await db.invoice.create({
    data: {
      stripeInvoiceId: invoice.id,
      userId: invoice.metadata?.userId,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: invoice.status,
      hostedUrl: invoice.hosted_url,
      pdfUrl: invoice.invoice_pdf,
    },
  });
}

async function handleInvoiceFailed(invoice: any) {
  await db.subscription.update({
    where: { stripeSubscriptionId: invoice.subscription },
    data: {
      status: 'PAST_DUE',
    },
  });
}

async function syncSubscriptionToDb(subscription: any, userId: string, price: any) {
  const planType = mapPriceIdToPlanType(price.id);
  const { accountsLimit, automationEnabled } = getPlanLimits(planType);

  await db.subscription.create({
    data: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer,
      stripePriceId: price.id,
      planType,
      status: subscription.status.toUpperCase(),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      accountsLimit,
      automationEnabled,
    },
  });
}

function mapPriceIdToPlanType(priceId: string): 'STARTER' | 'PRO' | 'TEAM' {
  if (priceId.includes('starter')) return 'STARTER';
  if (priceId.includes('team')) return 'TEAM';
  return 'PRO';
}

function getPlanLimits(planType: 'STARTER' | 'PRO' | 'TEAM') {
  switch (planType) {
    case 'STARTER':
      return { accountsLimit: 1, automationEnabled: false };
    case 'PRO':
      return { accountsLimit: 5, automationEnabled: true };
    case 'TEAM':
      return { accountsLimit: 999, automationEnabled: true };
    default:
      return { accountsLimit: 1, automationEnabled: false };
  }
}
