import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getProducts } from '@/lib/woocommerce';
import { formatPrice, stripHtml } from '@/lib/format';
import { ProductGallery } from '@/components/ProductGallery';
import { AddToCartForm } from '@/components/AddToCartForm';
import { ProductCard } from '@/components/ProductCard';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  return {
    title: product?.name ?? 'Product',
    description: product ? stripHtml(product.short_description).slice(0, 160) : undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const categorySlug = product.categories?.[0]?.slug;
  const related = categorySlug
    ? (await getProducts({ category: categorySlug, perPage: 8 })).filter(
        (p) => p.id !== product.id
      )
    : [];

  return (
    <div className="container-site py-8">
      <nav className="mb-6 text-xs text-brand-muted">
        <Link href="/" className="hover:text-brand-orange">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/shop" className="hover:text-brand-orange">Shop</Link>
        {product.categories?.[0] && (
          <>
            <span className="mx-1">/</span>
            <Link href={`/category/${product.categories[0].slug}`} className="hover:text-brand-orange">
              {product.categories[0].name}
            </Link>
          </>
        )}
        <span className="mx-1">/</span>
        <span className="text-brand-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          {product.categories?.[0] && (
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
              {product.categories[0].name}
            </span>
          )}
          <h1 className="mt-2 text-3xl font-bold text-brand-navy">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-brand-ink">
            {formatPrice(product.prices)}
          </p>

          {product.sku && (
            <p className="mt-2 text-xs text-brand-muted">SKU: {product.sku}</p>
          )}

          {product.short_description && (
            <p className="mt-4 text-sm leading-relaxed text-brand-ink/80">
              {stripHtml(product.short_description)}
            </p>
          )}

          <div className="mt-6 max-w-sm">
            <AddToCartForm product={product} />
          </div>

          {product.description && (
            <div className="mt-8 border-t border-brand-line pt-6">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-navy">
                Description
              </h2>
              <p className="text-sm leading-relaxed text-brand-ink/80">
                {stripHtml(product.description)}
              </p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-semibold text-brand-navy">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {related.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
