'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await login(username, password);
    if (!result.ok) {
      setError(result.error ?? 'Login failed');
      setSubmitting(false);
      return;
    }

    router.replace('/');
  };

  return (
    <div className="container-site flex justify-center py-16">
      <div className="w-full max-w-md">
        <h1 className="mb-1 text-2xl font-semibold text-brand-navy">Sign in</h1>
        <p className="mb-6 text-sm text-brand-muted">Use your WordPress account credentials.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-brand-ink">
              Username or email <span className="text-brand-orange">*</span>
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="w-full rounded-sm border border-brand-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-brand-ink">
              Password <span className="text-brand-orange">*</span>
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-sm border border-brand-line px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
          </label>

          {error && (
            <p className="rounded-sm bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-muted">
          No account? Register on your WordPress site, or{' '}
          <Link href="/shop" className="text-brand-orange hover:underline">
            continue as guest
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
