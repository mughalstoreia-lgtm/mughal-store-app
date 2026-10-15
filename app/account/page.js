"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/Button";

// Stable Skeleton Loader (Exact matching dimensions to prevent layout shifts)
function AccountSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 animate-pulse">
      <div className="h-8 w-44 bg-[var(--color-surface-hover)] rounded-lg mb-6" />
      <div className="grid gap-6 md:grid-cols-3 items-start">
        {/* Profile Card Skeleton */}
        <div className="md:col-span-1 rounded-2xl border border-[var(--color-surface-border)]/60 bg-[var(--color-surface-card)] p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-3.5 border-b border-[var(--color-surface-border)]/40 pb-5">
            <div className="h-14 w-14 rounded-full bg-[var(--color-surface-hover)] shrink-0" />
            <div className="space-y-2 flex-1 min-w-0">
              <div className="h-4 w-3/4 bg-[var(--color-surface-hover)] rounded" />
              <div className="h-3 w-1/2 bg-[var(--color-surface-hover)] rounded" />
              <div className="h-4 w-20 bg-[var(--color-surface-hover)] rounded mt-1" />
            </div>
          </div>
          <div className="space-y-2.5">
            <div className="h-11 w-full bg-[var(--color-surface-hover)] rounded-xl" />
            <div className="h-11 w-full bg-[var(--color-surface-hover)] rounded-xl" />
          </div>
        </div>
        {/* Quick Links Skeleton */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-[var(--color-surface-border)]/60 bg-[var(--color-surface-card)] p-5 h-24 w-full" />
            ))}
          </div>
          <div className="rounded-2xl border border-[var(--color-surface-border)]/60 bg-[var(--color-surface-card)] p-5 sm:p-6 h-36 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth/login?redirect=/account");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <AccountSkeleton />;
  }

  if (!user) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 text-[var(--color-content-main)]">
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-content-main)] mb-6">My Account</h1>
      
      <div className="grid gap-6 md:grid-cols-3 items-start">
        
        {/* Profile Card Section */}
        <div className="md:col-span-1 rounded-2xl border border-[var(--color-surface-border)]/60 bg-[var(--color-surface-card)] p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3.5 border-b border-[var(--color-surface-border)]/40 pb-5 min-w-0">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand-light)] text-lg sm:text-xl font-extrabold shrink-0 border border-[var(--color-brand-primary)]/30">
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm sm:text-base text-[var(--color-content-main)] truncate">
                {user.name}
              </p>
              <p className="text-xs sm:text-sm text-[var(--color-content-sub)] truncate">{user.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)] border border-[var(--color-brand-primary)]/20">
                {user.role || "customer"}
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <Link href="/wishlist" className="block w-full">
              <Button className="w-full h-11 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 rounded-xl">
                <svg
                  className="w-4 h-4 text-[var(--panel-header)] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                <span>My Wishlist</span>
              </Button>
            </Link>

            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="w-full h-11 px-4 rounded-xl text-xs sm:text-sm font-bold border border-[var(--color-surface-border)] bg-[var(--color-surface-base)] text-[var(--color-content-main)] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer shadow-2xs"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dynamic Context & Quick Links */}
        <div className="md:col-span-2 space-y-6 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                href: "/cart",
                title: "Active Cart",
                desc: "Items ready for quick checkout",
              },
              {
                href: "/shop",
                title: "Explore Collection",
                desc: "Discover new arrivals & watches",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="rounded-2xl border border-[var(--color-surface-border)]/60 bg-[var(--color-surface-card)] p-5 transition-all hover:border-[var(--color-brand-primary)]/50 hover:shadow-sm block group cursor-pointer min-w-0"
              >
                <h3 className="font-bold text-sm sm:text-base text-[var(--color-content-main)] group-hover:text-[var(--color-brand-hover)] transition-colors mb-1 truncate">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-content-sub)] line-clamp-2">
                  {card.desc}
                </p>
              </Link>
            ))}
          </div>

          {/* Previous Orders Banner Section */}
          <section className="rounded-2xl border border-[var(--color-surface-border)]/60 bg-[var(--color-surface-card)] p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--color-content-main)]">
                Previous Orders
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-0.5">
                Track shipment status, view past receipts, and manage history.
              </p>
            </div>
            
            <Link
              href="/account/orders"
              className="rounded-xl border border-[var(--color-surface-border)]/80 bg-[var(--color-surface-base)] p-4 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm transition-all hover:border-[var(--color-brand-primary)] group cursor-pointer"
            >
              <span className="font-medium text-[var(--color-content-sub)] group-hover:text-[var(--color-content-main)] transition-colors line-clamp-1">
                View full order history and track shipments...
              </span>
              
              <span className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-[var(--color-brand-primary)] text-[var(--panel-header)] text-xs sm:text-sm font-bold rounded-lg shadow-xs hover:bg-[var(--color-brand-hover)] transition-colors shrink-0">
                Go &rarr;
              </span>
            </Link>
          </section>
        </div>

      </div>
    </div>
  );
}