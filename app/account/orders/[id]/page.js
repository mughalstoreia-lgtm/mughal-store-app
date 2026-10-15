"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getOrder, cancelOrder } from "@/lib/api";
import { formatPrice, getStatusConfig } from "@/lib/utils";
import ErrorState from "@/components/ErrorState";

// Clean & Soft Skeleton Loader
function OrderDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-3xl px-3 sm:px-4 py-6 md:py-10 animate-pulse overflow-x-hidden">
      <div className="mb-6 h-4 w-36 bg-[var(--color-surface-hover)] rounded" />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-[var(--color-surface-hover)] rounded-lg" />
          <div className="h-3.5 w-36 bg-[var(--color-surface-hover)] rounded" />
        </div>
        <div className="h-6 w-24 bg-[var(--color-surface-hover)] rounded-full" />
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-4 sm:p-5 space-y-4">
          <div className="h-4 w-28 bg-[var(--color-surface-hover)] rounded" />
          <div className="space-y-3 pt-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-[var(--color-surface-hover)] shrink-0" />
                  <div className="space-y-2">
                    <div className="h-4 w-28 sm:w-32 bg-[var(--color-surface-hover)] rounded" />
                    <div className="h-3 w-20 bg-[var(--color-surface-hover)] rounded" />
                  </div>
                </div>
                <div className="h-4 w-14 sm:w-16 bg-[var(--color-surface-hover)] rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-4 sm:p-5 sm:grid-cols-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3.5 w-20 bg-[var(--color-surface-hover)] rounded" />
              <div className="h-5 w-24 bg-[var(--color-surface-hover)] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedPreviewItem, setSelectedPreviewItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal Refs
  const cancelModalRef = useRef(null);
  const previewModalRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/auth/login?redirect=/account/orders/${id}`);
    }
  }, [authLoading, isAuthenticated, router, id]);

  const fetchOrderDetail = () => {
    if (!token || !id) return;
    setLoading(true);
    getOrder(id, token)
      .then((res) => {
        const orderData = res.data || res.order || res;
        setOrder(orderData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [token, id]);

  const canCancelOrder = (createdAt, status) => {
    if (!createdAt) return false;
    const isUnder24Hours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60) <= 24;
    const isAllowedStatus = !["Shipped", "Delivered", "Cancelled"].includes(status);
    return isUnder24Hours && isAllowedStatus;
  };

  const handleCancelConfirm = async () => {
    setActionLoading(true);
    try {
      await cancelOrder(id, token);
      setIsCancelModalOpen(false);
      fetchOrderDetail();
    } catch (err) {
      alert(err.message || "Failed to cancel order.");
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading || loading) {
    return <OrderDetailSkeleton />;
  }

  if (error || !order) {
    return (
      <ErrorState
        title="Order not found"
        message={error || "Unable to load this order."}
        onRetry={() => router.push("/account/orders")}
      />
    );
  }

  const status = getStatusConfig(order.orderStatus || order.status);
  const addr = order.shippingAddress || {};
  const isCancellable = canCancelOrder(order.createdAt, order.orderStatus);

  return (
    <div className="container mx-auto max-w-3xl px-3 sm:px-4 py-6 md:py-10 overflow-x-hidden text-[var(--color-content-main)]">
      {/* Navigation */}
      <nav className="mb-4 sm:mb-6 text-xs sm:text-sm text-[var(--color-content-muted)]">
        <Link href="/account/orders" className="hover:text-[var(--color-brand-light)]">
          My Orders
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-content-sub)]">
          #{String(order._id || id).slice(-8).toUpperCase()}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-content-main)]">Order Details</h1>
          <p className="mt-1 text-[11px] sm:text-xs text-[var(--color-content-muted)]">
            Placed on: {new Date(order.createdAt).toLocaleString("en-PK")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-[11px] sm:text-xs font-medium ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Items List */}
        <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-4 sm:p-5 shadow-xs">
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <h2 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--color-content-muted)]">
              Items Ordered (Click to preview)
            </h2>
          </div>
          <ul className="divide-y divide-[var(--color-surface-border)]">
            {(order.items || []).map((item, idx) => (
              <li key={idx} className="py-3 text-xs sm:text-sm">
                <button
                  type="button"
                  onClick={() => setSelectedPreviewItem(item)}
                  className="w-full text-left group flex items-center justify-between transition-colors hover:opacity-85"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    {item.image && (
                      <div className="relative h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-md border border-[var(--color-surface-border)] shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name || "Product"} 
                          className="h-full w-full object-cover transition-transform group-hover:scale-105" 
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--color-content-main)] truncate group-hover:text-[var(--color-brand-primary)] transition-colors">
                        {item.name || item.product?.name || "Product"}
                      </p>
                      <p className="text-[11px] sm:text-xs text-[var(--color-content-muted)]">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <span className="hidden sm:inline-block text-[11px] font-medium text-[var(--color-brand-primary)] border border-[var(--color-brand-primary)]/30 px-2 py-0.5 rounded-md bg-[var(--color-brand-soft)]">
                      Preview
                    </span>
                    <span className="font-semibold text-[var(--color-content-sub)] text-xs sm:text-sm">
                      {formatPrice((item.price || 0) * (item.quantity || 1))}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing Summary */}
        <div className="grid gap-4 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-4 sm:p-5 text-xs sm:text-sm sm:grid-cols-2 shadow-xs">
          <div>
            <p className="mb-1 text-[var(--color-content-muted)]">Subtotal</p>
            <p className="text-[var(--color-content-main)] font-semibold">{formatPrice(order.subtotal)}</p>
          </div>
          <div>
            <p className="mb-1 text-[var(--color-content-muted)]">Shipping</p>
            <p className="text-[var(--color-content-main)] font-semibold">{formatPrice(order.shipping)}</p>
          </div>
          {order.discount != null && Number(order.discount) > 0 && (
            <div>
              <p className="mb-1 text-[var(--color-content-muted)]">Discount</p>
              <p className="text-[var(--color-content-main)] font-semibold">-{formatPrice(order.discount)}</p>
            </div>
          )}
          <div>
            <p className="mb-1 text-[var(--color-content-muted)]">Grand Total</p>
            <p className="text-base sm:text-lg font-bold text-[var(--color-content-main)]">
              {formatPrice(order.total)}
            </p>
          </div>
          <div>
            <p className="mb-1 text-[var(--color-content-muted)]">Payment Method & Status</p>
            <p className="capitalize text-[var(--color-content-main)]">
              {order.paymentMethod} · <span className="font-medium text-[var(--color-brand-primary)]">{order.paymentStatus || "Pending"}</span>
            </p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-4 sm:p-5 shadow-xs">
          <div className="mb-3 border-b border-[var(--color-surface-border)]/50 pb-2.5">
            <h2 className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--color-content-muted)]">
              Shipping Address
            </h2>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed text-[var(--color-content-main)]">
            {addr.fullName} <br />
            {addr.phone && <>{addr.phone} <br /></>}
            {addr.addressLine1} {addr.addressLine2} <br />
            {addr.city}, {addr.state} {addr.postalCode} <br />
            {addr.country}
          </p>
        </div>

        {/* Cancel Order Action */}
        {isCancellable && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400">Cancel Order Option</p>
              <p className="text-[11px] sm:text-xs text-[var(--color-content-muted)]">You can cancel this order within 24 hours of placing it.</p>
            </div>
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 transition-colors cursor-pointer"
            >
              Cancel Order
            </button>
          </div>
        )}
      </div>

      {/* ================= PRODUCT PREVIEW MODAL ================= */}
      {selectedPreviewItem && (() => {
        const productId = selectedPreviewItem.product?._id || selectedPreviewItem.product?.id || selectedPreviewItem.product || selectedPreviewItem._id;
        const productUrl = productId ? `/shop/products/${productId}` : `/shop`;

        return (
          <div 
            onClick={(e) => {
              if (previewModalRef.current && !previewModalRef.current.contains(e.target)) {
                setSelectedPreviewItem(null);
              }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm"
          >
            <div 
              ref={previewModalRef}
              className="w-full max-w-md rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-5 sm:p-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setSelectedPreviewItem(null)}
                className="absolute top-4 right-4 text-[var(--color-content-muted)] hover:text-[var(--color-content-main)] text-base font-bold p-1 cursor-pointer"
              >
                ✕
              </button>

              <div className="space-y-4">
                {selectedPreviewItem.image && (
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden rounded-xl border border-[var(--color-surface-border)] bg-neutral-950/20">
                    <img 
                      src={selectedPreviewItem.image} 
                      alt={selectedPreviewItem.name || "Product"} 
                      className="h-full w-full object-contain p-2" 
                    />
                  </div>
                )}

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--color-content-main)]">
                    {selectedPreviewItem.name || selectedPreviewItem.product?.name || "Product Details"}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-[var(--color-brand-primary)]">
                    Price: {formatPrice(selectedPreviewItem.price)}
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs text-[var(--color-content-muted)]">
                    Quantity Ordered: <span className="font-semibold text-[var(--color-content-sub)]">{selectedPreviewItem.quantity}</span>
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedPreviewItem(null)}
                    className="rounded-lg border border-[var(--color-surface-border)] px-4 py-2 text-xs font-medium text-[var(--color-content-main)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <Link
                    href={productUrl}
                    className="rounded-lg bg-[var(--color-brand-primary)] px-4 py-2 text-xs font-semibold text-[var(--panel-header)] hover:bg-[var(--color-brand-hover)] transition-colors text-center"
                  >
                    View Product Page &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ================= CANCEL CONFIRMATION MODAL ================= */}
      {isCancelModalOpen && (
        <div 
          onClick={(e) => {
            if (cancelModalRef.current && !cancelModalRef.current.contains(e.target)) {
              setIsCancelModalOpen(false);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm"
        >
          <div 
            ref={cancelModalRef}
            className="w-full max-w-sm rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-5 sm:p-6 shadow-xl"
          >
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-content-main)]">Cancel Order?</h3>
            <p className="mt-2 text-[11px] sm:text-xs text-[var(--color-content-muted)] leading-relaxed">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="rounded-md border border-[var(--color-surface-border)] px-4 py-2 text-xs font-medium text-[var(--color-content-main)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancelConfirm}
                disabled={actionLoading}
                className="rounded-md bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {actionLoading ? "Cancelling..." : "Yes, Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WARNING BANNER */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border-2 border-[var(--color-brand-primary)] bg-[var(--color-brand-soft)] p-4 text-[var(--color-content-main)] shadow-sm">
        <span className="text-xl sm:text-2xl shrink-0 leading-none">⚠️</span>
        <div className="text-xs sm:text-sm leading-relaxed">
          <p className="font-extrabold text-sm sm:text-base mb-1 text-[var(--color-content-main)]">
            Order Cancellation Policy
          </p>
          <p className="font-bold text-[var(--color-content-main)]">
            You can cancel your order only within{" "}
            <strong className="font-black underline decoration-[var(--color-brand-hover)] decoration-2">
              24 hours
            </strong>{" "}
            of placing it. After 24 hours, cancellation will no longer be available.
          </p>
          <p className="mt-1.5 font-bold text-[var(--color-content-main)]">
            If you face an urgent issue after this period, please reach out to us via our{" "}
            <Link 
              href="/contact" 
              className="font-black underline decoration-2 text-[var(--color-brand-hover)] hover:text-[var(--color-brand-primary)]"
            >
              Contact Us
            </Link>{" "}
            page to describe your issue.
          </p>
        </div>
      </div>
    </div>
  );
}