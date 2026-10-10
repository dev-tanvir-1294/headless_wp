'use client';

import Link from 'next/link';
import type { WCProduct } from '@/lib/types';
import { formatPrice, priceAmount } from '@/lib/format';
import { useCart } from './CartProvider';

export function ProductCard({ product }: { product: WCProduct }) {
  const { addItem } = useCart();
  const image = product.images?.[0]?.src ?? null;
  const symbol = (product.prices.currency_symbol ?? '').replace(/\u00a0/g, '').trim();

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: image ?? '',
      price: priceAmount(product.prices),
      symbol,
      minorUnit: product.prices.currency_minor_unit ?? 0,
    });
  };

  return (
    <div className="group flex flex-col">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-brand-smoke"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-muted">
            No image
          </div>
        )}
        {product.on_sale && (
          <span className="absolute left-3 top-3 bg-brand-orange px-2 py-1 text-xs font-semibold uppercase text-white">
            Sale
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 pt-3">
        <Link href={`/product/${product.slug}`} className="text-sm font-medium text-brand-ink hover:text-brand-orange">
          {product.name}
        </Link>
        {product.categories?.[0] && (
          <span className="text-xs uppercase tracking-wide text-brand-muted">
            {product.categories[0].name}
          </span>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-base font-semibold text-brand-navy">
            {formatPrice(product.prices)}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-sm border border-brand-navy px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
