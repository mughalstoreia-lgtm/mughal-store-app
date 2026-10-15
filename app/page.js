import Link from "next/link";
import { getProducts, getCategories, getSpotlight } from "@/lib/api";
// import ProductCard from "@/components/ProductCard";
// import CategoryCard from "@/components/CategoryCard";
import ProductImage from "@/components/ProductImage";
import NewArrivalsSection from "@/components/NewArrivalsSection";
import {
  formatPrice,
  getDiscountPercent,
  getProductSlug,
  getImageUrl,
  hasProductDiscount,
} from "@/lib/utils";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import FeaturedSection from "@/components/FeaturedSection";
import { Spotlight } from "lucide-react";

export const dynamic = "force-dynamic";

async function fetchHomeData() {
  const [productsRes, categoriesRes, spotlightRes] = await Promise.allSettled([
    getProducts({ page: 1, limit: 100, sort: "newest" }),
    getCategories(),
    getSpotlight(),
  ]);

  const products =
    productsRes.status === "fulfilled"
      ? productsRes.value.data || productsRes.value.products || []
      : [];
  const categories =
    categoriesRes.status === "fulfilled"
      ? categoriesRes.value.data || categoriesRes.value.categories || []
      : [];
  const spotlight =
    spotlightRes.status === "fulfilled"
      ? spotlightRes.value.data || spotlightRes.value
      : null;

  return { products, categories, spotlight };
}

