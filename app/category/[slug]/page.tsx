import Link from 'next/link';
import type { Metadata } from 'next';
import { getCategoryBySlug, getProducts } from '@/lib/woocommerce';
import { ProductCard } from '@/components/ProductCard';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  return {
    title: category?.name ?? 'Category',
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const [category, products] = await Promise.all([
    getCategoryBySlug(params.slug),
    getProducts({ category: params.slug, perPage: 50 }),
  ]);

  return (
    <div className="container-site py-8">
      <nav className="mb-4 text-xs text-brand-muted">
        <Link href="/" className="hover:text-brand-orange">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/shop" className="hover:text-brand-orange">Shop</Link>
        <span className="mx-1">/</span>
        <span className="text-brand-ink">{category?.name ?? params.slug}</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-brand-navy">
          {category?.name ?? params.slug}
        </h1>
        <p className="mt-1 text-sm text-brand-muted">{products.length} products</p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-sm border border-brand-line py-16 text-center text-brand-muted">
          No products in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
