'use client';

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ProductCard } from "./FeaturedSection";

export default function NewArrivalsSection({ newArrivals = [] }) {
  const scrollContainerRef = useRef(null);

  const [products, setProducts] = useState(newArrivals || []);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (newArrivals?.length) {
      setProducts([...newArrivals].sort(() => Math.random() - 0.5));
    }
  }, [newArrivals]);

  const handleScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < maxScroll - 5);
    
    if (maxScroll > 0) {
      setScrollProgress((el.scrollLeft / maxScroll) * 100);
    }
  }, []);

  useEffect(() => {
    handleScrollState();
    window.addEventListener("resize", handleScrollState);
    return () => window.removeEventListener("resize", handleScrollState);
  }, [products, handleScrollState]);

  const scroll = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section 
      aria-labelledby="new-arrivals-heading"
      className="relative overflow-hidden bg-[#12110D] py-8 sm:py-10 md:py-14 text-white border-t border-[#C89D2A]/20"
    >
      {/* Background Soft Glow */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/4 h-80 w-80 rounded-full bg-[#C89D2A]/[0.04] blur-[120px]"
      />

      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        
        {/* Header Row */}
        <div className="mb-6 sm:mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            {/* Image Matched Tag */}
            <p className="mb-1.5 sm:mb-2 text-[11px] sm:text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-primary)]">
              — Our Handpicked —
            </p>
            <h2 
              id="new-arrivals-heading"
              className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white"
            >
              New Arrivals
            </h2>
          </div>

          {/* Action Links & Navigation Arrows */}
          <div className="flex items-center justify-between sm:justify-end gap-5">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#C89D2A] transition-colors hover:text-[#e5bc48]"
            >
              <span className="border-b border-[#C89D2A]/40 pb-0.5 group-hover:border-[#C89D2A] transition-colors">
                Shop all products
              </span>
              <svg 
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            {products.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  aria-label="Previous products"
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-[#C89D2A]/30 bg-[#1A1813] text-white shadow-xs transition-all duration-300 hover:border-[#C89D2A] hover:bg-[#C89D2A] hover:text-black active:scale-90 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  aria-label="Next products"
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-[#C89D2A]/30 bg-[#1A1813] text-white shadow-xs transition-all duration-300 hover:border-[#C89D2A] hover:bg-[#C89D2A] hover:text-black active:scale-90 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Slider Track */}
        {products.length > 0 ? (
          <>
            <div
              ref={scrollContainerRef}
              onScroll={handleScrollState}
              className="flex gap-3.5 sm:gap-5 overflow-x-auto scroll-smooth pb-4 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {products.map((p) => (
                <div
                  key={`new-${p._id || p.id}`}
                  className="w-[calc((100vw-3.5rem)/2)] min-[520px]:w-[210px] sm:w-[240px] md:w-[260px] lg:w-[280px] flex-shrink-0"
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div 
              aria-hidden="true" 
              className="mx-auto mt-6 h-1 w-full max-w-xs overflow-hidden rounded-full bg-white/10"
            >
              <div
                className="h-full rounded-full bg-[#C89D2A] transition-[width] duration-300 ease-out"
                style={{ width: `${Math.max(15, scrollProgress)}%` }}
              />
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center bg-white/[0.02]">
            <p className="text-sm font-medium text-zinc-400">
              New products will appear here once available from the store.
            </p>
            <Link 
              href="/shop" 
              className="mt-3 inline-block text-xs font-bold text-[#C89D2A] hover:underline"
            >
              Explore current catalog &rarr;
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}