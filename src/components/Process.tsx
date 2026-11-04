"use client";

// "How each pen is prepared" — the three steps read as a staggered triptych:
// each column starts a little lower than the last, so the sequence literally
// steps down across the page instead of being revealed one screenful at a
// time. A measure line draws across the top of each column as it arrives;
// that is the only authored motion here.
//
// The copy restates the existing WHY_US / STORAGE_LOGIC claims rather than
// adding new ones.
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 0.61, 0.36, 1] as const;

const STEPS = [
  {
    no: "01",
    title: "Source",
    text: "Formulations are produced under tightly controlled, ISO-aligned processes so concentration stays uniform batch to batch.",
    tag: "Controlled production",
    image: "/images/source.png",
    alt: "A tray of sealed ALLUVI pens spanning the full range, laid out in order",
  },
  {
    no: "02",
    title: "Verify",
    text: "Every batch goes to Janoshik Analytical for independent purity and concentration analysis before it is listed.",
    tag: "Third-party assay",
    image: "/images/seal.png",
    alt: "A sealed ALLUVI Retatrutide 40 mg carton presented alongside Glow and NAD+ pens",
  },
  {
    no: "03",
    title: "Seal",
    text: "Each pen is sealed in temperature-stable, tamper-evident packaging and kept refrigerated until dispatch.",
    tag: "Cold-chain sealed",
    image: "/images/verify.png",
    alt: "A gloved hand lifting a sealed ALLUVI Tesamorelin pen from a laboratory refrigerator held at 4°C",
  },
];

// The descent. Written out rather than computed so Tailwind sees the classes.
const DROP = ["lg:mt-0", "lg:mt-20", "lg:mt-40"];

export default function Process() {
  const reduce = useReducedMotion();

  return (
    <section id="process" className="section-band section-pad bg-background-secondary">
      <div className="container-lux">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-12">
          <h2 className="font-serif text-[clamp(2.5rem,5.06vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-dark lg:col-span-7">
            How every Novera pen <br className="hidden lg:block" />
            is{" "}
            <span className="relative isolate inline-block italic">
              prepared
              {/* Yellow swipe under the key word — a static mark, so the
                  measure lines below stay the section's one moving part. */}
              <span
                aria-hidden
                className="absolute inset-x-[-0.08em] bottom-[0.08em] -z-10 h-[0.32em] bg-accent"
              />
            </span>
          </h2>
          <p className="max-w-[420px] self-end text-[0.9375rem] leading-relaxed text-muted lg:col-span-4 lg:col-start-9">
            Three deliberate steps between the lab bench and the sealed pen —
            so nothing about the product is left to chance.
          </p>
        </div>

        <ol className="mt-14 grid gap-x-10 gap-y-16 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.no} className={`group ${DROP[i]}`}>
              {/* Each column opens on its own measure: a node, then a rule
                  that draws to the column's full width. Staggered, the three
                  rules are what makes the descent read as one sequence. */}
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-[9px] w-[9px] shrink-0 rounded-full bg-dark"
                />
                <motion.span
                  aria-hidden
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{ duration: 0.8, ease: EASE, delay: i * 0.12 }}
                  className="h-px flex-1 origin-left bg-dark/20"
                />
              </div>

              <p
                aria-hidden
                className="mt-7 font-serif text-[clamp(3rem,4.4vw,4rem)] italic leading-[0.8] text-transparent [-webkit-text-stroke:1px_var(--ink)]"
              >
                {step.no}
              </p>

              <h3 className="mt-5 font-serif text-[clamp(1.75rem,2.42vw,2.25rem)] leading-none tracking-[-0.015em] text-dark">
                <span className="sr-only">Step {step.no}: </span>
                {step.title}
              </h3>

              <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
                {step.text}
              </p>

              {/* 4:5 on desktop is the native shape of two of the three
                  shots, so they are not cropped at all. Stacked on a phone,
                  three 4:5 frames eat most of the scroll — square is the
                  compromise: it trims 20% off a portrait rather than 4:3's
                  40%, and the square shot fits it exactly. */}
              <div className="relative mt-8 aspect-square overflow-hidden bg-background lg:aspect-[4/5]">
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 38vw"
                  className="img-grade img-hover object-cover"
                />
              </div>

              <p className="mt-4 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-copper">
                {step.tag}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
