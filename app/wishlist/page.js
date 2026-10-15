
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import ProductCard from "@/components/ProductCard";

// Skeleton Card Component matching exact ProductCard layout
function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-2xl border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-card,#FFFFFF)] animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[4/5] sm:aspect-square w-full bg-neutral-200" />
      
      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col p-3 sm:p-4 space-y-3">
        {/* Brand Skeleton */}
        <div className="h-2.5 w-16 bg-neutral-200 rounded" />
        
        {/* Title Skeleton */}
        <div className="space-y-1.5 min-h-[2.25rem] sm:min-h-[2.6rem]">
          <div className="h-3.5 w-full bg-neutral-200 rounded" />
          <div className="h-3.5 w-3/4 bg-neutral-200 rounded" />
        </div>
        
        {/* Price & Button Footer Skeleton */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-[var(--color-surface-hover,#EBE7DD)]/60">
          <div className="h-5 w-20 bg-neutral-200 rounded" />
          <div className="h-8 w-16 bg-neutral-200 rounded-xl shrink-0" />
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { items, loading } = useWishlist();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/auth/login?redirect=/wishlist");
    }
  }, [authLoading, isAuthenticated, router]);

  if (!isAuthenticated && !authLoading) return null;

  const isDataLoading = authLoading || loading;

  // Normalize items – API may return product objects or IDs
  const products = items
    .map((item) => (item.product ? item.product : item))
    .filter((p) => p && p._id);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:pt-5 py-6 md:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-content-main mb-6">
        Wishlist
      </h1>

      {isDataLoading ? (
        /* Skeleton Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg text-content-sub mb-4">Your wishlist is empty</p>
          <a
            href="/shop"
            className="px-5 py-2.5 bg-[var(--color-brand-primary,#D4AF37)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Browse Products
          </a>
        </div>
      ) : (
        /* Real Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
