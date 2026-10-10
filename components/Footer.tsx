import Link from 'next/link';
import type { WCCategory } from '@/lib/types';

export function Footer({ categories }: { categories: WCCategory[] }) {
  return (
    <footer className="mt-16 bg-brand-navy text-white">
      <div className="container-site grid gap-10 py-12 md:grid-cols-4">
        <div>
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-white">Stichy</span>
            <span className="text-brand-orange">X</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-white/60">
            Selling emotion not just product. A headless storefront powered by
            WordPress and WooCommerce.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/90">
            Shop
          </h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li>
              <Link href="/shop" className="hover:text-brand-orange">All products</Link>
            </li>
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.slug}`} className="hover:text-brand-orange">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/90">
            Help
          </h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/cart" className="hover:text-brand-orange">My Cart</Link></li>
            <li><Link href="/checkout" className="hover:text-brand-orange">Checkout</Link></li>
            <li><Link href="/shop" className="hover:text-brand-orange">Track Order</Link></li>
            <li><Link href="/shop" className="hover:text-brand-orange">Returns</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/90">
            Stay in touch
          </h3>
          <p className="mb-4 text-sm text-white/60">
            Sign up for new drops and offers.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-l-sm bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:bg-white/20"
            />
            <button
              type="submit"
              className="rounded-r-sm bg-brand-orange px-4 text-sm font-semibold uppercase text-white hover:bg-brand-orange-dark"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-2 py-4 text-xs text-white/40 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} StichyX Store. All rights reserved.</span>
          <span>BDT — Bangladesh</span>
        </div>
      </div>
    </footer>
  );
}
