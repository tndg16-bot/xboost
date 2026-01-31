import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { prisma } from '@/lib/prisma';
import { Stripe } from 'stripe';

const db = prisma;

type StripeSubscriptionWithTimestamps = Stripe.Subscription & {
  current_period_start?: number;
  current_period_end?: number;
  cancel_at_period_end?: boolean;
};

type StripeInvoiceWithSubscription = Stripe.Invoice & {
  subscription?: string | Stripe.Subscription;
};

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

  let event: Stripe.Event;

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

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const subscriptionId = typeof session.subscription === 'string'
    ? session.subscription
    : session.subscription?.id;

  if (!subscriptionId) {
    throw new Error('Missing subscription in session');
  }

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
  }) as StripeSubscriptionWithTimestamps;

  const price = subscription.items.data[0].price;

  await syncSubscriptionToDb(subscription, userId, price);
}

async function handleSubscriptionCreated(subscription: StripeSubscriptionWithTimestamps) {
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

  const price = subscription.items.data[0].price;
  await syncSubscriptionToDb(subscription, userId, price);
}

async function handleSubscriptionUpdated(subscription: StripeSubscriptionWithTimestamps) {
  const planType = mapPriceIdToPlanType(subscription.items.data[0].price.id);

  const currentPeriodStart = subscription.current_period_start
    ? new Date(subscription.current_period_start * 1000)
    : undefined;
  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : undefined;

  await db.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status.toUpperCase() as 'ACTIVE' | 'TRIALING' | 'CANCELED' | 'PAST_DUE',
      cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
      ...(currentPeriodStart && { currentPeriodStart }),
      ...(currentPeriodEnd && { currentPeriodEnd }),
      planType,
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await db.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: 'CANCELED',
      canceledAt: new Date(),
    },
  });
}

async function handleInvoicePaid(invoice: StripeInvoiceWithSubscription) {
  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription?.id;

  if (!subscriptionId) {
    console.error('Invoice missing subscription:', invoice.id);
    return;
  }

  await db.subscription.update({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      status: 'ACTIVE',
    },
  });

  await db.invoice.create({
    data: {
      stripeInvoiceId: invoice.id,
      userId: invoice.metadata?.userId ?? '',
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: invoice.status ?? 'unknown',
      hostedUrl: invoice.hosted_invoice_url ?? null,
      pdfUrl: invoice.invoice_pdf ?? null,
    },
  });
}

async function handleInvoiceFailed(invoice: StripeInvoiceWithSubscription) {
  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription?.id;

  if (!subscriptionId) {
    console.error('Invoice missing subscription:', invoice.id);
    return;
  }

  await db.subscription.update({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      status: 'PAST_DUE',
    },
  });
}

async function syncSubscriptionToDb(
  subscription: StripeSubscriptionWithTimestamps,
  userId: string,
  price: Stripe.Price
) {
  const planType = mapPriceIdToPlanType(price.id);
  const { accountsLimit, automationEnabled } = getPlanLimits(planType);
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id;

  const currentPeriodStart = subscription.current_period_start
    ? new Date(subscription.current_period_start * 1000)
    : new Date();
  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : new Date();

  await db.subscription.create({
    data: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      stripePriceId: price.id,
      planType,
      status: subscription.status.toUpperCase() as 'ACTIVE' | 'TRIALING' | 'CANCELED' | 'PAST_DUE',
      currentPeriodStart,
      currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
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
