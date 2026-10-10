import { wpFetch } from './anti-bot';
import { STORE_API } from './config';
import type { WCCategory, WCProduct } from './types';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await wpFetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`WooCommerce request failed (${response.status}) for ${url}`);
  }
  return (await response.json()) as T;
}

function buildParams(params: Record<string, string | number | boolean | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export interface ProductQuery {
  category?: string;
  search?: string;
  perPage?: number;
  page?: number;
  orderby?: 'price' | 'popularity' | 'rating' | 'date' | 'title';
  order?: 'asc' | 'desc';
  onSale?: boolean;
  featured?: boolean;
}

export async function getProducts(query: ProductQuery = {}): Promise<WCProduct[]> {
  const params = buildParams({
    category: query.category,
    search: query.search,
    per_page: query.perPage ?? 50,
    page: query.page ?? 1,
    orderby: query.orderby,
    order: query.order,
    on_sale: query.onSale,
    featured: query.featured,
  });
  return fetchJson<WCProduct[]>(`${STORE_API}/products${params}`);
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  const products = await fetchJson<WCProduct[]>(
    `${STORE_API}/products?slug=${encodeURIComponent(slug)}&per_page=1`
  );
  return products[0] ?? null;
}

export async function getCategories(): Promise<WCCategory[]> {
  return fetchJson<WCCategory[]>(`${STORE_API}/products/categories?per_page=100`);
}

export async function getCategoryBySlug(slug: string): Promise<WCCategory | null> {
  const categories = await fetchJson<WCCategory[]>(
    `${STORE_API}/products/categories?slug=${encodeURIComponent(slug)}&per_page=1`
  );
  return categories[0] ?? null;
}
