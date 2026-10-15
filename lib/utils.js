/**
 * Format price in PKR
 */
export function formatPrice(amount) {
  if (amount == null || isNaN(amount)) return "Rs. 0";
  const num = Number(amount);
  return `Rs. ${num.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
}

/**
 * True shop/autonly when discount is a real positive price lower than original.
 * discountPrice 0 / null / undefined = no discount (do not show 0% or Rs. 0).
 */
export function hasProductDiscount(price, discountPrice) {
  const p = Number(price);
  const d = Number(discountPrice);
  if (price == null || discountPrice == null || discountPrice === "") return false;
  if (isNaN(p) || isNaN(d) || p <= 0) return false;
  return d > 0 && d < p;
}

/**
 * Calculate discount percentage (0 if no valid discount)
 */
export function getDiscountPercent(price, discountPrice) {
  if (!hasProductDiscount(price, discountPrice)) return 0;
  const p = Number(price);
  const d = Number(discountPrice);
  return Math.round(((p - d) / p) * 100);
}

/**
 * Unit price after valid discount
 */
export function getEffectivePrice(price, discountPrice) {
  if (hasProductDiscount(price, discountPrice)) return Number(discountPrice);
  return Number(price) || 0;
}

/**
 * Generate a URL-friendly slug from text (utility only — not used for routes)
 */
export function slugify(text) {
  if (!text) return "";
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Product URL segment — always MongoDB _id (unique).
 * Never use name or backend slug for routing.
 */
export function getProductSlug(product) {
  if (!product) return "";
  return product._id || product.productId || "";
}

/**
 * Safe image URL with placeholder
 */
export function getImageUrl(images, index = 0) {
  if (Array.isArray(images) && images.length > index && images[index]) {
    return images[index];
  }
  if (typeof images === "string" && images) return images;
  return "/placeholder-product.svg";
}

/**
 * Whether the src can be optimized by next/image
 * (local static assets + configured remote hosts)
 */
export function isOptimizableImage(src) {
  if (!src || typeof src !== "string") return false;
  if (src.startsWith("/")) return true; // public/
  try {
    const host = new URL(src).hostname;
    return (
      host === "res.cloudinary.com" ||
      host.endsWith(".cloudinary.com")
    );
  } catch {
    return false;
  }
}

/**
 * Optional Cloudinary URL transform for smaller delivery when
 * the optimizer is bypassed. Keeps original if not Cloudinary.
 * w = max width, q = quality (auto), f = format (auto)
 */
export function cloudinaryTransform(src, { width = 800, quality = "auto" } = {}) {
  if (!src || typeof src !== "string") return src;
  if (!src.includes("res.cloudinary.com") || !src.includes("/upload/")) {
    return src;
  }
  // Insert transform segment after /upload/
  return src.replace(
    "/upload/",
    `/upload/f_auto,q_${quality},w_${width},c_limit/`
  );
}

/**
 * Tiny shared blur placeholder (dark surface) for product images
 * 10x10 dark gray JPEG as base64
 */
export const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAKAAoDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAUGB//EACUQAAIBAwMEAwEAAAAAAAAAAAECAwAEEQUSITFBBhMiUWFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAAAAQIRITH/2gAMAwEAAhEDEEA/ALXRreC2t44o0CqgwAKpa1qN5rF0JbqZo1A4RTgfk1V0XSdP0m2W3s7dI1A5IHJ/NZ/iK+upNUvI47iR41DgBQDgflQBoW5v7m6kMlxM8jHqWY5pABRQA//Z";

/**
 * Debounce helper
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Order status badge config
 */
export const ORDER_STATUS = {
  pending: { label: "Pending", bg: "bg-accent-warning-soft", text: "text-accent-warning" },
  processing: { label: "Processing", bg: "bg-accent-info-soft", text: "text-accent-info" },
  shipped: { label: "Shipped", bg: "bg-accent-info-soft", text: "text-accent-info" },
  delivered: { label: "Delivered", bg: "bg-accent-success-soft", text: "text-accent-success" },
  cancelled: { label: "Cancelled", bg: "bg-accent-danger-soft", text: "text-accent-danger" },
};

export function getStatusConfig(status) {
  const key = (status || "pending").toLowerCase();
  return ORDER_STATUS[key] || ORDER_STATUS.pending;
}

/**
 * Payment method labels
 */
export const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on Delivery" },
];


/**
 * Shipping estimate based on store location:
 * Orangi Town, Sector 8, Karachi (motorcycle / local petrol cost).
 * Approx bike fuel ~Rs 18–22/km; average city trip ~8–12 km one-way.
 * Karachi local ≈ Rs 200–250. Outside Karachi higher.
 * Free over Rs 8,000 subtotal.
 */
export function estimateShipping(subtotal, city = "") {
  if (!subtotal || subtotal <= 0) return 0;
  if (subtotal >= 8000) return 0;

  const c = String(city || "").toLowerCase().trim();
  const isKarachi =
    !c ||
    c.includes("karachi") ||
    c.includes("orangi") ||
    c.includes("korangi") ||
    c.includes("malir") ||
    c.includes("gulshan") ||
    c.includes("north nazimabad") ||
    c.includes("saddar") ||
    c.includes("clifton") ||
    c.includes("defence") ||
    c.includes("dha");

  // Orangi Town Sector 8 hub — local Karachi delivery (petrol + rider)
  if (isKarachi) return 220;
  // Other cities in Pakistan (intercity courier share)
  return 450;
}
