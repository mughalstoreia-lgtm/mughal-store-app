import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { GoogleOAuthProvider } from "@react-oauth/google";

// export const metadata = {
//   title: {
//     default: "Mughal Store | Luxury Heritage E-Commerce",
//     template: "%s | Mughal Store",
//   },
//   description:
//     "Discover premium royal jewelry, fragrances, attars and handcrafted accessories inspired by Mughal heritage. Luxury lifestyle products with timeless elegance.",
//   openGraph: {
//     type: "website",
//     locale: "en_PK",
//     siteName: "Mughal Store",
//     title: "Mughal Store | Luxury Heritage E-Commerce",
//     description:
//       "Premium jewelry, fragrances & handcrafted accessories inspired by Mughal royalty.",
//   },
//   twitter: {
  //     card: "summary_large_image",
  //     title: "Mughal Store",
  //     description: "Luxury Mughal heritage e-commerce.",
  //   },
  // };
  
  export const metadata = {
    title: "Mughal Store | Premium Jewelry & Accessories",
    description:
    "Shop premium jewelry, attars and accessories at Mughal Store.",
    
    keywords: [
      "Mughal Store",
      "jewelry Pakistan",
      "premium jewelry",
      "attars",
      "accessories",
    ],
    
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  openGraph: {
    title: "Mughal Store | Premium Jewelry & Accessories",
    description:
      "Shop premium jewelry, attars and accessories at Mughal Store.",
    url: "https://mughalstore.vercel.app",
    siteName: "Mughal Store",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-surface-base text-content-main font-sans">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <Providers>
          <Header />
          <main className="flex-1 pb-1 lg:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
        </Providers>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
