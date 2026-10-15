"use client";

import { ButtonSpinner } from "./LoadingSpinner";

const variants = {
  primary:
    "bg-brand-primary text-surface-base hover:bg-brand-light focus-visible:ring-brand-primary",
  secondary:
    "bg-surface-card text-content-main border border-surface-border hover:bg-surface-hover",
  outline:
    "border border-brand-primary text-brand-primary hover:bg-brand-soft",
  ghost: "text-content-sub hover:text-content-main hover:bg-surface-hover",
  danger: "bg-accent-danger text-white hover:opacity-90",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <ButtonSpinner />}
      {children}
    </button>
  );
}
