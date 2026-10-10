'use client';

import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

function money(price: number, symbol: string, minorUnit: number) {
  return `${symbol}${price.toLocaleString('en-US', {
    minimumFractionDigits: minorUnit,
    maximumFractionDigits: minorUnit,
  })}`;
}

export default function CartPage() {
  const { items, count, subtotal, updateQuantity, removeItem, clear } = useCart();
  const symbol = items[0]?.symbol ?? '৳';
  const minorUnit = items[0]?.minorUnit ?? 2;

  if (items.length === 0) {
    return (
      <div className="container-site flex flex-col items-center py-24 text-center">
        <h1 className="text-2xl font-semibold text-brand-navy">Your cart is empty</h1>
        <p className="mt-2 text-sm text-brand-muted">Add something you love to get started.</p>
        <Link href="/shop" className="btn-primary mt-6">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-site py-8">
      <h1 className="mb-6 text-2xl font-semibold text-brand-navy">
        Your cart <span className="text-brand-muted">({count} items)</span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="divide-y divide-brand-line border-y border-brand-line">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4">
                <Link
                  href={`/product/${item.slug}`}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-sm bg-brand-smoke"
                >
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-brand-muted" />
                  )}
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <Link href={`/product/${item.slug}`} className="font-medium text-brand-ink hover:text-brand-orange">
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-brand-muted hover:text-brand-orange"
                    >
                      Remove
                    </button>
                  </div>
                  <span className="mt-1 text-sm text-brand-navy">
                    {money(item.price, item.symbol, item.minorUnit)}
                  </span>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-sm border border-brand-line">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-9 w-9 text-brand-navy hover:bg-brand-smoke"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-9 w-9 text-brand-navy hover:bg-brand-smoke"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-brand-ink">
                      {money(item.price * item.quantity, item.symbol, item.minorUnit)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={clear}
            className="mt-4 text-sm text-brand-muted hover:text-brand-orange"
          >
            Clear cart
          </button>
        </div>

        <aside className="h-fit rounded-sm border border-brand-line p-5">
          <h2 className="mb-4 text-lg font-semibold text-brand-navy">Order summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-muted">Subtotal</span>
              <span className="font-medium">{money(subtotal, symbol, minorUnit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Shipping</span>
              <span className="font-medium">Calculated at checkout</span>
            </div>
            <div className="flex justify-between border-t border-brand-line pt-3 text-base font-semibold">
              <span className="text-brand-navy">Total</span>
              <span>{money(subtotal, symbol, minorUnit)}</span>
            </div>
          </div>
          <Link href="/checkout" className="btn-primary mt-5 w-full">
            Proceed to checkout
          </Link>
          <Link href="/shop" className="mt-3 block text-center text-sm text-brand-muted hover:text-brand-orange">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
