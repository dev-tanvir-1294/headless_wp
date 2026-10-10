'use client';

import { useState } from 'react';
import type { WCProduct } from '@/lib/types';
import { priceAmount } from '@/lib/format';
import { useCart } from './CartProvider';

export function AddToCartForm({ product }: { product: WCProduct }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const image = product.images?.[0]?.src ?? '';
  const symbol = (product.prices.currency_symbol ?? '').replace(/\u00a0/g, '').trim();

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image,
      price: priceAmount(product.prices),
      symbol,
      minorUnit: product.prices.currency_minor_unit ?? 0,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-sm border border-brand-line">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-12 w-10 text-lg text-brand-navy hover:bg-brand-smoke"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="h-12 w-10 text-lg text-brand-navy hover:bg-brand-smoke"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="btn-primary flex-1"
        >
          {added ? 'Added ✓' : 'Add to cart'}
        </button>
      </div>

      <p className="mt-2 text-xs text-brand-muted">
        {product.is_in_stock === false ? 'Out of stock' : 'In stock — ships within 3–5 days'}
      </p>
    </div>
  );
}
