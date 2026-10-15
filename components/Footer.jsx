"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaYoutube, FaInstagram, FaTiktok, FaFacebookF } from "react-icons/fa";

const footerLinks = {
  Company: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/shop/categories", label: "Shop by Category" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
};

const socialLinks = [
  { href: "https://youtube.com/@mughalsstore-111?si=a4pU2bv6LI2cuzVe", label: "YouTube", icon: FaYoutube },
  { href: "https://www.instagram.com/mughals_store111?stkn=aXhob2U5ejg0cmx2", label: "Instagram", icon: FaInstagram },
  { href: "https://www.tiktok.com/@mughalstore111?_r=1&_t=ZS-9AKApziefS9", label: "TikTok", icon: FaTiktok },
  { href: "https://www.facebook.com/share/1EbSwP2Zdv/", label: "Facebook", icon: FaFacebookF },
];

export default function Footer() {
  const pathname = usePathname();

  // Auth pages: no footer
  if (pathname?.startsWith("/auth")) return null;

  return (
    /* BEFORE: className="mt-auto border-t border-surface-border bg-surface-card hidden lg:block" */
    /* AFTER: Removed `hidden lg:block` so it works on all screens */
    <footer className="mt-auto border-t border-[var(--color-surface-hover,#EBE7DD)] bg-[var(--color-surface-card,#FFFFFF)] text-[var(--color-content-main,#0B0B0B)] pb-10 lg:pb-0">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight text-[var(--color-content-main,#0B0B0B)]">
              MUGHAL <span className="text-[var(--color-brand-primary,#D4AF37)]">STORE</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-content-sub,#5F5F5F)] max-w-xs">
              Luxury Mughal heritage e-commerce. Premium jewelry, fragrances, attars and
              handcrafted accessories inspired by royal tradition.
            </p>

            {/* Social Media Links via .map() */}
            <div className="mt-4 flex items-center space-x-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-surface-hover,#EBE7DD)] text-[var(--color-content-sub,#5F5F5F)] transition hover:border-[var(--color-brand-primary,#D4AF37)] hover:text-[var(--color-brand-primary,#D4AF37)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-content-main,#0B0B0B)] mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-content-sub,#5F5F5F)] transition hover:text-[var(--color-brand-primary,#D4AF37)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-surface-hover,#EBE7DD)] pt-8 sm:flex-row text-center sm:text-left">
          <p className="text-xs text-[var(--color-content-muted,#A6A6A6)]">
            © {new Date().getFullYear()} Mughal Store. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-content-muted,#A6A6A6)]">
            Dispatched from Orangi Town, Sector 8, Karachi
          </p>
        </div>
      </div>
    </footer>
  );
}