import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';

export async function GET() {
  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
      type: 'recurring',
    });

    const plans = prices.data
      .filter((price: any) => price.product.active)
      .map((price: any) => ({
        id: price.id,
        name: price.product.name,
        description: price.product.description,
        price: price.unit_amount,
        currency: price.currency,
        interval: price.recurring?.interval,
        features: price.product.features || [],
      }));

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Prices fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices', code: 'PRICES_ERROR' },
      { status: 500 }
    );
  }
}
