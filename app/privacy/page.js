export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-12 md:pt-11 md:py-16 max-w-3xl">
      <h1 className="text-3xl font-bold text-content-main mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-content-sub text-sm leading-relaxed">
        <p>
          Mughal Store respects your privacy. We collect only the information necessary to
          process orders, manage your account and improve our services — such as name, email,
          shipping address and order history.
        </p>
        <p>
          Payment details are handled securely; we do not store full card numbers on our servers.
          We do not sell personal data to third parties. You may request access or deletion of
          your data by contacting support.
        </p>
        <p>By using our storefront you agree to this policy. Last updated: 2026.</p>
      </div>
    </div>
  );
}
