"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

const desktopNavLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Categories", href: "/shop/categories" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

function IconSearch({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function IconHeart({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function IconCart({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function IconUser({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function IconClose({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function IconGem({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 9l10 13L22 9 12 2zm0 2.5L18.5 9 12 17.5 5.5 9 12 4.5z" />
    </svg>
  );
}

function IconHouse({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function IconStore({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72M6.75 18h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .414.336.75.75.75z" />
    </svg>
  );
}

function Logo({ className = "text-xl" }) {
  return (
    <Link href="/" className={`${className} font-black tracking-widest flex items-center gap-2 truncate`}>
      <IconGem className="text-brand-primary w-5 h-5 shrink-0" />
      <span>
        MUGHAL<span className="text-brand-primary">STORE</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { count: wishCount } = useWishlist();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const submitSearch = (e) => {
    e?.preventDefault?.();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/shop?search=${encodeURIComponent(q)}`);
      setSearchOpen(false);
    } else {
      router.push("/shop");
      setSearchOpen(false);
    }
  };

  const mobileNavLinks = [
    { name: "Home", href: "/", icon: IconHouse },
    { name: "Shop", href: "/shop", icon: IconStore },
    { name: "Categories", href: "/shop/categories", icon: IconGem },
    { name: "About", href: "/about", icon: IconUser },
    { name: "Contact", href: "/contact", icon: IconUser },
    { name: "Wishlist", href: "/wishlist", icon: IconHeart, count: wishCount },
    { name: "Cart", href: "/cart", icon: IconCart, count: itemCount },
    isAuthenticated
      ? { name: "My Account", href: "/account", icon: IconUser }
      : { name: "Login / Register", href: "/auth/login", icon: IconUser },
  ];

  return (
    <>
      {/* ── MOBILE TOP BAR ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface-card/90 backdrop-blur-md border-b border-surface-border shadow-md">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="w-10 h-10 bg-surface-base border border-surface-border rounded-xl flex flex-col justify-center items-center gap-[4px] active:scale-95 transition-transform shrink-0"
            aria-label="Open navigation"
          >
            <span className="w-4 h-[2px] bg-content-main rounded-full" />
            <span className="w-4 h-[2px] bg-content-main rounded-full" />
            <span className="w-4 h-[2px] bg-content-main rounded-full" />
          </button>

          <Logo className="text-lg" />

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className={`p-2 rounded-xl transition-all ${
                searchOpen
                  ? "text-brand-primary bg-brand-soft"
                  : "text-content-sub hover:text-brand-primary"
              }`}
              aria-label="Toggle search"
            >
              {searchOpen ? <IconClose className="w-4 h-4" /> : <IconSearch className="w-4 h-4" />}
            </button>

            <Link href="/cart" className="relative p-2 rounded-xl text-content-sub" aria-label="Cart">
              <IconCart className="w-4 h-4 text-brand-primary" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-accent-danger text-white font-black text-[9px] flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search dropdown */}
        <div
          className={`transition-all duration-300 ease-in-out border-t border-surface-border bg-surface-hover/80 ${
            searchOpen ? "max-h-24 opacity-100 py-2.5 px-4" : "max-h-0 opacity-0 py-0 px-4 overflow-hidden"
          }`}
        >
          <form onSubmit={submitSearch} className="relative w-full flex items-center">
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-card border border-surface-border rounded-xl pl-9 pr-16 py-2 text-xs text-content-main focus:outline-none focus:border-brand-primary placeholder:text-content-muted shadow-inner"
            />
            <span className="absolute left-3 text-content-muted pointer-events-none">
              <IconSearch className="w-3.5 h-3.5" />
            </span>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="absolute right-2 px-2 py-0.5 rounded-md bg-surface-base border border-surface-border text-[10px] font-bold text-content-sub hover:text-brand-primary transition-all active:scale-95"
            >
              CLOSE
            </button>
          </form>
        </div>
      </div>

      {/* Spacer for fixed mobile header */}
      <div className="lg:hidden h-[57px]" aria-hidden />

      {/* ── DESKTOP HEADER ── */}
      <div className="hidden lg:block sticky top-0 z-40 px-6 xl:px-8 py-3">
        <header className="mx-auto max-w-[1400px] rounded-3xl backdrop-blur-2xl transition-all duration-300 shadow-md bg-surface-card/85 border border-surface-border text-content-main relative overflow-hidden">
          <div className="px-6 xl:px-8 h-20 flex items-center justify-between gap-4">
            <Logo className="text-2xl" />

            <nav className="flex items-center gap-10 xl:gap-14 text-xs font-bold uppercase tracking-widest text-content-sub">
              {desktopNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hover:text-brand-primary transition-colors whitespace-nowrap ${
                    pathname === link.href ? "text-brand-primary" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                className={`p-2 rounded-xl transition-all ${
                  searchOpen
                    ? "text-brand-primary bg-brand-soft"
                    : "text-content-sub hover:text-brand-primary hover:bg-surface-hover"
                }`}
                aria-label="Toggle search"
              >
                {searchOpen ? <IconClose className="w-4 h-4" /> : <IconSearch className="w-4 h-4" />}
              </button>

              <Link
                href="/wishlist"
                className="relative p-2 rounded-xl text-content-sub hover:text-brand-primary hover:bg-surface-hover transition-all"
                aria-label="Wishlist"
              >
                <IconHeart className="w-4 h-4" />
                {wishCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent-danger text-white font-black text-[9px] flex items-center justify-center">
                    {wishCount > 99 ? "99+" : wishCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative p-2 rounded-xl text-content-sub hover:text-brand-primary hover:bg-surface-hover transition-all"
                aria-label="Cart"
              >
                <IconCart className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent-danger text-white font-black text-[9px] flex items-center justify-center">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <Link
                  href="/account"
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border border-surface-border text-content-main hover:border-brand-primary hover:text-brand-primary transition-all ml-2 whitespace-nowrap"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-soft text-brand-primary text-[10px]">
                    {(user?.name || "U").charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[90px] truncate">{user?.name || "Account"}</span>
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl bg-brand-primary text-surface-base hover:bg-brand-light transition-all shadow-lg ml-2 whitespace-nowrap"
                >
                  <IconUser className="w-3.5 h-3.5" />
                  <span>Sign in</span>
                </Link>
              )}
            </div>
          </div>

          {/* Desktop search dropdown */}
          <div
            className={`transition-all duration-300 ease-in-out border-t border-surface-border bg-surface-hover/50 ${
              searchOpen ? "max-h-24 opacity-100 py-3 px-8" : "max-h-0 opacity-0 py-0 px-8 overflow-hidden"
            }`}
          >
            <form onSubmit={submitSearch} className="relative max-w-2xl mx-auto flex items-center">
              <input
                type="search"
                placeholder="Search products, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-card border border-surface-border rounded-xl pl-11 pr-16 py-2.5 text-xs text-content-main focus:outline-none focus:border-brand-primary placeholder:text-content-muted shadow-inner"
              />
              <span className="absolute left-4 text-content-muted pointer-events-none">
                <IconSearch className="w-3.5 h-3.5" />
              </span>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-2.5 px-2 py-0.5 rounded-md bg-surface-base border border-surface-border text-[10px] font-bold text-content-sub hover:text-brand-primary hover:border-brand-primary transition-all active:scale-95"
                title="Close (Esc)"
              >
                ESC
              </button>
            </form>
          </div>
        </header>
      </div>

      {/* ── MOBILE SIDEBAR DRAWER ── */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          aria-hidden
        />

        <aside
          className={`relative w-[75%] max-w-[290px] min-h-full bg-surface-card text-content-main pt-8 pb-6 px-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 -right-14 w-10 h-10 bg-surface-card border border-surface-border rounded-xl flex items-center justify-center text-content-sub hover:text-content-main shadow-xl active:scale-90 transition-transform"
            aria-label="Close menu"
          >
            <IconClose className="w-5 h-5 text-brand-primary" />
          </button>

          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center pt-2 pb-2">
              <Logo className="text-xl" />
            </div>

            <nav className="flex flex-col">
              {mobileNavLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href + link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-3.5 border-b border-surface-border text-[15px] font-semibold text-content-main hover:text-brand-primary transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="text-brand-primary w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                      <span>{link.name}</span>
                    </div>
                    {link.count != null && link.count > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-accent-danger text-white">
                        {link.count}
                      </span>
                    )}
                  </Link>
                );
              })}
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-4 py-3.5 text-[15px] font-semibold text-accent-danger text-left"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>

          <div className="pt-4 border-t border-surface-border text-[11px] text-content-muted text-center">
            © MUGHAL STORE
          </div>
        </aside>
      </div>
    </>
  );
}
