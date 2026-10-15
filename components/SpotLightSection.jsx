'use client';

import Link from "next/link";
import ProductImage from "./ProductImage";
import {
  formatPrice,
  getDiscountPercent,
  getProductSlug,
  getImageUrl,
  hasProductDiscount,
} from "@/lib/utils";

export default function SpotlightSection({ spotlight }) {
  if (!spotlight) return null;

  const slug = getProductSlug(spotlight);
  const href = `/shop/products/${slug}`;
  const imageUrl = getImageUrl(spotlight.images);
  const hasDiscount = hasProductDiscount(spotlight.price, spotlight.discountPrice);
  const discountPct = hasDiscount
    ? getDiscountPercent(spotlight.price, spotlight.discountPrice)
    : 0;

  return (
    <section
      aria-labelledby="spotlight-heading"
      className="container mx-auto px-4 py-8 md:py-12"
    >
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-4 sm:p-6 lg:p-8 shadow-[0_15px_45px_-10px_rgba(212,175,55,0.12)]">
        
        {/* Production Ambient Lighting Effect */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[var(--color-brand-soft)] blur-[120px]"
        />

        <div className="grid md:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
          
          {/* Image Stage Container */}
          <div className="md:col-span-5 relative aspect-[4/3] md:aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[var(--color-surface-hover)] border border-[var(--color-surface-border)]/50 group">
            <Link href={href} tabIndex={-1} className="block h-full w-full">
              <ProductImage
                src={imageUrl}
                alt={spotlight.name || "Spotlight product"}
                fill
                variant="gallery"
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
              />
            </Link>

            {/* Status Badge */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-[var(--color-surface-card)]/90 backdrop-blur-md border border-[var(--color-surface-border)] px-3 py-1 shadow-sm">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[var(--color-brand-primary)] animate-pulse"
              />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-brand-primary)]">
                In The Spotlight
              </span>
            </div>
          </div>

          {/* Details & Action Panel */}
          <div className="md:col-span-7 flex flex-col justify-between h-full">
            <div>
              {/* Brand Header */}
              {spotlight.brand && (
                <div className="flex items-center gap-2 mb-2">
                  <span
                    aria-hidden="true"
                    className="h-px w-6 bg-[var(--color-brand-primary)]"
                  />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
                    {spotlight.brand}
                  </span>
                </div>
              )}

              {/* Product Title */}
              <Link href={href} className="group/title block">
                <h2
                  id="spotlight-heading"
                  className="text-xl sm:text-2xl lg:text-3xl font-black text-[var(--color-content-main)] tracking-tight leading-snug transition-colors group-hover/title:text-[var(--color-brand-primary)]"
                >
                  {spotlight.name}
                </h2>
              </Link>

              {/* Description */}
              {spotlight.description && (
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[var(--color-content-sub)] line-clamp-3">
                  {spotlight.description}
                </p>
              )}
            </div>

            {/* Pricing & CTA Buttons */}
            <div className="mt-6 pt-4 border-t border-[var(--color-surface-border)]/50">
              <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                <span className="text-2xl sm:text-3xl font-black text-[var(--color-brand-primary)]">
                  {formatPrice(hasDiscount ? spotlight.discountPrice : spotlight.price)}
                </span>

                {hasDiscount && (
                  <>
                    <span className="text-xs sm:text-sm font-semibold text-[var(--color-content-muted)] line-through">
                      {formatPrice(spotlight.price)}
                    </span>
                    <span className="ml-auto rounded-full bg-[var(--color-accent-danger-soft)] border border-[var(--color-accent-danger)]/30 px-2.5 py-0.5 text-[10px] font-black text-[var(--color-accent-danger)] uppercase tracking-wider">
                      SAVE {discountPct}%
                    </span>
                  </>
                )}
              </div>

              {/* CTAs */}
              <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                <Link
                  href={href}
                  className="flex-1 inline-flex items-center justify-center rounded-xl bg-[var(--color-brand-primary)] py-3 px-5 text-xs sm:text-sm font-extrabold text-black uppercase tracking-wider transition-all duration-300 hover:bg-[var(--color-brand-hover)] shadow-md shadow-[var(--color-brand-primary)]/20 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)]"
                >
                  Add to Cart
                </Link>

                <Link
                  href={href}
                  className="inline-flex items-center justify-center rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-base)] py-3 px-5 text-xs sm:text-sm font-bold text-[var(--color-content-main)] uppercase tracking-wider transition-all duration-300 hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-surface-hover)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)]"
                >
                  View Details
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}