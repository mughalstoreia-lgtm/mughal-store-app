"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { createOrder } from "@/lib/api";
import { formatPrice, estimateShipping } from "@/lib/utils";
import Button from "@/components/Button";

// Pakistan Provinces & Cities Data
const PROVINCE_CITIES = {
  Sindh: ["Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah", "Mirpur Khas"],
  Punjab: ["Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot"],
  "Khyber Pakhtunkhwa": ["Peshawar", "Mardan", "Abbottabad", "Swat", "Kohat"],
  Balochistan: ["Quetta", "Gwadar", "Turbat", "Sibi", "Khuzdar"],
  "Islamabad Capital Territory": ["Islamabad"],
  "Gilgit-Baltistan": ["Gilgit", "Skardu"],
  "Azad Jammu & Kashmir": ["Muzaffarabad", "Mirpur", "Rawalakot"],
};

export default function CheckoutPage() {
  const { isAuthenticated, token, user, loading: authLoading } = useAuth();
  const { items, subtotal, clearCart, hydrated } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    whatsapp: "",
    buildingInfo: "",
    addressLine1: "",
    state: "Sindh",
    city: "Karachi",
    customCity: "",
    postalCode: "",
    country: "Pakistan",
    paymentMethod: "cash on delivery",
  });

  const [isCustomCity, setIsCustomCity] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Dynamic city resolution
  const finalCity = isCustomCity ? form.customCity : form.city;

  // Shipping calculation
  const shipping = estimateShipping(subtotal, finalCity);
  const total = subtotal + shipping;

  // 1. Auth check effect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/auth/login?redirect=/checkout");
    }
  }, [authLoading, isAuthenticated, router]);

  // 2. Prefill user data effect
  useEffect(() => {
    if (user?.name) setForm((f) => ({ ...f, fullName: user.name }));
    if (user?.phone) setForm((f) => ({ ...f, phone: user.phone }));
  }, [user]);

  // 3. Cart check effect
  useEffect(() => {
    if (hydrated && isAuthenticated && items.length === 0 && !orderPlaced) {
      router.replace("/cart");
    }
  }, [hydrated, isAuthenticated, items.length, router, orderPlaced]);

  // Full-Page Skeleton Loader
  if (authLoading || !hydrated) {
    return (
      <div className="container mx-auto px-3 sm:px-5 xl:px-10 py-6 md:py-11.5 animate-pulse min-h-screen">
        <div className="h-8 w-40 rounded-lg bg-[var(--color-surface-hover)] mb-6" />
        <div className="grid gap-6 lg:gap-10 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-[var(--color-surface-hover)] bg-[var(--color-surface-card)] p-5 sm:p-6 space-y-4">
              <div className="h-6 w-48 rounded bg-[var(--color-surface-hover)] mb-4" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-11 rounded-lg bg-[var(--color-surface-hover)]" />
                <div className="h-11 rounded-lg bg-[var(--color-surface-hover)]" />
                <div className="sm:col-span-2 h-11 rounded-lg bg-[var(--color-surface-hover)]" />
                <div className="sm:col-span-2 h-11 rounded-lg bg-[var(--color-surface-hover)]" />
                <div className="sm:col-span-2 h-11 rounded-lg bg-[var(--color-surface-hover)]" />
                <div className="h-11 rounded-lg bg-[var(--color-surface-hover)]" />
                <div className="h-11 rounded-lg bg-[var(--color-surface-hover)]" />
              </div>
            </div>
            <div className="rounded-xl border border-[var(--color-surface-hover)] bg-[var(--color-surface-card)] p-5 sm:p-6">
              <div className="h-6 w-36 rounded bg-[var(--color-surface-hover)] mb-4" />
              <div className="h-14 rounded-lg bg-[var(--color-surface-hover)]" />
            </div>
          </div>
          <div className="rounded-xl border border-[var(--color-surface-hover)] bg-[var(--color-surface-card)] p-5 sm:p-6 space-y-4">
            <div className="h-6 w-32 rounded bg-[var(--color-surface-hover)]" />
            <div className="space-y-3">
              <div className="h-5 rounded bg-[var(--color-surface-hover)]" />
              <div className="h-5 rounded bg-[var(--color-surface-hover)]" />
            </div>
            <div className="pt-4 border-t border-[var(--color-surface-hover)] space-y-3">
              <div className="h-5 rounded bg-[var(--color-surface-hover)]" />
              <div className="h-5 rounded bg-[var(--color-surface-hover)]" />
            </div>
            <div className="h-11 rounded-xl bg-[var(--color-surface-hover)] mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Form Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const defaultCity = PROVINCE_CITIES[newState]?.[0] || "Other";

    setForm((f) => ({
      ...f,
      state: newState,
      city: defaultCity,
      customCity: "",
    }));
    setIsCustomCity(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const required = [
      "fullName",
      "phone",
      "whatsapp",
      "buildingInfo",
      "addressLine1",
      "state",
      "postalCode",
    ];
    for (const key of required) {
      if (!form[key]?.trim()) {
        setError("Please fill in all required address fields");
        return;
      }
    }

    if (!finalCity?.trim()) {
      setError("Please specify your city");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => {
          const productId = i.productId || i._id || i.id || i.product;

          return {
            product: productId,
            name: i.name,
            price:
              i.discountPrice != null &&
              Number(i.discountPrice) > 0 &&
              Number(i.discountPrice) < Number(i.price)
                ? Number(i.discountPrice)
                : Number(i.price),
            quantity: Number(i.quantity) || 1,
            image: i.image || i.images?.[0] || "",
          };
        }),
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          addressLine1: `${form.buildingInfo}, ${form.addressLine1}`,
          addressLine2: form.whatsapp ? `WhatsApp: ${form.whatsapp}` : "",
          city: finalCity || form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: "Pakistan",
        },
        paymentMethod: "cash on delivery",
        subtotal: Number(subtotal),
        shipping: Number(shipping),
        discount: 0,
      };

      const res = await createOrder(payload, token);
      setOrderPlaced(true);
      clearCart();
      router.push(`/account/orders`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-5 xl:px-10 py-6 md:py-11.5 overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-content-main,#0B0B0B)] mb-5 sm:mb-6.5">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="grid gap-6 lg:gap-10 lg:grid-cols-3 items-start">
        
        {/* Left Column: Form Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Address Box */}
          <div className="rounded-xl border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-card,#FFFFFF)] p-4 sm:p-6 shadow-xs">
            <h2 className="text-base sm:text-lg font-semibold text-[var(--color-content-main,#0B0B0B)] mb-3.5">
              Shipping Address
            </h2>

            {error && (
              <div className="mb-4 rounded-lg bg-[var(--color-accent-danger-soft,rgba(217,74,74,0.14))] px-4 py-3 text-xs sm:text-sm text-[var(--color-accent-danger,#D94A4A)]">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-[var(--color-content-sub,#5F5F5F)] mb-1.5">
                  Full Name <span className="text-[var(--color-accent-danger,#D94A4A)]">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  className="w-full rounded-lg border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-base,#F5F3EE)] px-3.5 py-2.5 text-xs sm:text-sm text-[var(--color-content-main,#0B0B0B)] placeholder:text-[var(--color-content-muted,#A6A6A6)] focus:border-[var(--color-brand-primary,#D4AF37)] focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-[var(--color-content-sub,#5F5F5F)] mb-1.5">
                  Phone <span className="text-[var(--color-accent-danger,#D94A4A)]">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  className="w-full rounded-lg border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-base,#F5F3EE)] px-3.5 py-2.5 text-xs sm:text-sm text-[var(--color-content-main,#0B0B0B)] placeholder:text-[var(--color-content-muted,#A6A6A6)] focus:border-[var(--color-brand-primary,#D4AF37)] focus:outline-none"
                />
              </div>

              {/* WhatsApp Number */}
              <div className="sm:col-span-2">
                <label htmlFor="whatsapp" className="block text-xs sm:text-sm font-medium text-[var(--color-content-sub,#5F5F5F)] mb-1.5">
                  WhatsApp Number <span className="text-[var(--color-accent-danger,#D94A4A)]">*</span>
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="Enter WhatsApp number"
                  required
                  className="w-full rounded-lg border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-base,#F5F3EE)] px-3.5 py-2.5 text-xs sm:text-sm text-[var(--color-content-main,#0B0B0B)] placeholder:text-[var(--color-content-muted,#A6A6A6)] focus:border-[var(--color-brand-primary,#D4AF37)] focus:outline-none"
                />
              </div>

              {/* Building / House No / Floor / Street */}
              <div className="sm:col-span-2">
                <label htmlFor="buildingInfo" className="block text-xs sm:text-sm font-medium text-[var(--color-content-sub,#5F5F5F)] mb-1.5">
                  Building / House No / Floor / Street <span className="text-[var(--color-accent-danger,#D94A4A)]">*</span>
                </label>
                <input
                  id="buildingInfo"
                  name="buildingInfo"
                  value={form.buildingInfo}
                  onChange={handleChange}
                  placeholder="Please enter"
                  required
                  className="w-full rounded-lg border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-base,#F5F3EE)] px-3.5 py-2.5 text-xs sm:text-sm text-[var(--color-content-main,#0B0B0B)] placeholder:text-[var(--color-content-muted,#A6A6A6)] focus:border-[var(--color-brand-primary,#D4AF37)] focus:outline-none"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label htmlFor="addressLine1" className="block text-xs sm:text-sm font-medium text-[var(--color-content-sub,#5F5F5F)] mb-1.5">
                  Address <span className="text-[var(--color-accent-danger,#D94A4A)]">*</span>
                </label>
                <input
                  id="addressLine1"
                  name="addressLine1"
                  value={form.addressLine1}
                  onChange={handleChange}
                  placeholder="For Example: House# 123, Street# 123, ABC Road"
                  required
                  className="w-full rounded-lg border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-base,#F5F3EE)] px-3.5 py-2.5 text-xs sm:text-sm text-[var(--color-content-main,#0B0B0B)] placeholder:text-[var(--color-content-muted,#A6A6A6)] focus:border-[var(--color-brand-primary,#D4AF37)] focus:outline-none"
                />
              </div>

              {/* Province */}
              <div>
                <label htmlFor="state" className="block text-xs sm:text-sm font-medium text-[var(--color-content-sub,#5F5F5F)] mb-1.5">
                  Province <span className="text-[var(--color-accent-danger,#D94A4A)]">*</span>
                </label>
                <select
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleStateChange}
                  required
                  className="w-full rounded-lg border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-base,#F5F3EE)] px-3.5 py-2.5 text-xs sm:text-sm text-[var(--color-content-main,#0B0B0B)] focus:border-[var(--color-brand-primary,#D4AF37)] focus:outline-none"
                >
                  {Object.keys(PROVINCE_CITIES).map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-xs sm:text-sm font-medium text-[var(--color-content-sub,#5F5F5F)] mb-1.5">
                  City <span className="text-[var(--color-accent-danger,#D94A4A)]">*</span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter your city name"
                  required
                  className="w-full rounded-lg border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-base,#F5F3EE)] px-3.5 py-2.5 text-xs sm:text-sm text-[var(--color-content-main,#0B0B0B)] placeholder:text-[var(--color-content-muted,#A6A6A6)] focus:border-[var(--color-brand-primary,#D4AF37)] focus:outline-none"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label htmlFor="postalCode" className="block text-xs sm:text-sm font-medium text-[var(--color-content-sub,#5F5F5F)] mb-1.5">
                  Postal Code <span className="text-[var(--color-accent-danger,#D94A4A)]">*</span>
                </label>
                <input
                  id="postalCode"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="Enter postal code"
                  required
                  className="w-full rounded-lg border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-base,#F5F3EE)] px-3.5 py-2.5 text-xs sm:text-sm text-[var(--color-content-main,#0B0B0B)] placeholder:text-[var(--color-content-muted,#A6A6A6)] focus:border-[var(--color-brand-primary,#D4AF37)] focus:outline-none"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[var(--color-content-sub,#5F5F5F)] mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  value="Pakistan"
                  readOnly
                  className="w-full rounded-lg border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-hover,#EBE7DD)] px-3.5 py-2.5 text-xs sm:text-sm text-[var(--color-content-main,#0B0B0B)] cursor-not-allowed opacity-90"
                />
              </div>
            </div>

            <p className="mt-3 text-[11px] sm:text-xs text-[var(--color-content-muted,#A6A6A6)] leading-relaxed">
              One delivery address per order. Dispatched from Orangi Town, Sector 8, Karachi. 
              Shipping within Pakistan only (Cash on Delivery).
            </p>
          </div>

          {/* Payment Method */}
          <div className="rounded-xl border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-card,#FFFFFF)] p-4 sm:p-6 shadow-xs">
            <h2 className="text-base sm:text-lg font-semibold text-[var(--color-content-main,#0B0B0B)] mb-3.5">
              Payment Method
            </h2>
            <div className="flex items-center gap-3 rounded-lg border border-[var(--color-brand-primary,#D4AF37)] bg-[var(--color-brand-soft,rgba(212,175,55,0.14))] px-4 py-3">
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[var(--color-brand-primary,#D4AF37)] text-[var(--color-surface-base,#F5F3EE)] text-xs sm:text-sm font-bold">
                Rs
              </span>
              <div>
                <p className="text-xs sm:text-sm font-medium text-[var(--color-content-main,#0B0B0B)]">Cash on Delivery</p>
                <p className="text-[11px] sm:text-xs text-[var(--color-content-muted,#A6A6A6)]">Pay when your order arrives</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="h-fit rounded-xl border border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-card,#FFFFFF)] p-4 sm:p-6 shadow-xs">
          <h2 className="text-base sm:text-lg font-semibold text-[var(--color-content-main,#0B0B0B)] mb-4">
            Order Summary
          </h2>
          
          <ul className="space-y-2 mb-4 text-xs sm:text-sm max-h-48 overflow-y-auto pr-1">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between text-[var(--color-content-sub,#5F5F5F)]">
                <span className="truncate max-w-[65%]">
                  {i.name} × {i.quantity}
                </span>
                <span>
                  {formatPrice(
                    ((i.discountPrice != null &&
                    Number(i.discountPrice) > 0 &&
                    Number(i.discountPrice) < Number(i.price)
                      ? i.discountPrice
                      : i.price) *
                      i.quantity)
                  )}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t border-[var(--color-surface-hover,#EBE7DD)] pt-3 text-xs sm:text-sm">
            <div className="flex justify-between text-[var(--color-content-sub,#5F5F5F)]">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[var(--color-content-sub,#5F5F5F)]">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-semibold text-[var(--color-content-main,#0B0B0B)] text-sm sm:text-base pt-2 border-t border-[var(--color-surface-hover,#EBE7DD)]">
              <span>Estimated Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <p className="mt-2 text-[11px] sm:text-xs text-[var(--color-content-muted,#A6A6A6)]">
            Final totals calculated securely by the server.
          </p>

          <Button type="submit" loading={submitting} className="w-full mt-5 h-11 text-xs sm:text-sm font-bold">
            Place Order
          </Button>
        </div>

      </form>
    </div>
  );
}