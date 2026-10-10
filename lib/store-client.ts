import { isChallenge, solveChallenge } from './anti-bot';
import { STORE_API } from './config';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

export interface CheckoutInput {
  items: { id: number; quantity: number }[];
  billing: Record<string, string>;
  shipping: Record<string, string>;
  paymentMethod: string;
  customerNote?: string;
}

export interface CheckoutResult {
  ok: boolean;
  orderId?: number;
  status?: string;
  error?: string;
}

/**
 * A session-aware WooCommerce Store API client. The Store API cart/checkout is
 * session (cookie) based, so a single client instance keeps cookies across the
 * add-to-cart and checkout calls, while still solving the anti-bot challenge on
 * first contact.
 */
export class StoreSession {
  private cookies = new Map<string, string>();
  private nonce: string | null = null;

  private cookieHeader(): string {
    return [...this.cookies.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
  }

  private storeSetCookie(setCookie: string | null): void {
    if (!setCookie) return;
    for (const part of setCookie.split(',')) {
      const eq = part.split(';')[0].indexOf('=');
      if (eq === -1) continue;
      const key = part.slice(0, eq).trim();
      const value = part.split(';')[0].slice(eq + 1).trim();
      if (key && value) this.cookies.set(key, value);
    }
  }

  private async request(
    url: string,
    init: RequestInit = {}
  ): Promise<{ response: Response; body: string }> {
    const headers: Record<string, string> = {
      'user-agent': UA,
      accept: 'application/json',
      'content-type': 'application/json',
    };
    const cookie = this.cookieHeader();
    if (cookie) headers.cookie = cookie;
    if (this.nonce) headers['X-WC-Store-API-Nonce'] = this.nonce;

    let response = await fetch(url, { ...init, headers, redirect: 'manual' });
    this.storeSetCookie(response.headers.get('set-cookie'));
    const nonceHeader = response.headers.get('X-WC-Store-API-Nonce');
    if (nonceHeader) this.nonce = nonceHeader;

    let body = await response.text();

    if (isChallenge(body)) {
      const solved = solveChallenge(body);
      if (solved) {
        this.cookies.set('__test', solved);
        const retryHeaders: Record<string, string> = { ...headers, cookie: this.cookieHeader() };
        if (this.nonce) retryHeaders['X-WC-Store-API-Nonce'] = this.nonce;
        const separator = url.includes('?') ? '&' : '?';
        response = await fetch(url + separator + 'i=1', {
          ...init,
          headers: retryHeaders,
          redirect: 'manual',
        });
        this.storeSetCookie(response.headers.get('set-cookie'));
        const nonceHeader2 = response.headers.get('X-WC-Store-API-Nonce');
        if (nonceHeader2) this.nonce = nonceHeader2;
        body = await response.text();
      }
    }

    return { response, body };
  }

  async addToCart(id: number, quantity: number): Promise<void> {
    const { response } = await this.request(`${STORE_API}/cart/add-item`, {
      method: 'POST',
      body: JSON.stringify({ id, quantity }),
    });
    if (!response.ok) {
      throw new Error(`Failed to add item ${id} to cart (${response.status})`);
    }
  }

  async checkout(input: CheckoutInput): Promise<CheckoutResult> {
    try {
      for (const item of input.items) {
        await this.addToCart(item.id, item.quantity);
      }

      const { response, body } = await this.request(`${STORE_API}/checkout`, {
        method: 'POST',
        body: JSON.stringify({
          billing_address: input.billing,
          shipping_address: input.shipping,
          payment_method: input.paymentMethod,
          customer_note: input.customerNote ?? '',
        }),
      });

      if (!response.ok) {
        let message = `Checkout failed (${response.status})`;
        try {
          const data = JSON.parse(body);
          message = data.message || data.code || message;
        } catch {
          // ignore parse errors
        }
        return { ok: false, error: message };
      }

      const data = JSON.parse(body) as {
        order_id?: number;
        order_key?: string;
        status?: string;
        payment_result?: { payment_status?: string };
      };

      return {
        ok: true,
        orderId: data.order_id,
        status: data.status ?? data.payment_result?.payment_status,
      };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Unexpected checkout error' };
    }
  }
}
