import Link from 'next/link';
import { getCategories, getProducts } from '@/lib/woocommerce';
import { ProductCard } from '@/components/ProductCard';

const HERO_CATEGORIES = ['women', 'men', 'clothing', 'music', 'posters', 'accessories'];

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let products: Awaited<ReturnType<typeof getProducts>> = [];

  try {
    [categories, products] = await Promise.all([getCategories(), getProducts({ perPage: 12 })]);
  } catch {
    // Store backend unreachable at build/render time — render empty sections gracefully.
  }

  const tiles = HERO_CATEGORIES.map((slug) => categories.find((c) => c.slug === slug)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c)
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-orange/40" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-orange/20 blur-3xl" />
        <div className="container-site relative flex min-h-[420px] flex-col justify-center py-16">
          <span className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-orange">
            StichyX Store
          </span>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            Selling emotion, not just product.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/70">
            Streetwear, prints and music — crafted for people who wear what they
            believe in.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn-primary">
              Shop now
            </Link>
            <Link
              href="/category/music"
              className="btn border border-white/30 text-white hover:bg-white/10"
            >
              Explore music
            </Link>
          </div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="container-site py-14">
        <h2 className="mb-6 text-xl font-semibold text-brand-navy">Shop by category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {tiles.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="group flex flex-col items-center gap-3 rounded-sm border border-brand-line bg-brand-smoke p-6 text-center transition-colors hover:border-brand-orange hover:bg-white"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
                </svg>
              </span>
              <span className="text-sm font-semibold text-brand-ink group-hover:text-brand-orange">
                {c.name}
              </span>
              <span className="text-xs text-brand-muted">{c.count} items</span>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="container-site pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-semibold text-brand-navy">New arrivals</h2>
          <Link href="/shop" className="text-sm font-semibold text-brand-orange hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
