import Link from 'next/link';
import { getCategories, getProducts } from '@/lib/woocommerce';
import { ProductCard } from '@/components/ProductCard';
import { SortSelect } from '@/components/SortSelect';

const SORT_MAP: Record<string, { orderby: 'price' | 'date' | 'title'; order: 'asc' | 'desc' }> = {
  'price-asc': { orderby: 'price', order: 'asc' },
  'price-desc': { orderby: 'price', order: 'desc' },
  newest: { orderby: 'date', order: 'desc' },
  title: { orderby: 'title', order: 'asc' },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { search?: string; sort?: string };
}) {
  const search = searchParams.search ?? '';
  const sort = SORT_MAP[searchParams.sort ?? ''];

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      search: search || undefined,
      orderby: sort?.orderby,
      order: sort?.order,
      perPage: 50,
    }),
  ]);

  return (
    <div className="container-site py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">
            {search ? `Results for “${search}”` : 'Shop all'}
          </h1>
          <p className="mt-1 text-sm text-brand-muted">{products.length} products</p>
        </div>
        <SortSelect />
      </div>

      <div className="flex gap-8">
        {/* Category filter */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-navy">
            Categories
          </h2>
          <ul className="space-y-1 border-l border-brand-line">
            <li>
              <Link
                href="/shop"
                className="block px-3 py-1.5 text-sm text-brand-muted hover:text-brand-orange"
              >
                All
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/category/${c.slug}`}
                  className="block px-3 py-1.5 text-sm text-brand-muted hover:text-brand-orange"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="rounded-sm border border-brand-line py-16 text-center text-brand-muted">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
