export default function LoadingSpinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };
  return (
    <div
      className={`inline-block animate-spin rounded-full border-brand-primary border-t-transparent ${sizes[size] || sizes.md} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function ButtonSpinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden
    />
  );
}

export function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse">
      <div className="h-10 w-1/3 rounded bg-surface-hover mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-surface-card overflow-hidden">
            <div className="aspect-square bg-surface-hover" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-3/4 rounded bg-surface-hover" />
              <div className="h-3 w-1/2 rounded bg-surface-hover" />
              <div className="h-5 w-1/3 rounded bg-surface-hover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl bg-surface-card overflow-hidden animate-pulse">
          <div className="aspect-square bg-surface-hover" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 rounded bg-surface-hover" />
            <div className="h-3 w-1/2 rounded bg-surface-hover" />
            <div className="h-5 w-1/3 rounded bg-surface-hover" />
          </div>
        </div>
      ))}
    </div>
  );
}
