const API_URL = process.env.NEXT_PUBLIC_MYAPI;

/**
 * Centralized API client
 */
async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const config = {
    ...options,
    headers,
  };
  delete config.token;

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || data.error || `Request failed (${res.status})`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.status) throw err;
    const networkError = new Error("Network error. Please check your connection.");
    networkError.status = 0;
    throw networkError;
  }
}

// ─── Auth ───────────────────────────────────────────────
export async function register({ name, email, password }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function googleLogin(idToken) {
  return request("/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
}

export async function forgotPassword(email) {
  return request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token, newPassword) {
  return request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}

export async function getMe(token) {
  return request("/auth/me", { token });
}

// ─── Products ───────────────────────────────────────────
export async function getProducts(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  return request(`/shop/products${qs ? `?${qs}` : ""}`);
}

export async function getProduct(slugOrId) {
  return request(`/shop/products/${encodeURIComponent(slugOrId)}`);
}

export async function getSpotlight() {
  return request("/shop/spotlight");
}

// ─── Categories ─────────────────────────────────────────
export async function getCategories() {
  return request("/shop/categories");
}

export async function getCategoryProducts(name, params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  return request(`/shop/categories/${encodeURIComponent(name)}${qs ? `?${qs}` : ""}`);
}

// ─── Wishlist ───────────────────────────────────────────
export async function getWishlist(token) {
  return request("/shop/wishlist", { token });
}

export async function addToWishlist(productId, token) {
  return request(`/shop/wishlist/${productId}`, {
    method: "POST",
    token,
  });
}

export async function removeFromWishlist(productId, token) {
  return request(`/shop/wishlist/${productId}`, {
    method: "DELETE",
    token,
  });
}

// ─── Orders ─────────────────────────────────────────────
export async function createOrder(payload, token) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  });
}

export async function getOrders(token) {
  return request("/orders/my-orders", { token });
}

export async function getOrder(id, token) {
  return request(`/orders/${id}`, { token });
}

export async function cancelOrder(id, token) {
  return request(`/orders/${id}`, {
    method: "DELETE",
    token,
  });
}

// ─── Store Settings ─────────────────────────────────────
export async function getStoreSettings() {
  return request("/store/settings");
}

export async function updateStoreSettings(payload, token) {
  return request("/store/settings", {
    method: "PUT",
    body: JSON.stringify(payload),
    token,
  });
}

export async function addProductReview(productId, reviewData) {
  const token = typeof window !== "undefined" ? localStorage.getItem("mughal_token") : null;
  return request(`/shop/${productId}/reviews`, {
    method: "POST",
    body: JSON.stringify(reviewData),
    token,
  });
}

export { API_URL };