import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { PRODUCTS } from "@/lib/data";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

// Lab reports index — every batch in the range that carries a published
// Janoshik certificate, with the figures from that certificate and a link to
// Janoshik's own verification page so the report can be checked against the
// source rather than taken from us.
//
// Built entirely from PRODUCTS[].analysis. Products without an `analysis`
// block are simply absent: the page states how many certificates are
// published rather than making any claim about the lines that have none.

const TITLE = "Lab reports";
const DESCRIPTION =
  "Published Janoshik Analytical certificates for the Novera range — batch number, measured purity and compound breakdown for every assayed batch, each linked to Janoshik's own verification page.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/reports" },
  openGraph: {
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    type: "website",
    url: "/reports",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

// Narrowed so `analysis` is non-optional for the rest of the file.
const REPORTS = PRODUCTS.filter(
  (p): p is typeof p & { analysis: NonNullable<typeof p.analysis> } =>
    Boolean(p.analysis)
);

export default function ReportsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/reports"),
    hasPart: REPORTS.map((p) => ({
      "@type": "Product",
      name: p.name,
      url: absoluteUrl(`/products/${p.slug}`),
      ...(p.analysis.purity
        ? {
            additionalProperty: {
              "@type": "PropertyValue",
              name: "Assayed purity",
              value: p.analysis.purity,
            },
          }
        : {}),
    })),
  };

  return (
    <main className="overflow-x-clip pb-24 pt-28 lg:pt-32">
      <JsonLd schema={schema} />

      {/* ── Heading ──────────────────────────────────────────────────── */}
      <section className="container-lux">
        <div className="max-w-[900px]">
          <Reveal>
            <p className="eyebrow">Lab reports</p>
            <h1 className="mt-5 text-balance text-hero text-dark">
              Every batch, on the record.
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-7 max-w-[62ch] text-pretty text-[1rem] leading-relaxed text-muted">
              {REPORTS.length} published Janoshik Analytical certificates. Each
              one is reproduced below with the batch number it was issued
              against, and links out to Janoshik&apos;s own verification page so
              you can check it against the lab rather than against us.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── One block per certificate ────────────────────────────────── */}
      <section className="container-lux section-pad">
        <div className="flex flex-col">
          {REPORTS.map((p, i) => {
            const a = p.analysis;
            return (
              <Reveal key={p.slug} delay={i * 0.04}>
                <article className="grid gap-10 border-t border-dark/15 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-16">
                  {/* Figures */}
                  <div className="min-w-0">
                    <h2 className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05] tracking-[-0.02em] text-dark">
                      <Link
                        href={`/products/${p.slug}`}
                        className="transition-colors duration-300 hover:text-copper"
                      >
                        {p.name}
                      </Link>
                    </h2>

                    <dl className="mt-7 flex flex-wrap gap-x-12 gap-y-6">
                      <div>
                        <dt className="text-[0.6875rem] uppercase tracking-[0.18em] text-muted">
                          Batch
                        </dt>
                        <dd className="mt-1.5 font-serif text-[1.25rem] text-dark">
                          {a.batchNumber}
                        </dd>
                      </div>
                      {a.purity && (
                        <div>
                          <dt className="text-[0.6875rem] uppercase tracking-[0.18em] text-muted">
                            Assayed purity
                          </dt>
                          <dd className="mt-1.5 font-serif text-[1.25rem] text-dark">
                            {a.purity}
                          </dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-[0.6875rem] uppercase tracking-[0.18em] text-muted">
                          Fill volume
                        </dt>
                        <dd className="mt-1.5 font-serif text-[1.25rem] text-dark">
                          {a.fillVolume}
                        </dd>
                      </div>
                    </dl>

                    {/* Measured contents, straight off the certificate. */}
                    <table className="mt-9 w-full border-collapse text-left">
                      <caption className="sr-only">
                        Measured contents for batch {a.batchNumber}
                      </caption>
                      <thead>
                        <tr className="border-b border-dark/15">
                          <th
                            scope="col"
                            className="pb-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted"
                          >
                            Compound
                          </th>
                          <th
                            scope="col"
                            className="pb-2.5 text-right text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted"
                          >
                            Concentration
                          </th>
                          <th
                            scope="col"
                            className="pb-2.5 text-right text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted"
                          >
                            Content
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {a.compounds.map((c) => (
                          <tr key={c.name} className="border-b border-dark/10">
                            <th
                              scope="row"
                              className="py-3 text-[0.9375rem] font-normal text-dark"
                            >
                              {c.name}
                            </th>
                            <td className="py-3 text-right text-[0.9375rem] tabular-nums text-muted">
                              {c.concentration}
                            </td>
                            <td className="py-3 text-right text-[0.9375rem] tabular-nums text-muted">
                              {c.content}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
                      <a
                        href={a.reportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-lux"
                      >
                        Verify at Janoshik
                      </a>
                      <Link
                        href={`/products/${p.slug}`}
                        className="link-underline text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-dark"
                      >
                        View product →
                      </Link>
                    </div>
                  </div>

                  {/* The certificate itself. Portrait scans, so the frame is
                      tall and the scan sits on cream like the product art. */}
                  <div className="min-w-0">
                    <a
                      href={a.coaImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open the full certificate of analysis for batch ${a.batchNumber}`}
                      className="group relative block aspect-[3/4] overflow-hidden bg-background-secondary"
                    >
                      <Image
                        src={a.coaImage}
                        alt={`Janoshik Analytical certificate of analysis for ${p.name}, batch ${a.batchNumber}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 46vw"
                        className="object-contain object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.02]"
                      />
                    </a>

                    {a.evidenceImages.length > 0 && (
                      <ul className="mt-4 grid grid-cols-3 gap-3">
                        {a.evidenceImages.map((src, n) => (
                          <li key={src}>
                            <a
                              href={src}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open sample photograph ${n + 1} from Janoshik testing of batch ${a.batchNumber}`}
                              className="group relative block aspect-square overflow-hidden bg-background-secondary"
                            >
                              <Image
                                src={src}
                                alt=""
                                fill
                                sizes="(max-width: 1024px) 30vw, 15vw"
                                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.04]"
                              />
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-3 text-[0.6875rem] text-muted">
                      Sample photographs taken by Janoshik during testing.
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-10 border-t border-dark/15 pt-7 text-[0.8125rem] leading-relaxed text-muted">
          Figures above are reproduced from the Janoshik Analytical report for
          each batch. For research use only — not for human or veterinary use.
        </p>
      </section>
    </main>
  );
}
