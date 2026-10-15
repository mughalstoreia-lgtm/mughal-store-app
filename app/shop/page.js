"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getProducts, getCategories } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import LoadingSpinner from "@/components/LoadingSpinner";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const availability = searchParams.get("availability") || "";

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === "" || v == null) params.delete(k);
      else params.set(k, String(v));
    });
    if (!updates.page) params.set("page", "1");
    router.push(`/shop?${params.toString()}`);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 12,
        search: search || undefined,
        category: category || undefined,
        sort: sort || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        availability: availability || undefined,
      };
      const res = await getProducts(params);
      setProducts(res.data || res.products || []);
      setPagination(res.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.message || "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, sort, minPrice, maxPrice, availability]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data || res.categories || []))
      .catch(() => {});
  }, []);

  const activeFiltersCount = [search, category, minPrice, maxPrice, availability].filter(Boolean).length;

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Search Bar */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-content-muted,#A6A6A6)] mb-2">
          Search Store
        </label>
        <div className="relative">
          <input
            type="search"
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateParams({ search: e.target.value, page: 1 });
            }}
            placeholder="Search products..."
            className="w-full rounded-xl border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-card,#FFFFFF)] px-4 py-2.5 text-sm text-[var(--color-content-main,#0B0B0B)] transition focus:border-[var(--color-brand-primary,#D4AF37)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary,#D4AF37)] shadow-xs"
          />
        </div>
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-content-muted,#A6A6A6)] mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => updateParams({ category: e.target.value })}
          className="w-full rounded-xl border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-card,#FFFFFF)] px-4 py-2.5 text-sm text-[var(--color-content-main,#0B0B0B)] transition focus:border-[var(--color-brand-primary,#D4AF37)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary,#D4AF37)] shadow-xs cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} {c.count != null ? `(${c.count})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-content-muted,#A6A6A6)] mb-2">
          Price Range (PKR)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={minPrice}
            onBlur={(e) => updateParams({ minPrice: e.target.value })}
            className="w-full rounded-xl border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-card,#FFFFFF)] px-3 py-2 text-sm text-[var(--color-content-main,#0B0B0B)] focus:border-[var(--color-brand-primary,#D4AF37)] focus:outline-none shadow-xs"
          />
          <span className="text-[var(--color-content-muted,#A6A6A6)] text-xs font-semibold">-</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={maxPrice}
            onBlur={(e) => updateParams({ maxPrice: e.target.value })}
            className="w-full rounded-xl border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-card,#FFFFFF)] px-3 py-2 text-sm text-[var(--color-content-main,#0B0B0B)] focus:border-[var(--color-brand-primary,#D4AF37)] focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-content-muted,#A6A6A6)] mb-2">
          Availability
        </label>
        <select
          value={availability}
          onChange={(e) => updateParams({ availability: e.target.value })}
          className="w-full rounded-xl border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-card,#FFFFFF)] px-4 py-2.5 text-sm text-[var(--color-content-main,#0B0B0B)] focus:border-[var(--color-brand-primary,#D4AF37)] focus:outline-none shadow-xs cursor-pointer"
        >
          <option value="">All Items</option>
          <option value="in_stock">In Stock Only</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      {/* Sort Option (Desktop Sidebar) */}
      <div className="hidden lg:block">
        <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-content-muted,#A6A6A6)] mb-2">
          Sort By
        </label>
        <select
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="w-full rounded-xl border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-card,#FFFFFF)] px-4 py-2.5 text-sm text-[var(--color-content-main,#0B0B0B)] focus:border-[var(--color-brand-primary,#D4AF37)] focus:outline-none shadow-xs cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      {activeFiltersCount > 0 && (
        <button
          type="button"
          onClick={() => router.push("/shop")}
          className="w-full py-2.5 px-4 rounded-xl border border-red-200 bg-red-50 text-red-600 font-medium text-xs tracking-wide uppercase hover:bg-red-100 transition"
        >
          Reset All Filters ({activeFiltersCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 md:pt-5 py-6 md:py-10">
      {/* Page Header */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--color-surface-hover,#EBE7DD)] pb-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[var(--color-content-main,#0B0B0B)]">
            {search ? `Results for “${search}”` : "Explore Catalog"}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-content-sub,#5F5F5F)]">
            {pagination.total != null ? `Showing ${pagination.total} products` : "Find your perfect item"}
          </p>
        </div>

        {/* Mobile Filter Toggle & Desktop Quick Sort */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex-1 lg:hidden flex items-center justify-center gap-2 rounded-xl border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-card,#FFFFFF)] px-4 py-2.5 text-sm font-semibold text-[var(--color-content-main,#0B0B0B)] shadow-xs active:scale-95 transition"
          >
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand-primary,#D4AF37)] text-white text-xs">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Quick Sort Dropdown for Mobile / Tablet Header */}
          <div className="lg:hidden flex-1">
            <select
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="w-full rounded-xl border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-card,#FFFFFF)] px-3 py-2.5 text-sm font-semibold text-[var(--color-content-main,#0B0B0B)] focus:outline-none shadow-xs"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Sidebar (Non-Sticky) */}
        <aside className="hidden lg:block lg:w-72 shrink-0 rounded-2xl border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-card,#FFFFFF)] p-6 shadow-xs">
          <FilterSidebar />
        </aside>

        {/* Mobile Filter Modal/Drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/40 backdrop-blur-xs">
            <div className="relative ml-auto w-full max-w-xs h-full bg-white p-6 shadow-2xl flex flex-col overflow-y-auto">
              <div className="flex items-center justify-between pb-4 mb-4 border-b">
                <h2 className="text-lg font-bold">Filters & Options</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
              <FilterSidebar />
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="mt-8 w-full py-3 bg-[var(--color-brand-primary,#D4AF37)] text-white rounded-xl font-semibold shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Product Grid & Active Chips */}
        <div className="flex-1 w-full min-w-0">
          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-[var(--color-content-muted,#A6A6A6)]">Active Filters:</span>
              {category && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-surface-base,#F5F3EE)] px-3 py-1 text-xs font-semibold text-[var(--color-content-main,#0B0B0B)] border border-[var(--color-surface-hover,#EBE7DD)]">
                  Category: {category}
                  <button type="button" onClick={() => updateParams({ category: "" })} className="hover:text-red-500">×</button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-surface-base,#F5F3EE)] px-3 py-1 text-xs font-semibold text-[var(--color-content-main,#0B0B0B)] border border-[var(--color-surface-hover,#EBE7DD)]">
                  Search: {search}
                  <button type="button" onClick={() => updateParams({ search: "" })} className="hover:text-red-500">×</button>
                </span>
              )}
            </div>
          )}

          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            onRetry={fetchData}
            emptyTitle={search ? "No matches found" : "No products available"}
            emptyDescription={
              search
                ? "Try searching for another term or resetting filters."
                : "We are updating our stock. Check back soon!"
            }
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3 border-t border-[var(--color-surface-hover,#EBE7DD)] pt-6">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => updateParams({ page: page - 1 })}
                className="rounded-xl border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-card,#FFFFFF)] px-5 py-2.5 text-sm font-semibold text-[var(--color-content-main,#0B0B0B)] shadow-xs disabled:opacity-40 hover:bg-[var(--color-surface-base,#F5F3EE)] transition"
              >
                ← Previous
              </button>
              <span className="text-sm font-medium text-[var(--color-content-sub,#5F5F5F)] px-4">
                Page <strong className="text-[var(--color-content-main,#0B0B0B)]">{page}</strong> of {pagination.totalPages}
              </span>
              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() => updateParams({ page: page + 1 })}
                className="rounded-xl border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-card,#FFFFFF)] px-5 py-2.5 text-sm font-semibold text-[var(--color-content-main,#0B0B0B)] shadow-xs disabled:opacity-40 hover:bg-[var(--color-surface-base,#F5F3EE)] transition"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[50vh]">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}