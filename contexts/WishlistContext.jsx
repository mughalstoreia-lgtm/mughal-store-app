"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import {
  getWishlist,
  addToWishlist as apiAdd,
  removeFromWishlist as apiRemove,
} from "@/lib/api";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await getWishlist(token);
      const data = res.data || res.wishlist || res || [];
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = useCallback(
    (productId) => {
      return items.some(
        (item) =>
          item._id === productId ||
          item.productId === productId ||
          item.product?._id === productId
      );
    },
    [items]
  );

  const add = async (productId) => {
    if (!token) throw new Error("Please login to use wishlist");
    await apiAdd(productId, token);
    await fetchWishlist();
  };

  const remove = async (productId) => {
    if (!token) throw new Error("Please login to use wishlist");
    await apiRemove(productId, token);
    await fetchWishlist();
  };

  const toggle = async (productId) => {
    if (!token) throw new Error("Please login to use wishlist");
    if (isInWishlist(productId)) {
      await remove(productId);
    } else {
      await add(productId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        count: items.length,
        loading,
        isInWishlist,
        add,
        remove,
        toggle,
        refresh: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
