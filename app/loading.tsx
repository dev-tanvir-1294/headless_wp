export default function Loading() {
  return (
    <div className="container-site py-8">
      <div className="mb-6 h-8 w-48 animate-pulse rounded-sm bg-brand-smoke" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-square animate-pulse rounded-sm bg-brand-smoke" />
            <div className="h-4 w-3/4 animate-pulse rounded-sm bg-brand-smoke" />
            <div className="h-4 w-1/2 animate-pulse rounded-sm bg-brand-smoke" />
          </div>
        ))}
      </div>
    </div>
  );
}
