'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { WCCategory } from '@/lib/types';
import { useCart } from './CartProvider';
import { useAuth } from './AuthProvider';

const NAV_ORDER = ['women', 'men', 'clothing', 'music', 'posters', 'accessories'];

export function Header({ categories }: { categories: WCCategory[] }) {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = NAV_ORDER.map((slug) => categories.find((c) => c.slug === slug)).filter(
    (c): c is WCCategory => Boolean(c)
  );

  return (
    <div className="sticky top-0 z-30 w-full bg-white shadow-sm">
      {/* Utility bar */}
      <div className="hidden bg-brand-navy text-white md:block">
        <div className="container-site flex items-center justify-between py-1.5 text-xs">
          <span className="tracking-wide text-white/70">Selling emotion not just product</span>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1 font-semibold">
              BD <span className="text-white/50">|</span> BDT
            </span>
            <Link href="/shop" className="hover:text-brand-orange">Shop All</Link>
            <Link href="/cart" className="hover:text-brand-orange">Customer Service</Link>
            {user ? (
              <span className="flex items-center gap-3">
                <span className="text-white/70">Hi, {user.displayName}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="hover:text-brand-orange"
                >
                  Sign Out
                </button>
              </span>
            ) : (
              <Link href="/login" className="hover:text-brand-orange">Sign In</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="container-site flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex shrink-0 items-baseline gap-0.5 text-2xl font-bold tracking-tight">
          <span className="text-brand-navy">Stichy</span>
          <span className="text-brand-orange">X</span>
          <span className="ml-1 text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted">
            Store
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="text-sm font-medium text-brand-ink transition-colors hover:text-brand-orange"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <form action="/shop" method="get" className="hidden items-center md:flex">
            <input
              type="search"
              name="search"
              placeholder="Search products"
              className="w-40 rounded-sm border border-brand-line bg-brand-smoke px-3 py-2 text-sm outline-none transition-all focus:w-56 focus:border-brand-orange"
            />
          </form>

          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-sm text-brand-navy hover:bg-brand-smoke"
            aria-label="Cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-sm text-brand-navy hover:bg-brand-smoke lg:hidden"
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-brand-line bg-white lg:hidden">
          <nav className="container-site flex flex-col py-2">
            {nav.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                onClick={() => setMenuOpen(false)}
                className="border-b border-brand-line py-3 text-sm font-medium text-brand-ink last:border-0"
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
