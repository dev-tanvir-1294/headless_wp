import { NextResponse } from 'next/server';
import { createWcOrder } from '@/lib/orders';
import type { CreateOrderInput } from '@/lib/orders';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: {
    items?: { id: number; quantity: number }[];
    billing?: CreateOrderInput['billing'];
    shipping?: CreateOrderInput['shipping'];
    paymentMethod?: string;
    customerNote?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.items?.length) {
    return NextResponse.json({ ok: false, error: 'Cart is empty' }, { status: 400 });
  }

  const result = await createWcOrder({
    items: body.items.map((i) => ({ productId: i.id, quantity: i.quantity })),
    billing: body.billing ?? {},
    shipping: body.shipping ?? {},
    paymentMethod: body.paymentMethod ?? 'cod',
    customerNote: body.customerNote,
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: 502 });
  }

  return NextResponse.json(result);
}
