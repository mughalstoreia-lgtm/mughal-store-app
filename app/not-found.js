import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-brand-primary mb-4">404</p>
      <h1 className="text-2xl font-semibold text-content-main mb-2">Page not found</h1>
      <p className="text-content-sub mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-medium text-surface-base hover:bg-brand-light"
      >
        Back to Home
      </Link>
    </div>
  );
}
