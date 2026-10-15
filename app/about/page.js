export const metadata = {
  title: "About Us | Mughal Store",
  description: "Mughal Store. Where Style Meets Elegance. Discover our brand vision, quality commitment, and heritage-inspired fashion.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:pt-10 md:py-[61px] max-w-4xl">
      {/* Header Section */}
      <div className="mb-9 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-light">
          Where Style Meets Elegance
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-content-main md:text-5xl">
          About Mughal Store
        </h1>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-brand-primary"></div>
      </div>

      {/* Main Content Card */}
      <div className="space-y-8 rounded-3xl border border-surface-border bg-surface-card p-6 shadow-sm md:p-10">
        
        {/* Intro Paragraph */}
        <div className="space-y-4 text-content-sub leading-relaxed text-base md:text-lg">
          <p>
            <strong className="font-semibold text-content-main">Mughal Store</strong> is a fashion brand built on quality, style, confidence, and trust. Mughal Store believes true style is not about what you wear—it is about how you present yourself.
          </p>
          <p>
            We curate and deliver refined collections that blend royal heritage tradition with modern elegance, ensuring you always stand out with absolute confidence.
          </p>
        </div>

        {/* Vision Section */}
        <div className="rounded-2xl border border-brand-primary/20 bg-brand-soft p-6 md:p-8">
          <h2 className="mb-3 text-xl font-bold text-content-main md:text-2xl">
            Our Vision
          </h2>
          <p className="text-content-sub leading-relaxed text-sm md:text-base">
            Our vision is to build Mughal Store as a recognizable fashion brand delivering a refined experience that reflects modern style and timeless elegance.
          </p>
        </div>

        {/* Why Trust Us Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-content-main md:text-2xl">
            Why Trust Mughal Store?
          </h2>
          <p className="text-content-sub leading-relaxed text-sm md:text-base">
            We believe in quality over compromise, style with purpose, and trust beyond transactions. Every customer matters to us. Our ultimate goal is to create a seamless brand experience that keeps you coming back.
          </p>
        </div>

        {/* Footer Tagline Quote */}
        <div className="border-t border-surface-border pt-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-light">
            Mughal Store. Your Style. Your Statement.
          </p>
        </div>

      </div>
    </div>
  );
}