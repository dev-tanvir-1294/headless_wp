import { createDecipheriv } from 'node:crypto';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

/**
 * The host in front of this WordPress install (page.gd / openresty) puts a
 * small JavaScript AES cookie challenge in front of every document/API request.
 * It is not a real CAPTCHA — the page exposes a static key pair (a, b) and a
 * per-request ciphertext (c). Solving it means decrypting `c` with AES-128-CBC
 * (key = a, iv = b, no padding) and echoing the result back as the `__test`
 * cookie. This module implements that so server-side data fetching works.
 */

function hexToBuffer(hex: string): Buffer {
  return Buffer.from(hex, 'hex');
}

function extract(html: string, name: string): string | null {
  const m = html.match(new RegExp(name + '=toNumbers\\("([0-9a-f]+)"\\)'));
  return m ? m[1] : null;
}

export function isChallenge(body: string): boolean {
  return body.includes('slowAES') && body.includes('__test');
}

export function solveChallenge(body: string): string | null {
  const a = extract(body, 'a');
  const b = extract(body, 'b');
  const c = extract(body, 'c');
  if (!a || !b || !c) return null;

  const decipher = createDecipheriv('aes-128-cbc', hexToBuffer(a), hexToBuffer(b));
  decipher.setAutoPadding(false);
  const out = Buffer.concat([decipher.update(hexToBuffer(c)), decipher.final()]);
  return out.toString('hex');
}

function mergeCookies(...values: (string | null | undefined)[]): string {
  const cookies: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    if (!value) continue;
    for (const part of value.split(';')) {
      const name = part.trim().split('=')[0];
      if (name && !seen.has(name)) {
        seen.add(name);
        cookies.push(part.trim());
      }
    }
  }
  return cookies.join('; ');
}

/**
 * Fetch a URL from the WordPress host, transparently solving the anti-bot
 * challenge on the first attempt when it is encountered. Returns the final
 * (real) Response.
 */
export async function wpFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const baseHeaders: Record<string, string> = {
    'user-agent': UA,
    accept: 'application/json',
  };
  const requestHeaders = new Headers(init.headers);
  requestHeaders.forEach((value, key) => {
    baseHeaders[key] = value;
  });

  let response = await fetch(url, { ...init, headers: baseHeaders, redirect: 'manual' });
  const body = await response.clone().text();

  if (isChallenge(body)) {
    const cookie = solveChallenge(body);
    if (cookie) {
      const setCookie = response.headers.get('set-cookie');
      const cookieHeader = mergeCookies(setCookie, `__test=${cookie}`);
      const separator = url.includes('?') ? '&' : '?';
      const retryHeaders: Record<string, string> = { ...baseHeaders, cookie: cookieHeader };
      response = await fetch(url + separator + 'i=1', {
        ...init,
        headers: retryHeaders,
        redirect: 'manual',
      });
    }
  }

  return response;
}
