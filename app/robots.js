export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://mughalstore.vercel.app/sitemap.xml",
  };
}