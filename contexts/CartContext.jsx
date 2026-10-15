"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { estimateShipping } from "@/lib/utils";

const CartContext = createContext(null);
const CART_KEY = "mughal_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((product, quantity = 1) => {
    if (!product?._id) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      const stock = product.stock ?? 99;
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, stock);
        return prev.map((i) =>
          i.productId === product._id ? { ...i, quantity: newQty } : i
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          discountPrice: product.discountPrice,
          image: Array.isArray(product.images) ? product.images[0] : product.images,
          stock: stock,
          quantity: Math.min(quantity, stock),
          brand: product.brand,
          slug: product._id,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.productId !== productId) return i;
          const q = Math.max(1, Math.min(quantity, i.stock ?? 99));
          return { ...i, quantity: q };
        })
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const subtotal = items.reduce((sum, i) => {
    const d = Number(i.discountPrice);
    const p = Number(i.price);
    const unit = i.discountPrice != null && d > 0 && d < p ? d : p;
    return sum + unit * i.quantity;
  }, 0);

  // Display shipping from Orangi Town Sector 8, Karachi petrol/local estimate.
  // Backend may still recalculate on order create.
  const shipping = items.length > 0 ? estimateShipping(subtotal, "Karachi") : 0;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shipping,
        total,
        hydrated,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
