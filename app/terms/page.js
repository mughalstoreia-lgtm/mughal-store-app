export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:pt-11 md:py-16 max-w-3xl">
      <h1 className="text-3xl font-bold text-content-main mb-6">Terms & Conditions</h1>
      <div className="space-y-4 text-content-sub text-sm leading-relaxed">
        <p>
          By placing an order on Mughal Store you agree that product prices and stock are
          validated server-side at checkout. Displayed totals on the cart are estimates.
        </p>
        <p>
          Orders may be cancelled if items become unavailable. Shipping times vary by location.
          Returns and exchanges are subject to our support policy within a reasonable period
          of delivery for unused items in original condition.
        </p>
        <p>All content and branding remain the property of Mughal Store. Last updated: 2026.</p>
      </div>
    </div>
  );
}
