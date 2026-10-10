'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'title', label: 'Name (A–Z)' },
];

export function SortSelect() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get('sort') ?? '';

  const onChange = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set('sort', value);
    else next.delete('sort');
    const qs = next.toString();
    router.push(`/shop${qs ? `?${qs}` : ''}`);
  };

  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-sm border border-brand-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-orange"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
