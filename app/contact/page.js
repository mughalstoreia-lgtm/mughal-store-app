"use client";

import { useEffect, useState } from "react";
import ContactForm from "@/components/ContactForm";
import { Mail, Phone, Clock, MessageSquare } from "lucide-react";
import { getStoreSettings } from "@/lib/api";

export default function ContactPage() {
  const [store, setStore] = useState({
    storeName: "Mughal Store",
    storeEmail: "",
    primaryPhone: "",
    secondaryPhone: "",
    whatsappOne: "",
    whatsappTwo: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getStoreSettings();
        const storeData = response?.data || response; 
        if (storeData) {
          setStore(storeData);
        }
      } catch (err) {
        console.error("Failed to load store settings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const getWhatsAppLink = (number) => {
    if (!number) return "#";
    const cleaned = number.replace(/[^0-9]/g, "");
    return `https://wa.me/${cleaned}`;
  };

  // Jab tak data load ho raha hai, poore page ka skeleton show hoga
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:pt-9 md:py-14 animate-pulse">
        <div className="mx-auto max-w-5xl">
          {/* Header Skeleton */}
          <div className="mb-12 text-center">
            <div className="h-3 w-24 bg-surface-border/40 rounded mx-auto mb-2"></div>
            <div className="h-9 w-48 bg-surface-border/40 rounded mx-auto mb-3"></div>
            <div className="h-4 w-72 bg-surface-border/40 rounded mx-auto"></div>
          </div>

          <div className="grid gap-10 lg:grid-cols-5">
            {/* Left Details Panel Skeleton */}
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border border-surface-border bg-surface-card p-6 space-y-5">
                <div className="h-4 w-20 bg-surface-border/40 rounded mb-4"></div>
                <div className="h-12 bg-surface-border/40 rounded"></div>
                <div className="h-12 bg-surface-border/40 rounded"></div>
                <div className="h-12 bg-surface-border/40 rounded"></div>
                <div className="h-12 bg-surface-border/40 rounded"></div>
              </div>
            </div>

            {/* Right Form Skeleton */}
            <div className="rounded-2xl border border-surface-border bg-surface-card p-6 md:p-8 lg:col-span-3 space-y-5">
              <div className="h-6 w-36 bg-surface-border/40 rounded mb-6"></div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="h-12 bg-surface-border/40 rounded"></div>
                <div className="h-12 bg-surface-border/40 rounded"></div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="h-12 bg-surface-border/40 rounded"></div>
                <div className="h-12 bg-surface-border/40 rounded"></div>
              </div>
              <div className="h-32 bg-surface-border/40 rounded"></div>
              <div className="h-11 w-36 bg-surface-border/40 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:pt-9 md:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-light">
            Get in touch
          </p>
          <h1 className="text-3xl font-bold text-content-main md:text-4xl">
            Contact us
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-content-sub">
            Product questions, orders, or partnerships — we respond during business hours.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          {/* Store Contact Information Panel */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-surface-border bg-surface-card p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-light">
                Details
              </h2>

              <ul className="space-y-4 text-sm">
                {store.storeEmail && (
                  <li className="flex items-start gap-3">
                    <Mail size={18} className="mt-0.5 text-brand-light shrink-0" />
                    <div>
                      <p className="text-content-muted">Email</p>
                      <a
                        href={`mailto:${store.storeEmail}`}
                        className="font-medium text-content-main hover:text-brand-light transition-colors"
                      >
                        {store.storeEmail}
                      </a>
                    </div>
                  </li>
                )}

                {store.primaryPhone && (
                  <li className="flex items-start gap-3">
                    <Phone size={18} className="mt-0.5 text-brand-light shrink-0" />
                    <div>
                      <p className="text-content-muted">Primary Phone</p>
                      <a
                        href={`tel:${store.primaryPhone}`}
                        className="font-medium text-content-main hover:text-brand-light transition-colors"
                      >
                        {store.primaryPhone}
                      </a>
                    </div>
                  </li>
                )}

                {store.secondaryPhone && (
                  <li className="flex items-start gap-3">
                    <Phone size={18} className="mt-0.5 text-brand-light shrink-0" />
                    <div>
                      <p className="text-content-muted">Secondary Phone</p>
                      <a
                        href={`tel:${store.secondaryPhone}`}
                        className="font-medium text-content-main hover:text-brand-light transition-colors"
                      >
                        {store.secondaryPhone}
                      </a>
                    </div>
                  </li>
                )}

                {store.whatsappOne && (
  <li className="flex items-start gap-3">
    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shrink-0">
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
      </svg>
    </div>
    <div>
      {/* Agar dono numbers hain toh WhatsApp 1 / WhatsApp 2 show ho, warna sirf WhatsApp Support */}
      <p className="text-content-muted">
        {store.whatsappTwo ? "WhatsApp 1" : "WhatsApp Support"}
      </p>
      <a
        href={getWhatsAppLink(store.whatsappOne)}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
      >
        {store.whatsappOne}
      </a>
    </div>
  </li>
)}

{store.whatsappTwo && (
  <li className="flex items-start gap-3">
    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shrink-0">
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
      </svg>
    </div>
    <div>
      <p className="text-content-muted">WhatsApp 2</p>
      <a
        href={getWhatsAppLink(store.whatsappTwo)}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
      >
        {store.whatsappTwo}
      </a>
    </div>
  </li>
)}

                <li className="flex items-start gap-3 pt-2 border-t border-surface-border">
                  <Clock size={18} className="mt-0.5 text-brand-light shrink-0" />
                  <div>
                    <p className="text-content-muted">Hours</p>
                    <p className="font-medium text-content-main">Mon – Sat, 10:00 – 18:00 PKT</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-brand-primary/25 bg-brand-soft p-6">
              <p className="text-sm leading-relaxed text-content-sub">
                For order status, sign in and open{" "}
                <a href="/account/orders" className="text-brand-light underline-offset-2 hover:underline">
                  My Orders
                </a>
                . Include your order ID in messages when possible.
              </p>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="rounded-2xl border border-surface-border bg-surface-card p-6 md:p-8 lg:col-span-3">
            <h2 className="mb-6 text-lg font-semibold text-content-main">Send a message</h2>
            <ContactForm email={store.storeEmail}/>
          </div>
        </div>
      </div>
    </div>
  );
}