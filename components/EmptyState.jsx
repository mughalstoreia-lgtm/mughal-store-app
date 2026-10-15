import Link from "next/link";

export default function EmptyState({
  title = "Nothing here yet",
  description = "Check back later or explore our collection.",
  actionLabel,
  actionHref,
  icon,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="mb-6 text-content-muted opacity-60">{icon}</div>
      )}
      <h3 className="text-xl font-semibold text-content-main mb-2">{title}</h3>
      <p className="text-content-sub max-w-md mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-medium text-surface-base transition hover:bg-brand-light"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
