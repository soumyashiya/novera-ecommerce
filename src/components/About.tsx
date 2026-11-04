// "The Novera standard" — two registers, after the reference's stats + clinical
// block:
//
//   1. a stats row: a small sentence-case heading, then four columns of a bold
//      label, a giant serif numeral, and a unit + caption beside it
//   2. a split: the italic-uppercase statement, body and outlined CTA centred
//      on the left; on the right a tall photograph with a three-step timeline
//      (✦ markers on a hairline) set over its lightened left side, and a
//      footnote underneath
//
// Server component: <Reveal>/<RevealImage> are client wrappers, but this file
// holds no state. Every figure and claim restates the existing About copy and
// the Janoshik analysis in src/lib/data.ts — nothing here is a new promise.
import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

const STATS = [
  {
    label: "Purity, verified.",
    figure: "99",
    unit: "%+",
    caption: "verified purity on certified batches*.",
  },
  {
    label: "Tested, every time.",
    figure: "100",
    unit: "%",
    caption: "of batches third-party tested before listing.",
  },
  {
    label: "Trusted by labs.",
    figure: "10,000",
    unit: "+",
    caption: "orders shipped to research clients.",
  },
  {
    label: "Kept cold.",
    figure: "2–8",
    unit: "°C",
    caption: "sealed, refrigerated storage until dispatch.",
  },
];

const TIMELINE = [
  {
    step: "Batch received",
    points: ["Sealed and logged", "Batch number assigned"],
  },
  {
    step: "Batch assayed",
    points: [
      "Sent to Janoshik Analytical",
      "Purity and concentration measured independently",
    ],
  },
  {
    step: "Listed & shipped",
    points: [
      "Certificate of analysis published",
      "Dispatched sealed and cold",
    ],
  },
];

function Sparkle() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5 shrink-0 text-dark">
      <path
        d="M8 0c.5 4.3 2.7 6.5 8 8-5.3 1.5-7.5 3.7-8 8-.5-4.3-2.7-6.5-8-8 5.3-1.5 7.5-3.7 8-8z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function About() {
  return (
    <section id="about" className="section-pad">
      <div className="container-lux">
        {/* ── 1. Stats row ─────────────────────────────────────────────── */}
        <Reveal>
          <h2 className="font-serif text-[1.25rem] tracking-[-0.01em] text-dark">
            The numbers don&apos;t lie.
          </h2>
        </Reveal>
        <dl className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05}>
              <dt className="text-[0.75rem] font-semibold text-dark">
                {s.label}
              </dt>
              <dd className="mt-1 flex items-start gap-2.5">
                <span className="font-serif text-[clamp(3.25rem,5.5vw,4.5rem)] leading-[0.9] tracking-[-0.02em] text-dark">
                  {s.figure}
                </span>
                <span className="max-w-[130px] pt-1">
                  <span className="block font-serif text-[1.125rem] leading-none text-dark">
                    {s.unit}
                  </span>
                  <span className="mt-1.5 block text-[0.6875rem] leading-snug text-dark">
                    {s.caption}
                  </span>
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>

        {/* ── 2. Statement + timeline panel ────────────────────────────── */}
        {/* Photo column is the narrower of the two: it is a 4:5 portrait, so
            its width sets its height, and an even split made it overshoot. */}
        <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-8">
          {/* Measure widened with the type: the three lines are hard-broken,
              so at the larger size 440px would wrap "purity." on its own. */}
          <Reveal className="mx-auto max-w-[560px] text-center">
            <p className="text-hero !text-[clamp(2.5rem,4.51vw,4rem)] text-dark">
              The Novera
              <br />
              standard of
              <br />
              research purity.
            </p>
            {/* Body keeps the old measure — the wider column is for the
                display lines, not for 80-character prose. */}
            <p className="mx-auto mt-5 max-w-[460px] text-[0.875rem] leading-relaxed text-dark">
              We started Novera because the research peptide market needed a
              supplier willing to be boring about the basics — transparent
              sourcing, third-party lab testing, and people you can actually
              message. Every batch is checked before it reaches our shelves.
            </p>
            {/* Opens the full story at /about — this block is its summary,
                and the page repeats its framing so the two read as one. */}
            <Link
              href="/about"
              className="mt-7 inline-flex h-11 items-center justify-center border !border-dark px-6 text-[0.8125rem] font-bold uppercase tracking-[-0.02em] text-dark transition-colors duration-300 hover:bg-dark hover:text-white"
            >
              Our story
            </Link>
          </Reveal>

          <Reveal delay={0.08} y={28}>
            {/* The timeline only overlays the photo once there is room for
                it; below lg it sits underneath, where it was wrapping to
                roughly a third taller than the frame and running over the
                cartons. */}
            <div className="relative">
              {/* Measured against the photo: hair starts 1.9% down, the NAD+
                  carton ends at 92%. The cap and object-position trim only
                  that dead margin — any shorter clips the product. */}
              <div className="relative aspect-[4/5] overflow-hidden bg-background-secondary lg:max-h-[740px] lg:w-full">
                <Image
                  src="/images/our-story.png"
                  alt="A woman at a sunlit counter with sealed ALLUVI NAD+ and MOTS-C cartons"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-[center_19%]"
                />
              </div>

              {/* Hugs its own content at lg rather than filling the frame, so
                  .story-panel's wash sits behind the type and nothing else. */}
              <ol className="story-panel mt-8 flex flex-col gap-0 lg:absolute lg:left-0 lg:top-1/2 lg:mt-0 lg:w-[60%] lg:-translate-y-1/2 lg:px-9">
                {TIMELINE.map((t, i) => (
                  <li key={t.step} className="relative pb-10 last:pb-0">
                    {/* Hairline joining this marker to the next */}
                    {i < TIMELINE.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute left-[6.5px] top-6 bottom-2 w-px bg-dark/60"
                      />
                    )}
                    <p className="flex items-center gap-3 text-[0.875rem] font-bold uppercase tracking-[-0.01em] text-dark">
                      <Sparkle />
                      {t.step}
                    </p>
                    <ul className="mt-2.5 space-y-1.5 pl-[26px]">
                      {t.points.map((p) => (
                        <li
                          key={p}
                          className="text-[0.9375rem] leading-snug text-dark"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
            <p className="mt-3 text-[0.6875rem] text-muted">
              *As reported by Janoshik Analytical for each certified batch.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
