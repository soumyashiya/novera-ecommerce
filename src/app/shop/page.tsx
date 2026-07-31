import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { PRODUCTS, PRODUCT_CATEGORIES, formatPrice } from "@/lib/data";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

const TITLE = "Shop";
const DESCRIPTION =
  "Browse the full Novera range of research-grade peptides — independently tested by Janoshik, sealed for stability, and supplied strictly for laboratory research.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/shop" },
  openGraph: {
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    type: "website",
    url: "/shop",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

export default function ShopPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    url: absoluteUrl("/shop"),
    hasPart: PRODUCTS.map((p) => ({
      "@type": "Product",
      name: p.name,
      url: absoluteUrl(`/products/${p.slug}`),
      image: absoluteUrl(p.image),
      offers: {
        "@type": "Offer",
        price: p.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    })),
  };

  return (
    <main className="pt-28 lg:pt-32 pb-24">
      <JsonLd schema={schema} />

      {/* Header */}
      <section className="container-lux">
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <p className="eyebrow mb-6">Shop</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="text-section">
                The full range,
                <br />
                one place.
              </h1>
            </Reveal>
          </div>
          <div className="lg:col-span-4">
            <Reveal delay={0.1}>
              <p className="lede">
                Every formulation independently verified by Janoshik
                Analytical, sealed for stability, and shipped cold-chain. For
                laboratory research use only.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container-lux mt-14 lg:mt-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.06} y={30}>
              <article className="group h-full rounded-[24px] border border-line bg-card transition-shadow duration-500 hover:shadow-[0_20px_50px_-25px_rgba(26,26,26,0.25)] overflow-hidden">
                <Link
                  href={`/products/${p.slug}`}
                  className="relative block aspect-[3/2] bg-background-secondary p-5"
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain img-grade transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.04]"
                  />
                  {p.analysis && (
                    <span className="absolute top-4 left-4 rounded-full bg-background/90 backdrop-blur px-3 py-1.5 text-[0.62rem] tracking-[0.16em] uppercase text-olive font-medium border border-line">
                      Lab-Verified
                    </span>
                  )}
                </Link>

                <div className="p-5">
                  <p className="text-[0.62rem] tracking-[0.2em] uppercase text-accent">
                    {PRODUCT_CATEGORIES[p.slug]}
                  </p>
                  <Link
                    href={`/products/${p.slug}`}
                    className="mt-1.5 block text-subhead text-xl leading-tight hover:text-olive transition-colors duration-500"
                  >
                    {p.name}
                  </Link>

                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                    <span className="font-serif text-2xl text-olive">
                      {formatPrice(p.price)}
                    </span>
                    <Link
                      href={`/products/${p.slug}`}
                      className="btn-lux !py-2.5 !px-5 !text-[0.68rem] shrink-0"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Research-only notice */}
      <section className="container-lux mt-24 lg:mt-32">
        <div className="rounded-2xl border border-olive/40 bg-olive/5 p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <Image
            src="/images/whyus-purity-seo1.webp"
            alt=""
            aria-hidden="true"
            width={56}
            height={56}
            className="rounded-full object-cover h-14 w-14 shrink-0"
          />
          <p className="text-sm leading-relaxed text-dark">
            <span className="font-semibold text-olive uppercase tracking-wide text-xs">
              Research use only.{" "}
            </span>
            Every product on this page is supplied strictly for laboratory
            and analytical research conducted by qualified professionals —
            not for human or veterinary use. Certificates of analysis are
            available on each product page.
          </p>
        </div>
      </section>
    </main>
  );
}
