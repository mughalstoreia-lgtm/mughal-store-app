import Link from "next/link";
import Image from "next/image";

export default function CategorySection({ categories = [] }) {
  return (
    <section className="bg-[var(--color-surface-base)] py-12 md:py-16 text-[var(--color-content-main)]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-content-sub)]">
            <span>—</span>
            <span className="text-[var(--color-brand-primary)]">SHOP BY CATEGORY</span>
            <span>—</span>
          </div>

          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl text-[var(--color-content-main)]">
            Explore Our Collections
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm md:text-base text-[var(--color-content-sub)] font-normal">
            From classic watches to stylish accessories — everything you need in one place.
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 md:gap-5">
            {categories.slice(0, 6).map((cat) => (
              <CategoryCard key={cat._id || cat.name} category={cat} />
            ))}
          </div>
        ) : (
          <p className="text-center text-[var(--color-content-muted)] py-8">
            Categories will appear when available.
          </p>
        )}
      </div>
    </section>
  );
}

function CategoryCard({ category }) {
  if (!category) return null;

  const name = typeof category === "string" ? category : category.name || "Category";
  const imageUrl = category.image || category.images?.[0] || "/placeholder.jpg";
  const slug = category.slug?.current || category.slug || encodeURIComponent(name.toLowerCase());

  return (
    <Link
      href={`/shop?category=${slug}`}
      className="group flex flex-col items-center text-center transition-transform duration-300"
    >
      {/* Outer Card: Light Cream Background with Soft Gold Border */}
      <div className="relative aspect-[4/4.5] w-full overflow-hidden rounded-2xl bg-[#EFECE6] border border-[#D4AF37]/35 p-1 shadow-sm transition-all duration-300 group-hover:border-[var(--color-brand-primary)] group-hover:shadow-md">
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-white">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover transition-transform duration-500"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl font-bold text-[var(--color-content-muted)]">
              {String(name).charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Category Name */}
      <h3 className="mt-3 text-base font-bold text-[#0B0B0B] group-hover:text-[var(--color-brand-primary)] transition-colors lowercase">
        {name}
      </h3>

      {/* Shop Now Link with #D4AF37 Border & White text on hover */}
      <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-[#D4AF37] px-3 py-1 text-xs font-semibold text-[#D4AF37] transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-white">
        Shop Now <span className="text-sm">→</span>
      </span>
    </Link>
  );
}