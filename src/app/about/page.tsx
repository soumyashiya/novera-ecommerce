import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import RevealImage from "@/components/RevealImage";
import StatementBanner from "@/components/StatementBanner";
import JsonLd from "@/components/JsonLd";
import { PRODUCTS, TESTIMONIALS } from "@/lib/data";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

// "Our story" — the page the About block on the homepage links to.
//
// Section rhythm, alternating image and type so neither runs long:
//   1. hero        — centred display line over a full-bleed bench photograph
//   2. why we started — narrative split against the story portrait
//   3. the numbers — four figures, typography only
//   4. what we hold to — four principles on hairlines, no cards
//   5. the line    — one sentence alone on yellow
//   6. the batch   — the journey of one batch, numbered because it is ordered
//   7. reorder     — proof, on cream: reasons against a client's own words
//   8. closing     — full-bleed banner into the shop
//
// Every figure and claim restates the About copy, WHY_US and the Janoshik
// analysis already in src/lib/data.ts. Nothing here is a new promise, and
// there are deliberately no founding dates: none are recorded anywhere in
// this codebase, so the page tells the batch's history rather than inventing
// the company's.

const TITLE = "Our story";
const DESCRIPTION =
  "Why Novera exists: manufacturer contracts held at source, an independent Janoshik assay published in full for every batch, and refrigeration that holds from fill to courier.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
    type: "website",
    url: "/about",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} — ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

// Restated from About.tsx's STATS — the same four approved figures.
const NUMBERS = [
  { figure: "99", unit: "%+", label: "Verified purity on certified batches*" },
  { figure: "100", unit: "%", label: "Of batches third-party tested before listing" },
  { figure: "10,000", unit: "+", label: "Orders shipped to research clients" },
  { figure: "2–8", unit: "°C", label: "Sealed, refrigerated storage until dispatch" },
];

const PRINCIPLES = [
  {
    title: "Contracted at source",
    body: "We buy from the manufacturers who fill the pens, under tightly controlled, ISO-aligned production. Nothing reaches our shelves through an intermediary we cannot name.",
  },
  {
    title: "Assayed by someone else",
    body: "Purity and concentration are measured by Janoshik Analytical, not by us. Their report is published whole — batch number, method and figures — never compressed into a claim.",
  },
  {
    title: "Cold from fill to courier",
    body: "Pens stay at 2–8 °C in temperature-stable, tamper-evident packaging, and every label is checked against the assay before the box is sealed.",
  },
  {
    title: "Short on purpose",
    body: `${PRODUCTS.length} lines rather than a catalogue. We would sooner restock one compound properly than list forty we cannot keep verified.`,
  },
];

// Reasons a batch-to-batch supplier gets a second order. Each one restates a
// WHY_US / STORAGE_LOGIC claim already in src/lib/data.ts.
const REORDER = [
  {
    title: "The certificate matches the vial",
    body: "Every reorder carries its own batch number and its own Janoshik report. Nothing is inherited from the batch before it.",
  },
  {
    title: "The range does not drift",
    body: "Formulations are produced under ISO-aligned, tightly controlled processes, so concentration holds from the first batch to the thousandth.",
  },
  {
    title: "Someone answers",
    body: "Questions about stock, batches or paperwork reach a person who can tell you what is on the shelf today.",
  },
];

// The first testimonial is the one about ordering four times — the only entry
// that speaks to repeat supply, which is what this section is about. Read from
// data.ts rather than copied, so editing the quote there edits it here.
const REORDER_QUOTE = TESTIMONIALS[0];

