'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  formatPrice,
  getDiscountPercent,
  getProductSlug,
  getImageUrl,
  hasProductDiscount,
} from "@/lib/utils";
import ProductImage from "./ProductImage";

/* ------------------------------------------------------------------ */
/*  Small icons                                                        */
/* ------------------------------------------------------------------ */

function CartIcon({ className = "h-3.5 w-3.5 sm:h-4 sm:w-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}

function Stars({ rating }) {
  const full = Math.round(Math.max(0, Math.min(5, rating)));
  return (
    <div className="flex items-center justify-center gap-0.5" role="img" aria-label={`Rated ${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < full ? "text-[var(--color-brand-primary)]" : "text-white/20"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.25 4.15 1 5.85L10 14.9l-5.25 2.8 1-5.85L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Product Card                                                       */
/* ------------------------------------------------------------------ */

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isInWishlist, toggle } = useWishlist();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [wishLoading, setWishLoading] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const slug = getProductSlug(product);
  const image = getImageUrl(product.images);
  const hoverImage =
    Array.isArray(product.images) && product.images.length > 1
      ? getImageUrl([product.images[1]])
      : null;

  const hasDiscount = hasProductDiscount(product.price, product.discountPrice);
  const discountPct = hasDiscount ? getDiscountPercent(product.price, product.discountPrice) : 0;
  const outOfStock = !product.stock || product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 5;
  const inWish = isInWishlist(product._id);
  const href = `/shop/products/${slug}`;
  const rating = Number(product.rating ?? product.averageRating ?? 0);

  // Sold out items (or ones needing an option choice) go to the product page
  const needsViewPage = outOfStock || (product.variants?.length ?? 0) > 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (needsViewPage || added) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
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
      /* ignore */
    } finally {
      setWishLoading(false);
    }
  };

  // One badge at a time
  let badge = null;
  if (outOfStock) badge = { label: "Sold out", cls: "bg-black/85 text-[var(--color-text-white)]" };
  else if (product.isHot) badge = { label: "Hot", cls: "bg-[var(--color-accent-danger)] text-[var(--color-text-white)]" };
  else if (hasDiscount && discountPct > 0) badge = { label: `${discountPct}% off`, cls: "bg-[var(--color-brand-primary)] text-[var(--color-content-main)]" };
  else if (lowStock) badge = { label: `Only ${product.stock} left`, cls: "bg-black/85 text-[var(--color-brand-light)]" };

  const btnBase =
    "mt-auto flex w-full items-center justify-center gap-1.5 sm:gap-2 rounded-lg border py-2 sm:py-2.5 text-[11px] sm:text-sm font-semibold transition-all duration-300 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)]";
  const btnIdle =
    "border-[var(--color-brand-primary)]/70 text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-content-main)]";

  return (
    <article className="group relative flex h-full flex-col rounded-2xl sm:rounded-3xl border border-[var(--color-brand-primary)]/35 bg-[var(--color-card-dark)] p-2 sm:p-4 transition-all duration-500 hover:border-[var(--color-brand-primary)] hover:shadow-[0_18px_18px_-20px_var(--color-brand-primary)]">
      {/* Image: white studio shot fading into the card */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg sm:rounded-xl bg-white">
        <Link
          href={href}
          aria-label={product.name}
          className="absolute inset-0 z-0 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-brand-primary)]"
        >
          <ProductImage
            src={image}
            alt={product.name || "Product"}
            fill
            variant="card"
            className={`object-cover transition-all duration-700 ease-out motion-reduce:transition-none ${
              hoverImage ? "group-hover:opacity-0" : "group-hover:scale-105"
            } ${outOfStock ? "opacity-70" : ""}`}
          />
          {hoverImage && (
            <ProductImage
              src={hoverImage}
              alt=""
              fill
              variant="card"
              className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 motion-reduce:transition-none"
            />
          )}
        </Link>

        {/* Bottom fade to card colour */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--color-card-dark)] via-[var(--color-card-dark)]/60 to-transparent" />

        {badge && (
          <span className={`absolute left-1.5 top-1.5 sm:left-2.5 sm:top-2.5 z-10 rounded-full px-2 py-[3px] sm:px-2.5 sm:py-1 text-[9px] sm:text-[11px] font-semibold leading-none ${badge.cls}`}>
            {badge.label}
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={wishLoading}
          aria-pressed={inWish}
          aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-1.5 top-1.5 sm:right-2.5 sm:top-2.5 z-10 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-brand-primary)] ${
            inWish
              ? "bg-[var(--color-accent-danger-soft)] text-[var(--color-accent-danger)] ring-1 ring-[var(--color-accent-danger)]/50"
              : "bg-black/70 text-[var(--color-text-white)] hover:text-[var(--color-brand-primary)]"
          } ${wishLoading ? "opacity-60" : ""}`}
        >
          <svg
            className="h-3.5 w-3.5 sm:h-4 sm:w-4"
            fill={inWish ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      {/* Info Container — Perfectly Compact & Centered */}
<div className="mt-2 flex flex-1 flex-col text-center">
  <Link href={href} className="focus-visible:outline-none">
    <h3 className="line-clamp-1 text-xs sm:text-sm font-semibold leading-tight text-white transition-colors group-hover:text-[var(--color-brand-light)]">
      {product.name}
    </h3>
  </Link>

  {/* Compact Price Tag right below Title */}
  <div className="mt-3 mb-2 flex flex-wrap items-baseline justify-center gap-x-1.5">
    <span className="text-xs sm:text-base font-extrabold text-[var(--color-brand-primary)]">
      {formatPrice(hasDiscount ? product.discountPrice : product.price)}
    </span>
    {hasDiscount && (
      <span className="text-[10px] sm:text-xs text-zinc-500 line-through">
        {formatPrice(product.price)}
      </span>
    )}
  </div>

        {needsViewPage ? (
          <Link href={href} className={`${btnBase} ${btnIdle}`}>
            <CartIcon />
            View Product
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            className={`${btnBase} ${
              added
                ? "border-[var(--color-accent-success)]/60 bg-[var(--color-accent-success-soft)] text-[var(--color-accent-success)]"
                : btnIdle
            }`}
          >
            <CartIcon />
            {added ? "Added" : "Add to Cart"}
          </button>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Featured Section                                                   */
/* ------------------------------------------------------------------ */

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Arrow({ dir, onClick, disabled }) {
  const left = dir === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={left ? "Previous products" : "Next products"}
      className={`absolute top-[42%] z-20 -translate-y-1/2 flex h-8 w-8 min-[400px]:h-9 min-[400px]:w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[var(--color-brand-primary)] bg-[var(--color-surface-dark)]/95 text-[var(--color-brand-primary)] shadow-[0_6px_20px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-300 hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-content-main)] active:scale-90 disabled:pointer-events-none disabled:opacity-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-light)] ${
        left ? "left-1 sm:left-3 lg:left-4" : "right-1 sm:right-3 lg:right-4"
      }`}
    >
      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d={left ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}

export default function FeaturedSection({ featured = [] }) {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState(featured || []);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (featured?.length) setProducts(shuffle(featured));
  }, [featured]);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < max - 4);
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [products, updateScrollState]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: (direction === "left" ? -1 : 1) * el.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section
      aria-labelledby="featured-heading"
      className="relative overflow-hidden bg-[var(--color-surface-dark)] py-8 sm:py-10 md:py-14 text-[var(--color-text-white)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-[var(--color-brand-soft)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-brand-primary)]/50 to-transparent"
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="mb-1.5 sm:mb-2 text-[11px] sm:text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-primary)]">
              — Our Handpicked —
            </p>
            <h2
              id="featured-heading"
              className="text-3xl min-[400px]:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--color-text-white)]"
            >
              Featured Products
            </h2>
          </div>

          <Link
            href="/shop"
            className="group/link inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand-primary)] transition-colors hover:text-[var(--color-brand-light)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-brand-primary)]"
          >
            Shop all products
            <svg className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Slider */}
        {products.length > 0 ? (
          <>
            <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
              {/* Arrows overlap the card edges, visible on every screen size */}
              <Arrow dir="left" onClick={() => scroll("left")} disabled={!canLeft} />
              <Arrow dir="right" onClick={() => scroll("right")} disabled={!canRight} />

              <div
                ref={scrollRef}
                onScroll={updateScrollState}
                className="flex snap-x snap-mandatory gap-3 sm:gap-5 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-8 pb-5 pt-1 [scroll-padding-left:1rem] sm:[scroll-padding-left:1.5rem] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden motion-reduce:scroll-auto"
              >
                {products.map((p) => (
                  <div
                    key={p._id || p.id}
                    /*
                      Under 520px: exactly 2 cards fill the row
                      width = (100vw - 2*16px padding - 12px gap) / 2
                      (320px screen = 138px/card, 520px screen = 238px/card)
                    */
                    className="w-[calc((100vw-2rem-0.75rem)/2)] min-[520px]:w-[210px] sm:w-[240px] md:w-[260px] lg:w-[270px] flex-shrink-0 snap-start"
                  >
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>

            <div
              aria-hidden="true"
              className="mx-auto mt-1 h-[2px] w-full max-w-[10rem] sm:max-w-xs overflow-hidden rounded-full bg-white/10"
            >
              <div
                className="h-full rounded-full bg-[var(--color-brand-primary)] transition-[width] duration-300"
                style={{ width: `${Math.max(12, Math.min(100, 12 + progress * 88))}%` }}
              />
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--color-brand-primary)]/30 py-16 text-center">
            <p className="text-sm text-[var(--color-text-sub)]">No featured products yet. Check back soon.</p>
            <Link href="/shop" className="mt-4 inline-block text-sm font-medium text-[var(--color-brand-primary)] hover:underline">
              Browse the shop
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}