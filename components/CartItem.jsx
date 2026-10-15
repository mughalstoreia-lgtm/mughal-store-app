"use client";

import Link from "next/link";
import { formatPrice, getImageUrl, hasProductDiscount } from "@/lib/utils";
import QuantitySelector from "./QuantitySelector";
import ProductImage from "./ProductImage";

export default function CartItem({ item, onUpdateQty, onRemove }) {
  const unit = hasProductDiscount(item.price, item.discountPrice)
    ? item.discountPrice
    : item.price;
  const slug = item.productId || "";

  return (
    <div className="flex gap-4 border-b border-surface-border py-5 last:border-0">
      <Link
        href={`/shop/products/${slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-hover"
      >
        <ProductImage
          src={getImageUrl(item.image)}
          alt={item.name}
          fill
          variant="cart"
          className="object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-2">
          <div>
            <Link
              href={`/shop/products/${slug}`}
              className="text-sm font-medium text-content-main hover:text-brand-light line-clamp-2"
            >
              {item.name}
            </Link>
            {item.brand && (
              <p className="mt-0.5 text-xs text-content-muted">{item.brand}</p>
            )}
          </div>
          <p className="text-sm font-semibold text-content-main whitespace-nowrap">
            {formatPrice(unit * item.quantity)}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <QuantitySelector
            value={item.quantity}
            max={item.stock ?? 99}
            onChange={(q) => onUpdateQty(item.productId, q)}
          />
          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            className="text-xs text-content-muted hover:text-accent-danger transition"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
