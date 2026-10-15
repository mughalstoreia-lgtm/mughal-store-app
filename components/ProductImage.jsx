"use client";

import Image from "next/image";
import { useState } from "react";
import {
  getImageUrl,
  isOptimizableImage,
  BLUR_DATA_URL,
} from "@/lib/utils";

/**
 * Optimized product image with:
 * - next/image optimization when host is allowed
 * - blur placeholder
 * - fallback to local placeholder on error
 * - responsive sizes
 */
export default function ProductImage({
  src,
  alt = "Product",
  fill = false,
  width,
  height,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
  className = "object-cover",
  priority = false,
  quality = 75,
  /** 'card' | 'gallery' | 'thumb' | 'cart' — presets for sizes/quality */
  variant = "card",
}) {
  const resolved = typeof src === "string" ? src : getImageUrl(src);
  const [currentSrc, setCurrentSrc] = useState(resolved || "/placeholder-product.svg");
  const optimizable = isOptimizableImage(currentSrc);
  const isSvg = currentSrc.endsWith(".svg");

  const presets = {
    card: {
      sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
      quality: 75,
    },
    gallery: {
      sizes: "(max-width: 1024px) 100vw, 50vw",
      quality: 85,
    },
    thumb: {
      sizes: "64px",
      quality: 60,
    },
    cart: {
      sizes: "96px",
      quality: 70,
    },
  };

  const preset = presets[variant] || presets.card;
  const finalSizes = sizes || preset.sizes;
  const finalQuality = quality ?? preset.quality;

  const shared = {
    alt,
    className,
    priority,
    quality: finalQuality,
    sizes: finalSizes,
    // Skip optimizer for SVG placeholders and unknown hosts
    unoptimized: isSvg || !optimizable,
    // Blur only for optimizable raster images
    ...(optimizable && !isSvg
      ? {
          placeholder: "blur",
          blurDataURL: BLUR_DATA_URL,
        }
      : {}),
    onError: () => {
      if (currentSrc !== "/placeholder-product.svg") {
        setCurrentSrc("/placeholder-product.svg");
      }
    },
  };

  if (fill) {
    return <Image src={currentSrc} fill {...shared} />;
  }

  return (
    <Image
      src={currentSrc}
      width={width || 400}
      height={height || 400}
      {...shared}
    />
  );
}
