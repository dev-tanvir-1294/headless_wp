'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';

function money(price: number, symbol: string, minorUnit: number) {
  return `${symbol}${price.toLocaleString('en-US', {
    minimumFractionDigits: minorUnit,
    maximumFractionDigits: minorUnit,
  })}`;
}

const emptyForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address_1: '',
  city: '',
  postcode: '',
  country: 'BD',
};

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; orderId?: number; orderNumber?: string; status?: string; error?: string } | null>(
    null
  );

  const symbol = items[0]?.symbol ?? '৳';
  const minorUnit = items[0]?.minorUnit ?? 2;

  const set = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          billing: form,
          shipping: form,
          paymentMethod: 'cod',
        }),
      });
      const data = await res.json();
      setResult(data);
      if (data.ok) clear();
    } catch {
      setResult({ ok: false, error: 'Could not reach the checkout service.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (result?.ok) {
    return (
      <div className="container-site flex flex-col items-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-brand-navy">Order placed</h1>
        <p className="mt-2 text-sm text-brand-muted">
          {result.orderId ? `Order #${result.orderNumber ?? result.orderId}` : 'Thank you'} — we&apos;ll confirm by email shortly.
        </p>
        <Link href="/shop" className="btn-primary mt-6">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-site flex flex-col items-center py-24 text-center">
        <h1 className="text-2xl font-semibold text-brand-navy">Nothing to checkout</h1>
        <p className="mt-2 text-sm text-brand-muted">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary mt-6">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-site py-8">
      <h1 className="mb-6 text-2xl font-semibold text-brand-navy">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-navy">
              Contact & shipping
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="First name" required value={form.first_name} onChange={set('first_name')} />
              <Field label="Last name" required value={form.last_name} onChange={set('last_name')} />
              <Field label="Email" type="email" required value={form.email} onChange={set('email')} />
              <Field label="Phone" required value={form.phone} onChange={set('phone')} />
              <Field label="Address" required className="sm:col-span-2" value={form.address_1} onChange={set('address_1')} />
              <Field label="City" required value={form.city} onChange={set('city')} />
              <Field label="Postcode" value={form.postcode} onChange={set('postcode')} />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-navy">
              Payment method
            </h2>
            <label className="flex items-center gap-3 rounded-sm border border-brand-line p-4">
              <input type="radio" checked readOnly className="accent-brand-orange" />
              <div>
                <span className="font-medium text-brand-ink">Cash on delivery</span>
                <span className="block text-xs text-brand-muted">Pay when your order arrives.</span>
              </div>
            </label>
          </section>
        </div>

        <aside className="h-fit rounded-sm border border-brand-line p-5">
          <h2 className="mb-4 text-lg font-semibold text-brand-navy">Order summary</h2>
          <div className="divide-y divide-brand-line">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-brand-smoke">
                  {item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1 text-sm">
                  <span className="font-medium text-brand-ink">{item.name}</span>
                  <span className="block text-xs text-brand-muted">× {item.quantity}</span>
                </div>
                <span className="text-sm font-medium">
                  {money(item.price * item.quantity, item.symbol, item.minorUnit)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-brand-line pt-3 text-base font-semibold">
            <span className="text-brand-navy">Total</span>
            <span>{money(subtotal, symbol, minorUnit)}</span>
          </div>

          {result && !result.ok && (
            <p className="mt-3 rounded-sm bg-red-50 px-3 py-2 text-xs text-red-600">
              {result.error ?? 'Checkout failed. Please try again.'}
            </p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary mt-5 w-full disabled:opacity-60">
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  className,
  ...props
}: { label: string; required?: boolean; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="mb-1 block text-xs font-medium text-brand-ink">
        {label} {required && <span className="text-brand-orange">*</span>}
      </span>
      <input
        {...props}
        className="w-full rounded-sm border border-brand-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
      />
    </label>
  );
}
