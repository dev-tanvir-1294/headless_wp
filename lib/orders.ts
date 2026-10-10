import { wpFetch } from './anti-bot';
import { WC_API, WC_CONSUMER_KEY, WC_CONSUMER_SECRET } from './config';

export interface OrderLineItem {
  productId: number;
  quantity: number;
}

export interface OrderAddress {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  postcode?: string;
  country?: string;
}

export interface CreateOrderInput {
  items: OrderLineItem[];
  billing: OrderAddress;
  shipping: OrderAddress;
  paymentMethod: string;
  customerNote?: string;
}

export interface CreateOrderResult {
  ok: boolean;
  orderId?: number;
  orderNumber?: string;
  status?: string;
  error?: string;
}

function basicAuth(): string {
  const token = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');
  return `Basic ${token}`;
}

/**
 * Creates a WooCommerce order through the authenticated REST API (`wc/v3/orders`).
 * This is stateless and reliable (no Store API nonce/session dance). Uses the
 * consumer key/secret from the environment for Basic Auth.
 */
export async function createWcOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    return {
      ok: false,
      error: 'WooCommerce API keys are not configured. Add WC_CONSUMER_KEY and WC_CONSUMER_SECRET to .env.local.',
    };
  }

  try {
    const response = await wpFetch(`${WC_API}/orders`, {
      method: 'POST',
      headers: {
        authorization: basicAuth(),
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        payment_method: input.paymentMethod,
        payment_method_title: input.paymentMethod === 'cod' ? 'Cash on delivery' : input.paymentMethod,
        status: 'pending',
        set_paid: false,
        billing: input.billing,
        shipping: input.shipping,
        customer_note: input.customerNote ?? '',
        line_items: input.items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
      }),
    });

    if (!response.ok) {
      let message = `Order creation failed (${response.status})`;
      try {
        const data = (await response.json()) as { message?: string; code?: string };
        message = data.message || data.code || message;
      } catch {
        // ignore body parse errors
      }
      return { ok: false, error: message };
    }

    const data = (await response.json()) as {
      id?: number;
      number?: string;
      status?: string;
    };

    return {
      ok: true,
      orderId: data.id,
      orderNumber: data.number,
      status: data.status,
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Unexpected order error' };
  }
}
