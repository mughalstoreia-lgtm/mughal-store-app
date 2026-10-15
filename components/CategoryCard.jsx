import Link from "next/link";

export default function CategoryCard({ category }) {
  // Safe Fallbacks for Title and Image
  const title = category?.name || category?.title || "Category";
  const imageSrc = category?.image || category?.imageUrl || "/placeholder.jpg";

  // Fix: undefined bug handle kiya hai (slug -> _id -> category name slugified)
  const slug =
    category?.slug ||
    category?._id ||
    category?.id ||
    encodeURIComponent(title.toLowerCase().trim().replace(/\s+/g, "-"));

  return (
    <Link
      href={`/shop?category=${slug}`}
      className="group relative flex aspect-square w-full flex-col justify-end overflow-hidden rounded-2xl border border-surface-border bg-surface-dark p-5 shadow-sm transition-all duration-300 hover:shadow-xl"
    >
      {/* Background Image using standard img tag */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500"
        />
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity group-hover:from-black/90" />

      {/* Content */}
      <div className="relative z-10 flex flex-col">
        <h2 className="text-lg font-bold text-white transition-colors group-hover:text-brand-primary">
          {title}
        </h2>
        {category?.itemCount !== undefined && (
          <p className="text-xs font-medium text-text-sub mt-0.5">
            {category.itemCount} Products
          </p>
        )}
      </div>
    </Link>
  );
}