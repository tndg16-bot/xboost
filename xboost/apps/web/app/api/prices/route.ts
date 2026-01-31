import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { Stripe } from 'stripe';

export async function GET() {
  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
      type: 'recurring',
    });

    const plans = prices.data
      .filter((price) => {
        const product = price.product as Stripe.Product;
        return product.active;
      })
      .map((price) => {
        const product = price.product as Stripe.Product;
        return {
          id: price.id,
          name: product.name,
          description: product.description,
          price: price.unit_amount,
          currency: price.currency,
          interval: price.recurring?.interval,
          features: (product as unknown as { features?: string[] }).features || [],
        };
      });

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Prices fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices', code: 'PRICES_ERROR' },
      { status: 500 }
    );
  }
}
