import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navigation from "@/components/Navigation";
import WelcomeModal from "@/components/WelcomeModal";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { CartProvider } from "@/components/cart/CartContext";
import {
  ORGANIZATION_SCHEMA,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  WEBSITE_SCHEMA,
} from "@/lib/site";

// Condensed, high-contrast display serif — the closest open match to the
// reference's italic uppercase headline face.
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const TITLE = "Novera — Research-Grade Peptides for Laboratory Analysis";

export const metadata: Metadata = {
  // Without metadataBase, Next cannot turn relative OG/canonical paths into the
  // absolute URLs that crawlers and social scrapers require.
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    // Child pages set only their own name; the brand suffix is appended here.
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <JsonLd schema={[ORGANIZATION_SCHEMA, WEBSITE_SCHEMA]} />
        {/* First focusable element on the page, so keyboard users can bypass the
            nav instead of tabbing through it on every route (WCAG 2.4.1). */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <CartProvider>
          <SmoothScroll>
            <ScrollProgress />
            <Navigation />
            <div id="main-content">{children}</div>
            <Footer />
            <WelcomeModal />
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
