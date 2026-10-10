'use client';

import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-site flex flex-col items-center py-24 text-center">
      <h1 className="text-2xl font-semibold text-brand-navy">Something went wrong</h1>
      <p className="mt-2 text-sm text-brand-muted">
        We couldn&apos;t load this page. This can happen if the store backend is unreachable.
      </p>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={reset} className="btn-outline">
          Try again
        </button>
        <Link href="/" className="btn-primary">
          Go home
        </Link>
      </div>
    </div>
  );
}
