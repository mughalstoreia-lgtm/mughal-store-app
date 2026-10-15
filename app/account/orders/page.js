"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getOrders } from "@/lib/api";
import { formatPrice, getStatusConfig } from "@/lib/utils";
import ErrorState from "@/components/ErrorState";

// Clean & Soft Skeleton Loader
function OrdersSkeleton() {
  return (
    <div className="container mx-auto max-w-5xl px-3 sm:px-5 xl:px-10 py-6 md:py-10 animate-pulse overflow-x-hidden">
      <div className="mb-6 h-8 w-48 bg-[var(--color-surface-hover)] rounded-lg" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-[var(--color-surface-border)]/60 bg-[var(--color-surface-card)] p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-[var(--color-surface-hover)] rounded" />
              <div className="h-6 w-20 bg-[var(--color-surface-hover)] rounded-full" />
            </div>
            <div className="h-4 w-48 bg-[var(--color-surface-hover)] rounded" />
            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-surface-hover)]">
              <div className="h-4 w-24 bg-[var(--color-surface-hover)] rounded" />
              <div className="h-9 w-28 bg-[var(--color-surface-hover)] rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { isAuthenticated, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/auth/login?redirect=/account/orders");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getOrders(token)
      .then((res) => {
        const list = res.data?.orders || res.orders || res.data || res || [];
        setOrders(Array.isArray(list) ? list : []);
      })
      .catch((err) => setError(err.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  }, [token]);

  if (authLoading || loading) {
    return <OrdersSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Could not load orders"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-3 sm:px-5 xl:px-10 py-6 md:py-10 overflow-x-hidden text-[var(--color-content-main)]">
      
      {/* Navigation Breadcrumb */}
      <nav className="mb-4 sm:mb-6 text-xs sm:text-sm text-[var(--color-content-muted)]">
        <Link href="/account" className="hover:text-[var(--color-brand-light)]">
          My Account
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-content-sub)] font-medium">Order History</span>
      </nav>

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-content-main)]">My Orders</h1>
        <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1">
          Review your purchase history and track active deliveries.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-8 sm:p-12 text-center space-y-4">
          <p className="text-sm sm:text-base font-semibold text-[var(--color-content-sub)]">No orders found.</p>
          <p className="text-xs text-[var(--color-content-muted)]">You haven't placed any orders yet.</p>
          <Link
            href="/shop"
            className="inline-block mt-2 rounded-xl bg-[var(--color-brand-primary)] px-6 py-2.5 text-xs sm:text-sm font-bold text-[var(--panel-header)] hover:bg-[var(--color-brand-hover)] transition-colors shadow-xs"
          >
            Start Shopping &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = getStatusConfig(order.orderStatus || order.status);
            const orderId = order._id || order.id;

            return (
              <div
                key={orderId}
                className="rounded-2xl border border-[var(--color-surface-border)]/60 bg-[var(--color-surface-card)] p-4 sm:p-6 shadow-xs transition-all hover:border-[var(--color-brand-primary)]/40 hover:shadow-sm space-y-4"
              >
                {/* Top Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-surface-border)]/40 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-content-muted)] block">
                      Order ID
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-[var(--color-content-main)]">
                      #{String(orderId).slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] sm:text-xs font-bold ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>

                {/* Info Middle Section */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                  <div>
                    <p className="text-[10px] sm:text-xs text-[var(--color-content-muted)] uppercase font-semibold">Date Placed</p>
                    <p className="font-medium text-[var(--color-content-main)] mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-[var(--color-content-muted)] uppercase font-semibold">Payment</p>
                    <p className="font-medium text-[var(--color-content-main)] uppercase mt-0.5">
                      {order.paymentMethod || "COD"}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-[10px] sm:text-xs text-[var(--color-content-muted)] uppercase font-semibold">Items Count</p>
                    <p className="font-medium text-[var(--color-content-main)] mt-0.5">
                      {(order.items || []).length} product(s)
                    </p>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-surface-hover)]">
                  <div>
                    <span className="text-xs text-[var(--color-content-muted)]">Total Amount: </span>
                    <span className="text-sm sm:text-base font-black text-[var(--color-brand-hover)]">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                  
                  <Link
                    href={`/account/orders/${orderId}`}
                    className="rounded-xl bg-[var(--color-surface-base)] border border-[var(--color-surface-border)] px-4 py-2 text-xs sm:text-sm font-bold text-[var(--color-content-main)] hover:bg-[var(--color-brand-soft)] hover:border-[var(--color-brand-primary)]/40 transition-all shadow-2xs text-center"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}