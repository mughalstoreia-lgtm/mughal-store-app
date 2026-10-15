"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProduct, getProducts, addProductReview } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  formatPrice,
  getDiscountPercent,
  getImageUrl,
  hasProductDiscount,
} from "@/lib/utils";
import QuantitySelector from "@/components/QuantitySelector";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import ErrorState from "@/components/ErrorState";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Star,
  X,
  MessageSquarePlus,
  Heart,
  ShoppingBag,
  Zap,
} from "lucide-react";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggle } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Review states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const fetchProductData = async () => {
    try {
      const productId = slug;
      let p = null;

      try {
        const res = await getProduct(productId);
        const candidate = res.data?.product || res.data || res.product || res;
        if (candidate && (candidate._id === productId || candidate.slug === productId)) p = candidate;
      } catch {
        p = null;
      }

      if (!p || !p._id) {
        const list = await getProducts({ page: 1, limit: 100 });
        const items = list.data || list.products || [];
        p = items.find((item) => item._id === productId || item.slug === productId) || null;
      }

      if (!p || !p._id) throw new Error("Product not found");

      setProduct(p);

      if (p.category) {
        try {
          const rel = await getProducts({ category: p.category, limit: 4 });
          const items = (rel.data || []).filter((x) => x._id !== p._id);
          setRelated(items.slice(0, 4));
        } catch {
          setRelated([]);
        }
      }
    } catch (err) {
      setError(err.message || "Product not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      setLoading(true);
      setError(null);
      fetchProductData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 animate-pulse bg-[var(--color-surface-base)] min-h-screen">
        <div className="mb-6 h-4 w-48 rounded bg-[var(--color-surface-hover)]" />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6 aspect-square w-full rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-surface-border)]/50" />
          <div className="lg:col-span-6 space-y-6 py-2">
            <div className="h-4 w-28 rounded bg-[var(--color-surface-hover)]" />
            <div className="h-10 w-4/5 rounded bg-[var(--color-surface-hover)]" />
            <div className="h-12 w-1/2 rounded-xl bg-[var(--color-surface-hover)]" />
            <div className="h-24 w-full rounded-xl bg-[var(--color-surface-hover)]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <ErrorState
        title="Product not found"
        message={error || "This product may have been removed."}
        onRetry={() => router.push("/shop")}
      />
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ["/placeholder-product.svg"];

  const hasDiscount = hasProductDiscount(product.price, product.discountPrice);
  const outOfStock = !product.stock || product.stock <= 0;
  const inWish = isInWishlist(product._id);

  const handleNextImage = () => {
    setActiveImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    setActiveImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleAdd = () => {
    if (outOfStock) return;
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    addItem(product, qty);
    router.push("/cart");
  };

  const handleWish = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/shop/products/" + slug);
      return;
    }
    setWishLoading(true);
    try {
      await toggle(product._id);
    } catch {
      /* */
    } finally {
      setWishLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");
    setReviewLoading(true);

    try {
      await addProductReview(product._id, { rating, comment });
      setReviewSuccess("Review submitted successfully!");
      setComment("");
      setRating(5);
      await fetchProductData();
    } catch (err) {
      setReviewError(err.response?.data?.message || err.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:pt-7.5 md:py-9 bg-[var(--color-surface-base)] min-h-screen text-[var(--color-content-main)] overflow-x-hidden">
      
      {/* Navigation Breadcrumb */}
      <nav className="mb-4 sm:mb-6 flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--color-content-muted)] overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/shop" className="hover:text-[var(--color-brand-primary)] transition-colors">
          Shop
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              href={`/shop/categories/${encodeURIComponent(product.category)}`}
              className="hover:text-[var(--color-brand-primary)] transition-colors capitalize"
            >
              {product.category}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[var(--color-content-main)] font-bold truncate max-w-[150px] sm:max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Grid Section */}
      <div className="grid gap-6 sm:gap-8 lg:gap-14 grid-cols-1 lg:grid-cols-12 items-start">
        
        {/* Gallery Section */}
        <div className="lg:col-span-6 w-full space-y-3">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[var(--color-surface-border)]/60 bg-[var(--color-surface-card)] shadow-xs group">
            <ProductImage
              key={activeImg}
              src={getImageUrl(images, activeImg)}
              alt={product.name}
              fill
              variant="gallery"
              className="object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
              priority
              onClick={() => setIsLightboxOpen(true)}
            />

            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-3 right-3 z-10 rounded-full bg-[var(--color-surface-dark)]/70 p-2 text-white backdrop-blur-md hover:bg-[var(--color-surface-dark)] transition-all shadow-lg"
              title="Fullscreen View"
            >
              <Maximize2 size={16} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 z-10 -mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-dark)]/70 text-white backdrop-blur-md shadow-md"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 z-10 -mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-dark)]/70 text-white backdrop-blur-md shadow-md"
                >
                  <ChevronRight size={18} />
                </button>

                <span className="absolute bottom-3 right-3 z-10 rounded-full bg-[var(--color-surface-dark)]/80 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                  {activeImg + 1} / {images.length}
                </span>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden rounded-xl transition-all border-2 ${
                    activeImg === i
                      ? "border-[var(--color-brand-primary)] ring-2 ring-[var(--color-brand-primary)]/20 shadow-xs"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <ProductImage
                    src={img}
                    alt={`${product.name} thumbnail ${i + 1}`}
                    fill
                    variant="thumb"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-6">
          
          {/* Brand & Title */}
          <div className="space-y-1.5">
            {product.brand && (
              <span className="inline-block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-brand-hover)] px-2.5 py-0.5 rounded-full bg-[var(--color-brand-soft)] border border-[var(--color-brand-primary)]/30">
                {product.brand}
              </span>
            )}
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-content-main)] tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing Banner */}
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-surface-border)]/50 shadow-xs">
            {hasDiscount ? (
              <>
                <span className="text-2xl sm:text-3xl font-black text-[var(--color-brand-hover)]">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="text-sm sm:text-lg text-[var(--color-content-muted)] line-through font-semibold">
                  {formatPrice(product.price)}
                </span>
                <span className="ml-auto rounded-full bg-[var(--color-accent-danger-soft)] px-2.5 py-0.5 text-[11px] sm:text-xs font-extrabold text-[var(--color-accent-danger)]">
                  SAVE {getDiscountPercent(product.price, product.discountPrice)}%
                </span>
              </>
            ) : (
              <span className="text-2xl sm:text-3xl font-black text-[var(--color-content-main)]">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Metadata Specs */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs">
            {product.sku && (
              <div className="p-2.5 sm:p-3 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-surface-hover)]">
                <span className="block text-[9px] sm:text-[10px] text-[var(--color-content-muted)] font-bold uppercase tracking-wider">SKU</span>
                <span className="font-bold text-[var(--color-content-main)] truncate block mt-0.5">{product.sku}</span>
              </div>
            )}
            {product.category && (
              <div className="p-2.5 sm:p-3 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-surface-hover)] capitalize">
                <span className="block text-[9px] sm:text-[10px] text-[var(--color-content-muted)] font-bold uppercase tracking-wider">Category</span>
                <span className="font-bold text-[var(--color-content-main)] truncate block mt-0.5">{product.category}</span>
              </div>
            )}
            <div className="p-2.5 sm:p-3 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-surface-hover)]">
              <span className="block text-[9px] sm:text-[10px] text-[var(--color-content-muted)] font-bold uppercase tracking-wider">Availability</span>
              <span className={`font-bold block mt-0.5 text-[11px] sm:text-xs ${outOfStock ? "text-[var(--color-accent-danger)]" : "text-[var(--color-accent-success)]"}`}>
                {outOfStock ? "Out of Stock" : `In Stock (${product.stock})`}
              </span>
            </div>
          </div>

          {/* Product Description */}
          {product.description && (
            <div className="space-y-1.5 pt-1">
              <h3 className="text-xs font-extrabold text-[var(--color-content-main)] uppercase tracking-wider">Description</h3>
              <p className="text-[var(--color-content-sub)] text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Responsive Action Row for 320px & up */}
          <div className="pt-3 sm:pt-4 border-t border-[var(--color-surface-border)]/50 space-y-3">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              
              {/* Quantity and Wishlist top/side wrapper for mobile */}
              <div className="flex items-center gap-2.5 justify-between sm:justify-start">
                <div className="shrink-0">
                  <QuantitySelector
                    value={qty}
                    max={product.stock || 1}
                    onChange={setQty}
                    disabled={outOfStock}
                  />
                </div>

                {/* Wishlist Button for mobile header alignment */}
                <button
                  type="button"
                  onClick={handleWish}
                  disabled={wishLoading}
                  title={inWish ? "Remove from Wishlist" : "Add to Wishlist"}
                  className="sm:hidden h-11 w-11 shrink-0 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] flex items-center justify-center shadow-xs cursor-pointer"
                >
                  <Heart
                    size={18}
                    className={
                      inWish
                        ? "fill-[var(--color-accent-danger)] text-[var(--color-accent-danger)]"
                        : "text-[var(--color-content-main)]"
                    }
                  />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={outOfStock}
                className="flex-1 h-11 sm:h-12 px-3 sm:px-4 py-2.5 sm:py-0 rounded-xl text-xs sm:text-sm font-extrabold border-2 border-[var(--color-brand-primary)] text-[var(--color-content-main)] bg-[var(--color-surface-card)] hover:bg-[var(--color-brand-soft)] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <ShoppingBag size={15} />
                <span>{added ? "Added!" : "Add to Cart"}</span>
              </button>

              {/* Buy Now */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={outOfStock}
                className="flex-1 h-11 sm:h-12 px-3 sm:px-4 py-2.5 sm:py-0 rounded-xl text-xs sm:text-sm font-bold bg-[var(--color-brand-primary)] text-[var(--panel-header)] hover:bg-[var(--color-brand-hover)] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Zap size={15} />
                <span>Buy Now</span>
              </button>

              {/* Desktop Wishlist Button */}
              <button
                type="button"
                onClick={handleWish}
                disabled={wishLoading}
                title={inWish ? "Remove from Wishlist" : "Add to Wishlist"}
                className="hidden sm:flex h-12 w-12 shrink-0 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-hover)] items-center justify-center transition-all shadow-xs cursor-pointer"
              >
                <Heart
                  size={20}
                  className={
                    inWish
                      ? "fill-[var(--color-accent-danger)] text-[var(--color-accent-danger)]"
                      : "text-[var(--color-content-main)]"
                  }
                />
              </button>

            </div>

          </div>

        </div>
      </div>

      {/* Customer Reviews Section */}
      <div id="reviews-section" className="mt-10 sm:mt-12 border-t border-[var(--color-surface-border)] pt-6 sm:pt-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-content-main)]">Customer Reviews</h2>
          <p className="text-[11px] sm:text-xs text-[var(--color-content-muted)] mt-0.5">Verified buyers feedback and ratings</p>
        </div>

        {/* Review Form */}
        {isAuthenticated ? (
          <form onSubmit={handleReviewSubmit} className="mb-8 sm:mb-10 p-4 sm:p-6 bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-surface-border)]/60 shadow-xs max-w-xl space-y-3.5">
            <div className="flex items-center gap-2">
              <MessageSquarePlus className="text-[var(--color-brand-primary)]" size={16} />
              <h3 className="font-bold text-[var(--color-content-main)] text-xs sm:text-sm">Leave Your Feedback</h3>
            </div>
            
            {reviewError && <div className="p-2.5 rounded-lg bg-[var(--color-accent-danger-soft)] text-[var(--color-accent-danger)] text-xs font-semibold">{reviewError}</div>}
            {reviewSuccess && <div className="p-2.5 rounded-lg bg-[var(--color-accent-success-soft)] text-[var(--color-accent-success)] text-xs font-semibold">{reviewSuccess}</div>}

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[var(--color-content-sub)] uppercase tracking-wider">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      size={18}
                      className={
                        star <= (hoverRating || rating)
                          ? "fill-[var(--color-brand-primary)] text-[var(--color-brand-primary)]"
                          : "text-[var(--color-surface-hover)]"
                      }
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-bold text-[var(--color-content-main)]">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[var(--color-content-sub)] uppercase tracking-wider">Comment</label>
              <textarea
                rows="3"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your thoughts about this product..."
                className="w-full rounded-xl border border-[var(--color-surface-border)]/80 bg-[var(--color-surface-base)] p-3 text-xs text-[var(--color-content-main)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)] transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={reviewLoading}
              className="rounded-xl h-10 px-5 text-xs font-bold bg-[var(--color-brand-primary)] text-[var(--panel-header)] hover:bg-[var(--color-brand-hover)] transition-all shadow-xs cursor-pointer"
            >
              {reviewLoading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-surface-border)] text-center max-w-md">
            <p className="text-xs text-[var(--color-content-sub)] font-medium">
              Want to write a review? Please{" "}
              <Link href={`/auth/login?redirect=/shop/products/${slug}`} className="text-[var(--color-brand-hover)] font-bold underline">
                log in
              </Link>.
            </p>
          </div>
        )}

        {/* Review List */}
        <div className="space-y-3 max-w-2xl">
          {product.reviews?.length > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev._id} className="p-3.5 sm:p-4 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-surface-border)]/60 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)] font-bold flex items-center justify-center text-xs border border-[var(--color-brand-primary)]/30">
                      {rev.name ? rev.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[var(--color-content-main)] block">{rev.name}</span>
                      <span className="text-[10px] text-[var(--color-content-muted)]">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-[var(--color-brand-primary)]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={12}
                        className={star <= rev.rating ? "fill-[var(--color-brand-primary)] text-[var(--color-brand-primary)]" : "text-[var(--color-surface-hover)]"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[var(--color-content-sub)] leading-relaxed pl-9 sm:pl-10">{rev.comment}</p>
              </div>
            ))
          ) : (
            <div className="p-6 rounded-xl bg-[var(--color-surface-card)] border border-dashed border-[var(--color-surface-border)] text-center">
              <p className="text-xs text-[var(--color-content-muted)] font-medium">No reviews yet for this product.</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <section className="mt-10 sm:mt-12 border-t border-[var(--color-surface-border)] pt-6 sm:pt-8">
          <h2 className="text-xl font-extrabold text-[var(--color-content-main)] mb-4 sm:mb-5">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 backdrop-blur-md animate-fade-in">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors shadow-lg cursor-pointer"
          >
            <X size={20} />
          </button>

          <div className="relative flex h-full w-full max-w-5xl items-center justify-center">
            <ProductImage
              key={activeImg}
              src={getImageUrl(images, activeImg)}
              alt={product.name}
              fill
              variant="gallery"
              className="max-h-[85vh] max-w-full object-contain rounded-xl"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:left-3 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors shadow-xl cursor-pointer"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-3 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors shadow-xl cursor-pointer"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
{/* Store Guarantees
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-dashed border-[var(--color-surface-hover)] text-center text-[11px] font-bold text-[var(--color-content-sub)]">
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-[var(--color-surface-card)]/50">
                <Truck size={18} className="text-[var(--color-brand-primary)]" />
                <span>Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-[var(--color-surface-card)]/50">
                <ShieldCheck size={18} className="text-[var(--color-brand-primary)]" />
                <span>Authentic Product</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-[var(--color-surface-card)]/50">
                <RotateCcw size={18} className="text-[var(--color-brand-primary)]" />
                <span>Easy Returns</span>
              </div>
            </div> */}