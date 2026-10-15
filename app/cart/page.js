"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import CartItem from "@/components/CartItem";
import EmptyState from "@/components/EmptyState";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/Button";

export default function CartPage() {
  const { items, subtotal, shipping, total, updateQuantity, removeItem, clearCart, hydrated } =
    useCart();

  if (!hydrated) {
    return <div className="container mx-auto px-4 py-16 text-center text-[var(--color-content-sub)]">Loading cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 md:pt-5 py-6 md:py-10">
        <EmptyState
          title="Your cart is empty"
          description="Browse our collection and add something special."
          actionLabel="Continue shopping"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 md:pt-5 py-6 md:py-10 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6.5">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-content-main)]">Your Cart</h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs sm:text-sm text-[var(--color-content-muted)] hover:text-[var(--color-accent-danger)] transition-colors cursor-pointer"
        >
          Clear cart
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-6 lg:gap-10 lg:grid-cols-3 items-start">
        {/* Cart Items List Container */}
        <div className="lg:col-span-2 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] px-3 sm:px-6 py-2">
          {items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onUpdateQty={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="h-fit rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-4 sm:p-6 shadow-xs">
          <h2 className="text-base sm:text-lg font-semibold text-[var(--color-content-main)] mb-4">Order Summary</h2>
          
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between text-[var(--color-content-sub)]">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[var(--color-content-sub)]">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="border-t border-[var(--color-surface-border)] pt-3 flex justify-between text-sm sm:text-base font-semibold text-[var(--color-content-main)]">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <p className="mt-3 text-[11px] sm:text-xs text-[var(--color-content-muted)]">
            Final price confirmed at checkout by our secure server.
          </p>

          <Link href="/checkout" className="mt-5 block">
            <Button className="w-full h-11 text-xs sm:text-sm font-bold">Proceed to Checkout</Button>
          </Link>

          <Link
            href="/shop"
            className="mt-3 block text-center text-xs sm:text-sm text-[var(--color-brand-light)] hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}