export const WP_BASE_URL = (process.env.NEXT_PUBLIC_WP_BASE_URL || 'https://redbox.page.gd').replace(/\/+$/, '');

export const WP_API = `${WP_BASE_URL}/wp-json`;

export const STORE_API = `${WP_API}/wc/store/v1`;

export const WC_API = `${WP_API}/wc/v3`;

export const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY ?? '';

export const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET ?? '';
