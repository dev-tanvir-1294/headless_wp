import type { WCPrice } from './types';

export function formatPrice(prices: WCPrice): string {
  const minor = prices.currency_minor_unit ?? 0;
  const amount = Number(prices.price) / Math.pow(10, minor);
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: minor,
    maximumFractionDigits: minor,
  });
  const symbol = (prices.currency_symbol ?? prices.currency_code ?? '').replace(/\u00a0/g, '').trim();

  if (prices.currency_prefix) return `${prices.currency_prefix}${formatted}`;
  if (symbol) return `${formatted}${symbol}`;
  return formatted;
}

export function priceAmount(prices: WCPrice): number {
  const minor = prices.currency_minor_unit ?? 0;
  return Number(prices.price) / Math.pow(10, minor);
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
