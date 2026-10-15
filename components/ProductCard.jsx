"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice, getDiscountPercent, getProductSlug, getImageUrl, hasProductDiscount } from "@/lib/utils";
import { useRouter } from "next/navigation";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isInWishlist, toggle } = useWishlist();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [wishLoading, setWishLoading] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const slug = getProductSlug(product);
  const image = getImageUrl(product.images);
  const hasDiscount = hasProductDiscount(product.price, product.discountPrice);
  const discountPct = hasDiscount
    ? getDiscountPercent(product.price, product.discountPrice)
    : 0;
  const outOfStock = !product.stock || product.stock <= 0;
  const inWish = isInWishlist(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/wishlist");
      return;
    }
    setWishLoading(true);
    try {
      await toggle(product._id);
    } catch {
      /* Handled silently */
    } finally {
      setWishLoading(false);
    }
  };

  return (
    <article className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-card,#FFFFFF)] transition-all duration-300 hover:border-[var(--color-brand-primary,#D4AF37)]/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      {/* Product Image Link */}
      <Link
        href={`/shop/products/${slug}`}
        className="relative block aspect-[4/5] sm:aspect-square overflow-hidden bg-neutral-100"
      >
        {/* Discount Badge */}
        {hasDiscount && discountPct > 0 && (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[var(--color-accent-danger,#D94A4A)] px-2 py-0.5 text-[10px] sm:text-xs font-bold text-white shadow-xs">
            -{discountPct}%
          </span>
        )}

        {/* Stock Status Badge */}
        {outOfStock && (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-lg bg-black/75 backdrop-blur-xs px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white">
            Sold out
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={wishLoading}
          aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-2.5 top-2.5 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition-all duration-200 active:scale-90 ${
            inWish
              ? "border-[var(--color-accent-danger,#D94A4A)]/40 bg-red-50 text-[var(--color-accent-danger,#D94A4A)] shadow-xs"
              : "border-gray-200/80 bg-white/80 text-[var(--color-content-sub,#5F5F5F)] backdrop-blur-md hover:border-[var(--color-brand-primary,#D4AF37)] hover:text-[var(--color-brand-primary,#D4AF37)]"
          }`}
        >
          <svg
            className="h-4 w-4"
            fill={inWish ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Product Image */}
        <ProductImage
          src={image}
          alt={product.name || "Product"}
          fill
          variant="card"
          className="object-cover"
        />
      </Link>

      {/* Product Details Section */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {/* Brand Name */}
        {product.brand && (
          <p className="mb-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-primary,#D4AF37)] truncate">
            {product.brand}
          </p>
        )}

        {/* Title */}
        <Link href={`/shop/products/${slug}`} className="block mb-1.5">
          <h3 className="line-clamp-2 min-h-[2.25rem] sm:min-h-[2.6rem] text-xs sm:text-sm font-semibold leading-snug text-[var(--color-content-main,#0B0B0B)] transition-colors group-hover:text-[var(--color-brand-primary,#D4AF37)]">
            {product.name}
          </h3>
        </Link>

        {/* Pricing & Add To Cart Button Footer */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-[var(--color-surface-hover,#EBE7DD)]/60">
          <div className="min-w-0">
            {hasDiscount ? (
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
                <span className="text-xs sm:text-base font-bold text-[var(--color-content-main,#0B0B0B)] truncate">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="text-[10px] sm:text-xs text-[var(--color-content-muted,#A6A6A6)] line-through truncate">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-xs sm:text-base font-bold text-[var(--color-content-main,#0B0B0B)] truncate">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Add To Cart Button with Text */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label={added ? "Added to cart" : "Add to cart"}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 shrink-0 rounded-xl font-semibold text-xs transition-all duration-200 active:scale-95 shadow-xs ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-[var(--color-brand-primary,#D4AF37)] text-white hover:bg-[var(--color-brand-primary,#D4AF37)]/90 disabled:cursor-not-allowed disabled:opacity-40"
            }`}
          >
            {added ? (
              <>
                <svg className="h-3.5 w-3.5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>Added</span>
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                  />
                </svg>
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}