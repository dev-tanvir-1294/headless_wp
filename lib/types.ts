export interface WCImage {
  id: number;
  src: string;
  thumbnail: string;
  srcset?: string;
  alt?: string;
}

export interface WCPrice {
  price: string;
  regular_price: string;
  sale_price: string;
  price_range: unknown;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface WCCategoryRef {
  id: number;
  name: string;
  slug: string;
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  status: string;
  short_description: string;
  description: string;
  sku: string;
  on_sale: boolean;
  average_rating: string;
  review_count: number;
  prices: WCPrice;
  images: WCImage[];
  categories: WCCategoryRef[];
  tags?: { id: number; name: string; slug: string }[];
  attributes?: {
    id: number;
    name: string;
    taxonomy: string;
    has_variations: boolean;
    terms: { id: number; name: string; slug: string }[];
  }[];
  has_options: boolean;
  is_purchasable?: boolean;
  is_in_stock?: boolean;
  is_on_backorder?: boolean;
  low_stock_remaining?: number | null;
  stock_availability?: { text: string; class: string };
  add_to_cart?: {
    text: string;
    description: string;
  };
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  description?: string;
  image?: WCImage | null;
}
