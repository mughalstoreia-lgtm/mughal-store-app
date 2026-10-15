"use client";

import ProductCard from "./ProductCard";
import { ProductSkeleton } from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";

export default function ProductGrid({
  products = [],
  loading = false,
  error = null,
  onRetry,
  emptyTitle = "No products found",
  emptyDescription = "Try adjusting your filters or search terms.",
}) {
  if (loading) {
    return <ProductSkeleton count={8} />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load products"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (!products.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="Browse Shop"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
