import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-site flex flex-col items-center py-24 text-center">
      <h1 className="text-5xl font-bold text-brand-navy">404</h1>
      <p className="mt-3 text-brand-muted">We couldn&apos;t find that page.</p>
      <Link href="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