export default async function HomePage() {
  const { products, categories, spotlight } = await fetchHomeData();
  const featured = products;
  const newArrivals = products;

  return (
    <div>
      {/* ── Hero ── */}
     <HeroSection />
      {/* ── Shop by category ── */}
      <CategorySection categories={categories} />

      {/* ── Featured ── */}
      <FeaturedSection featured={featured} />

      {/* ── Spotlight ── */}
      {spotlight && spotlight._id && (
        <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
  <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
    
    {/* Soft Golden Background Light */}
    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-[var(--color-brand-soft)] blur-[120px] rounded-full pointer-events-none" />

    <div className="grid md:grid-cols-12 items-stretch sm:max-h-[420px]">
      
      {/* Left Image Section (7 Cols) */}
      <div className="md:col-span-5 relative bg-[var(--color-surface-hover)] min-h-[320px] md:min-h-[420px] overflow-hidden group">
        <ProductImage
          src={getImageUrl(spotlight.images)}
          alt={spotlight.name}
          fill
          variant="gallery"
          className="object- transition-transform duration-700 ease-out group-hover:scale-100"
        />

        {/* Floating Discount Tag */}
        {hasProductDiscount(spotlight.price, spotlight.discountPrice) && (
          <div className="absolute top-5 left-5 z-10 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 px-3.5 py-1.5 text-xs font-black text-[var(--color-brand-primary)] uppercase tracking-wider shadow-lg">
            SAVE {getDiscountPercent(spotlight.price, spotlight.discountPrice)}%
          </div>
        )}
      </div>

      {/* Right Content Section (5 Cols) */}
      <div className="md:col-span-7 flex flex-col justify-between p-7 sm:p-10 lg:p-12 bg-gradient-to-b from-[var(--color-surface-card)] to-[var(--color-surface-base)]">
        
        <div>
          {/* Header Subtitle */}
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-primary)] animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[var(--color-brand-primary)]">
              Spotlight Piece
            </span>
          </div>

          {spotlight.brand && (
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-content-muted)] mb-1">
              {spotlight.brand}
            </p>
          )}

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--color-content-main)] tracking-tight leading-snug">
            {spotlight.name}
          </h3>

          {spotlight.description && (
            <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-[var(--color-content-sub)] line-clamp-3">
              {spotlight.description}
            </p>
          )}
        </div>

        {/* Bottom Section: Price & Actions */}
        <div className="mt-8 pt-6 border-t border-[var(--color-surface-border)]/50">
          
          {/* Price Layout */}
          <div className="flex items-baseline gap-3 mb-6">
            {hasProductDiscount(spotlight.price, spotlight.discountPrice) ? (
              <>
                <span className="text-3xl font-black text-[var(--color-brand-primary)]">
                  {formatPrice(spotlight.discountPrice)}
                </span>
                <span className="text-sm font-semibold text-[var(--color-content-muted)] line-through">
                  {formatPrice(spotlight.price)}
                </span>
              </>
            ) : (
              <span className="text-3xl font-black text-[var(--color-brand-primary)]">
                {formatPrice(spotlight.price)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/shop/products/${getProductSlug(spotlight)}`}
              className="flex items-center justify-center rounded-xl text-nowrap bg-[var(--color-brand-primary)] py-3 px-4 text-xs font-extrabold text-white uppercase tracking-wider transition-all duration-300 hover:bg-[var(--color-brand-hover)] shadow-md active:scale-95"
            >
              Add to Cart
            </Link>
            
            <Link
              href={`/shop/products/${getProductSlug(spotlight)}`}
              className="flex items-center justify-center rounded-xl text-nowrap border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] py-3 px-4 text-xs font-bold text-[var(--color-content-main)] uppercase tracking-wider transition-all duration-300 hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-surface-hover)] active:scale-95"
            >
              View Details
            </Link>
          </div>

        </div>

      </div>

    </div>
  </div>
</section>
      )}

      {/* ── New arrivals ── */}
     <NewArrivalsSection newArrivals={newArrivals} />

      {/* ── Why us ── */}
      <section className="border-t border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-base,#F5F3EE)] py-12 md:py-16 text-[var(--color-content-main,#0B0B0B)]">
  <div className="container max-w-[1450px] mx-auto px-4">
    {/* Section Header */}
    <div className="mb-10 text-left">
      <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-hover,#B8941F)]">
        <span>—</span>
        <span>WHY CHOOSE MUGHAL STORE</span>
        <span>—</span>
      </div>
      <h2 className="font-serif text-3xl font-extrabold tracking-tight text-[var(--text-heading,#0B0B0B)] sm:text-4xl">
        Your Style, Our Priority
      </h2>
    </div>

    {/* Features Grid with Dividers */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
      {[
        {
          title: "100% Original Products",
          desc: "Guaranteed quality & authenticity",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          ),
        },
        {
          title: "Secure Payments",
          desc: "Safe & easy checkout",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          ),
        },
        {
          title: "Fast Delivery",
          desc: "Across Pakistan",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.243c0-.517-.213-1.02-.592-1.381L11.75 4.043A2.25 2.25 0 0010.158 3.375H5.25A2.25 2.25 0 003 5.625v8.625c0 .621.504 1.125 1.125 1.125h1.25" />
          ),
        },
        {
          title: "Dedicated Support",
          desc: "We're here to help",
          icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 0010 21c.67 0 1.332-.06 1.98-.176z" />
          ),
        },
      ].map((item, idx) => (
        <div
          key={item.title}
          className={`flex items-center gap-3.5 px-4 py-2 ${
            idx !== 0 ? "lg:border-l lg:border-[var(--color-surface-hover,#EBE7DD)]" : ""
          }`}
        >
          {/* Soft Gold/Brand Icon Wrapper */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-soft,rgba(212,175,55,0.14))] text-[var(--brand-700,#8F7215)]">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              {item.icon}
            </svg>
          </div>

          {/* Text Content */}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-[var(--text-body,#0B0B0B)] sm:text-base">{item.title}</h3>
            <p className="text-xs font-medium text-[var(--color-content-sub,#5F5F5F)]">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ── Newsletter ── */}
      {/* <section className="container mx-auto px-4 py-16">
        <div className="rounded-3xl border border-brand-primary/25 bg-gradient-to-br from-surface-card to-surface-hover/40 px-6 py-12 text-center md:px-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-light">
            Newsletter
          </p>
          <h2 className="text-2xl font-bold text-content-main">
            Stay in the circle of royalty
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-content-sub">
            Exclusive drops, heritage stories and member offers.
          </p>
          <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row" action="#">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 rounded-full border border-surface-border bg-surface-base px-5 py-3 text-sm text-content-main placeholder:text-content-muted focus:border-brand-primary focus:outline-none"
              aria-label="Email for newsletter"
            />
            <button
              type="submit"
              className="rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-surface-base transition hover:bg-brand-light"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section> */}
    </div>
  );
}
