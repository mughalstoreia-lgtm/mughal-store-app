"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCategoryProducts } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CategoryProductsPage() {
  const { name } = useParams();
  const decoded = decodeURIComponent(name || "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  const load = async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCategoryProducts(decoded, { page: p, limit: 12 });
      setProducts(res.data || res.products || []);
      setPagination(res.pagination || { totalPages: 1 });
      setPage(p);
    } catch (err) {
      setError(err.message || "Failed to load category");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (decoded) load(1);
  }, [decoded]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <nav className="mb-6 text-sm text-content-muted">
        <Link href="/shop" className="hover:text-brand-light">Shop</Link>
        <span className="mx-2">/</span>
        <Link href="/shop/categories" className="hover:text-brand-light">Categories</Link>
        <span className="mx-2">/</span>
        <span className="text-content-sub capitalize">{decoded}</span>
      </nav>
      <h1 className="text-3xl font-bold text-content-main capitalize mb-8">
        {decoded}
      </h1>
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onRetry={() => load(page)}
      />
      {pagination.totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => load(page - 1)}
            className="rounded-lg border border-surface-border px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm text-content-sub">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= pagination.totalPages}
            onClick={() => load(page + 1)}
            className="rounded-lg border border-surface-border px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