// Ordered on purpose: the number is the information here, not decoration.
const JOURNEY = [
  {
    no: "01",
    step: "Contracted and logged",
    detail:
      "The batch arrives sealed from the manufacturer and is booked in against a batch number that follows it from here on.",
  },
  {
    no: "02",
    step: "Sent out for assay",
    detail:
      "Janoshik Analytical measure purity and concentration independently. We do not run the test and cannot adjust the result.",
  },
  {
    no: "03",
    step: "Report published",
    detail:
      "The certificate goes live on the product page, batch number and all, before a single pen from that batch is sold.",
  },
  {
    no: "04",
    step: "Sealed and sent cold",
    detail:
      "Held at 2–8 °C in tamper-evident packaging until the courier scans it off the shelf.",
  },
];

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/about"),
    about: { "@id": absoluteUrl("/#organization") },
  };

  return (
    <main className="pb-24 pt-28 lg:pt-32">
      <JsonLd schema={schema} />

      {/* ── 1. Hero ──────────────────────────────────────────────────── */}
      {/* Left-aligned on --gutter, like every other heading on the page. A
          centred hero started 270px in at 1440px and read as indented against
          the sections below it, which all begin on the gutter line. */}
      <section className="container-lux">
        <div className="max-w-[900px]">
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h1 className="mt-5 text-balance text-hero text-dark">
              Nothing ships unproven.
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            {/* .lede caps at 48ch, which would wrap this to a narrow ribbon,
                so the measure is set here instead. text-pretty keeps the last
                word off a line of its own. */}
            <p className="mt-7 max-w-[62ch] text-pretty text-[1rem] leading-relaxed text-muted">
              Novera supplies research peptides to laboratories. Every pen we
              list has been through an independent lab first, and the report it
              came back with sits on the product page before anyone can order
              it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-lux section-pad">
        {/* The banner is authored at 1600×535 (≈3:1), so the frame opens out
            to match it at lg and the whole composition survives uncropped.
            Narrower frames below that crop width, not height — the carton and
            pen sit centred, so they stay in shot while the vials behind lose
            their outer edges. No object-position: at these ratios the default
            centre is exactly right. */}
        <RevealImage
          src="/images/about-banner.png"
          alt="A sealed ALLUVI Glow GHK-Cu carton and pre-filled pen on a sunlit counter, empty vials racked behind"
          sizes="(max-width: 1472px) 100vw, 1472px"
          priority
          className="aspect-[4/3] w-full sm:aspect-[21/9] lg:aspect-[3/1]"
          hover={false}
        />
      </section>

      {/* ── 2. Why we started ────────────────────────────────────────── */}
      <section className="container-lux section-pad">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">Why we started</p>
            <h2 className="mt-5 font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.02] tracking-[-0.02em] text-dark">
              We built the supplier we kept looking for.
            </h2>
            <div className="mt-7 flex max-w-[60ch] flex-col gap-5 text-[0.9375rem] leading-relaxed text-dark">
              <p>
                Anyone who has ordered research compounds knows the pattern. A
                certificate that names no laboratory. A concentration that does
                not survive contact with a mass spectrometer. An inbox that goes
                quiet the moment you ask which batch you were actually sent.
                None of it is exotic — it is simply what happens when nobody
                independent ever checks.
              </p>
              <p>
                Novera exists to take that guesswork off the front of an
                experiment. We contract directly with the manufacturers who fill
                our pens, send every batch out for an independent assay before
                it is listed, keep the range refrigerated from fill to courier,
                and answer when you ask what is on the shelf. It is
                unremarkable work. It is also the whole job.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08} y={28}>
            {/* Authored at 1122×1402, which is exactly the 4:5 of this frame —
                nothing is cropped, so there is no object-position to tune. */}
            <RevealImage
              src="/images/we-started.png"
              alt="A woman at a sunlit counter with a sealed ALLUVI Retatrutide 40 mg carton and pre-filled pen"
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="aspect-[4/5] w-full bg-background-secondary"
            />
          </Reveal>
        </div>
      </section>

      {/* ── 3. The numbers ───────────────────────────────────────────── */}
      <section className="container-lux section-pad">
        <Reveal>
          <h2 className="text-section text-dark">The numbers don&apos;t lie.</h2>
        </Reveal>
        <dl className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {NUMBERS.map((n, i) => (
            <Reveal key={n.label} delay={i * 0.05}>
              <dt className="sr-only">{n.label}</dt>
              <dd>
                <p className="flex items-baseline gap-1.5 text-dark">
                  <span className="stat-figure">{n.figure}</span>
                  <span className="font-serif text-[1.25rem] leading-none">
                    {n.unit}
                  </span>
                </p>
                {/* Hairline ties the figure to its caption without a card. */}
                <span
                  aria-hidden
                  className="mt-5 block h-px w-full bg-dark/15"
                />
                <p className="mt-4 max-w-[22ch] text-[0.8125rem] leading-snug text-muted">
                  {n.label}
                </p>
              </dd>
            </Reveal>
          ))}
        </dl>
        <p className="mt-10 text-[0.6875rem] text-muted">
          *As reported by Janoshik Analytical for each certified batch.
        </p>
      </section>

      {/* ── 4. What we hold to ───────────────────────────────────────── */}
      <section className="container-lux section-pad">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">What we hold to</p>
            <h2 className="mt-5 font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.02] tracking-[-0.02em] text-dark">
              The Novera standard.
            </h2>
          </Reveal>

          {/* Hairline-separated pairs rather than four matching cards — the
              list is the structure, so it does not need boxes drawn round it. */}
          <dl className="grid gap-x-12 sm:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <div className="border-t border-dark/15 py-7">
                  <dt className="text-subhead text-dark">{p.title}</dt>
                  <dd className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                    {p.body}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 5. The line ──────────────────────────────────────────────── */}
      {/* One sentence, given the whole band. Yellow is a fill only — the type
          stays ink, per the contrast note in globals.css. */}
      {/* section-pad, not -lg: every section on this page holds the same step,
          so the yellow band is not spaced on its own rhythm. */}
      <section className="section-band section-pad section-yellow">
        <div className="container-lux">
          <Reveal>
            <p className="mx-auto max-w-[20ch] text-center text-hero !text-[clamp(1.875rem,4.2vw,3.5rem)] text-dark">
              Your results should change. Your compound shouldn&rsquo;t.
            </p>
            <p className="mx-auto mt-8 max-w-[56ch] text-balance text-center text-[1rem] leading-relaxed text-dark/80">
              Every batch is assayed before it ships, and its certificate is
              published on the product page under the same batch number — so
              when a result moves, you can rule out what was in the vial.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 6. One batch, end to end ─────────────────────────────────── */}
      {/* section-band so it keeps its own top and bottom inset: sitting
          between the yellow band and the cream one, the plain-block collapse
          rules would otherwise strip both and press it against its neighbours. */}
      <section className="section-band section-pad bg-background">
        <div className="container-lux">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <Reveal>
              <p className="eyebrow">How a batch reaches you</p>
              {/* Wide enough to keep "end to end" whole — at 16ch it broke
                  after "end to" and left "end." orphaned on its own line. */}
              <h2 className="mt-5 max-w-[24ch] font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.02] tracking-[-0.02em] text-dark">
                A verified batch, end to end.
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="max-w-[42ch] text-[1rem] leading-relaxed text-muted lg:text-right">
                Four stops between the manufacturer and your bench, each one
                tied to the same batch number.
              </p>
            </Reveal>
          </div>

          <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5">
            {JOURNEY.map((j, i) => (
              <Reveal key={j.no} delay={i * 0.06} as="li" className="h-full">
                <div className="flex h-full flex-col border border-dark/10 bg-card p-7 lg:p-8">
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent font-serif text-[1.125rem] leading-none text-dark">
                      {j.no}
                    </span>
                    {/* The rail carries the sequence on to the next card. */}
                    <span aria-hidden className="h-px flex-1 bg-dark/15" />
                  </div>
                  <p className="mt-8 text-subhead text-dark">{j.step}</p>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                    {j.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 7. Why researchers reorder ───────────────────────────────── */}
      {/* Cream ground so the proof block reads as its own chapter between the
          bone sections and the closing banner. The quote leads — it is the
          only first-person voice on the page, so it does not need a box. */}
      <section className="section-band section-pad bg-background-secondary">
        <div className="container-lux">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow">Repeat supply</p>
              <h2 className="mt-5 font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.02] tracking-[-0.02em] text-dark">
                Why researchers reorder Novera.
              </h2>
              <dl className="mt-9 flex flex-col">
                {REORDER.map((r, i) => (
                  <Reveal key={r.title} delay={i * 0.06}>
                    <div className="border-t border-dark/15 py-6">
                      <dt className="text-subhead text-dark">{r.title}</dt>
                      <dd className="mt-2.5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted">
                        {r.body}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.1} y={28}>
              <figure className="flex h-full flex-col justify-center">
                <blockquote className="font-serif text-[clamp(1.375rem,2.3vw,1.875rem)] leading-[1.3] tracking-[-0.01em] text-dark">
                  <p>{REORDER_QUOTE.quote}</p>
                </blockquote>
                <figcaption className="mt-9 flex items-center gap-4 border-t border-dark/15 pt-7">
                  <Image
                    src={REORDER_QUOTE.image}
                    alt=""
                    width={56}
                    height={56}
                    sizes="56px"
                    className="h-14 w-14 shrink-0 rounded-full object-cover"
                  />
                  <span>
                    <span className="block text-subhead text-dark">
                      {REORDER_QUOTE.name}
                    </span>
                    <span className="mt-1 block text-[0.8125rem] text-muted">
                      {REORDER_QUOTE.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 8. Closing ───────────────────────────────────────────────── */}
      <StatementBanner
        variant="image"
        lines={["Read the report.", "Then decide."]}
        body="Every line in the range carries its batch number, its assay and the name of the lab that ran it. None of it asks to be taken on trust."
        cta={{ label: "Read the reports", href: "/reports" }}
        image="/images/report.png"
        // Nudged down off centre: the cartons sit low in the frame and the
        // default centre crop clipped their feet and the pens in front.
        imagePosition="center 62%"
        imageAlt="Sealed ALLUVI CJC-1295, MOTS-C and Tesamorelin cartons stood in a row with their pre-filled pens laid in front"
      />
    </main>
  );
}
