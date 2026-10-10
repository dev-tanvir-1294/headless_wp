'use client';

import { useState } from 'react';
import type { WCImage } from '@/lib/types';

export function ProductGallery({ images, name }: { images: WCImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active]?.src ?? null;

  if (!images.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-sm bg-brand-smoke text-brand-muted">
        No image
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-sm bg-brand-smoke">
        {current && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current} alt={name} className="h-full w-full object-cover" />
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-sm border-2 ${
                i === active ? 'border-brand-orange' : 'border-transparent'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.thumbnail || img.src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
