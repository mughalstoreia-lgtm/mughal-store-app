"use client";

import { useState } from "react";
import { updateOrder } from "@/lib/api"; // Updated import

export default function EditAddressModal({ orderId, currentAddress, token, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: currentAddress?.fullName || "",
    phone: currentAddress?.phone || "",
    addressLine1: currentAddress?.addressLine1 || "",
    city: currentAddress?.city || "",
    state: currentAddress?.state || "",
    postalCode: currentAddress?.postalCode || "",
    country: currentAddress?.country || "Pakistan",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Backend ko shippingAddress format mein data bhejien
      const res = await updateOrder(orderId, { shippingAddress: formData }, token);
      onSuccess(res.data || res.order || res);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-surface-card border border-surface-border p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <h3 className="text-lg font-bold text-content-main">Edit Shipping Address</h3>
          <button onClick={onClose} className="text-content-muted hover:text-content-main">✕</button>
        </div>

        {error && <div className="mt-4 text-xs text-red-500 bg-red-500/10 p-2.5 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-content-muted mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-surface-border bg-surface-bg p-2.5 text-sm text-content-main focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-content-muted mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-surface-border bg-surface-bg p-2.5 text-sm text-content-main focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-content-muted mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-surface-border bg-surface-bg p-2.5 text-sm text-content-main focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-content-muted mb-1">Address</label>
            <textarea
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              required
              rows={2}
              className="w-full rounded-lg border border-surface-border bg-surface-bg p-2.5 text-sm text-content-main focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-content-muted hover:text-content-main"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-brand-primary px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}