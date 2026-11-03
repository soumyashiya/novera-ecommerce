"use client";

// "How each pen is prepared" — a scroll-told sequence. On desktop the left
// column sticks while the three steps scroll past on the right: the framed
// photograph cross-fades to match the step in view, a yellow rail fills with
// scroll progress, and the active step brightens while the others recede.
// On mobile it collapses to a simple stacked list with an image per step.
//
// The copy restates the existing WHY_US / STORAGE_LOGIC claims rather than
// adding new ones.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

const EASE = [0.22, 0.61, 0.36, 1] as const;

const STEPS = [
  {
    no: "01",
    title: "Source",
    text: "Formulations are produced under tightly controlled, ISO-aligned processes so concentration stays uniform batch to batch.",
    tag: "Controlled production",
    image: "/images/gen/about.webp",
    alt: "A calm, daylight laboratory bench lined with glassware",
  },
  {
    no: "02",
    title: "Verify",
    text: "Every batch goes to Janoshik Analytical for independent purity and concentration analysis before it is listed.",
    tag: "Third-party assay",
    image: "/images/gen/why-purity.webp",
    alt: "A precision pipette above a sample vial on a lab bench",
  },
  {
    no: "03",
    title: "Seal",
    text: "Each pen is sealed in temperature-stable, tamper-evident packaging and kept refrigerated until dispatch.",
    tag: "Cold-chain sealed",
    image: "/images/gen/why-packaging.webp",
    alt: "A sealed vial held in an insulated, foam-lined carton",
  },
];

/** One step on the right-hand track; reports itself when it reaches mid-screen. */
function Step({
  step,
  index,
  active,
  onActive,
}: {
  step: (typeof STEPS)[number];
  index: number;
  active: boolean;
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li
      ref={ref}
      className={`relative pl-10 transition-opacity duration-700 lg:flex lg:min-h-[62vh] lg:flex-col lg:justify-center lg:pl-16 ${
        active ? "opacity-100" : "lg:opacity-30"
      }`}
    >
      {/* Node on the rail */}
      <span
        aria-hidden
        className={`absolute left-0 top-2 grid h-[22px] w-[22px] -translate-x-1/2 place-items-center rounded-full border transition-colors duration-500 lg:top-1/2 lg:-translate-y-1/2 ${
          active ? "border-dark bg-accent" : "border-dark/25 bg-background"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
            active ? "bg-dark" : "bg-dark/25"
          }`}
        />
      </span>

      {/* Mobile image (desktop uses the sticky frame) */}
      <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-background-secondary lg:hidden">
        <Image
          src={step.image}
          alt={step.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="flex items-baseline gap-5">
        <span
          aria-hidden
          className="font-serif text-[clamp(4rem,7vw,7.5rem)] italic leading-[0.8] text-transparent [-webkit-text-stroke:1px_var(--ink)]"
        >
          {step.no}
        </span>
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-copper">
          {step.tag}
        </span>
      </div>

      <h3 className="mt-5 font-serif text-[clamp(2rem,3vw,2.75rem)] leading-none tracking-[-0.015em] text-dark">
        <span className="sr-only">Step {step.no}: </span>
        {step.title}
      </h3>
      <p className="mt-4 max-w-[440px] text-[0.9375rem] leading-relaxed text-muted">
        {step.text}
      </p>
    </li>
  );
}

export default function Process() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLOListElement>(null);

  // Rail fill follows the steps track through the viewport.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 55%", "end 55%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  const current = STEPS[active];

  return (
    <section id="process" className="section-pad bg-background-secondary">
      <div className="container-lux">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Sticky narrative column */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[150px]">
              <p className="flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-copper">
                <span aria-hidden className="h-px w-8 bg-copper" />
                Three deliberate steps
              </p>
              <h2 className="mt-5 font-serif text-[clamp(2.5rem,4.6vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-dark">
                How each pen <br className="hidden lg:block" />
                is{" "}
                <span className="relative isolate inline-block italic">
                  prepared
                  {/* Yellow highlighter swipe under the key word */}
                  <motion.span
                    aria-hidden
                    initial={reduce ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-20% 0px" }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
                    className="absolute inset-x-[-0.08em] bottom-[0.08em] -z-10 h-[0.32em] origin-left bg-accent"
                  />
                </span>
              </h2>
              <p className="mt-6 max-w-[420px] text-[0.9375rem] leading-relaxed text-muted">
                Three deliberate steps between the lab bench and the sealed pen
                — so nothing about the product is left to chance.
              </p>

              {/* Framed photo that follows the active step (desktop) */}
              <div className="relative mt-10 hidden aspect-[16/11] max-h-[46vh] w-full overflow-hidden bg-background lg:block">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={current.image}
                    initial={reduce ? false : { opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={current.image}
                      alt={current.alt}
                      fill
                      sizes="40vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Step counter chip */}
                <div className="absolute bottom-0 left-0 z-10 flex items-center gap-3 bg-accent px-4 py-3 text-dark">
                  <span className="font-serif text-[1.5rem] italic leading-none">
                    {current.no}
                  </span>
                  <span className="h-4 w-px bg-dark/30" aria-hidden />
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em]">
                    {current.title}
                  </span>
                </div>

                {/* Segment progress across the top */}
                <div className="absolute inset-x-4 top-4 z-10 flex gap-1.5" aria-hidden>
                  {STEPS.map((s, i) => (
                    <span
                      key={s.no}
                      className="h-[3px] flex-1 overflow-hidden bg-white/50"
                    >
                      <span
                        className={`block h-full bg-dark transition-transform duration-700 ${
                          i <= active ? "scale-x-100" : "scale-x-0"
                        } origin-left`}
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Steps track with a filling rail */}
          <div className="relative lg:col-span-6 lg:col-start-7">
            <div
              aria-hidden
              className="absolute bottom-0 left-0 top-0 w-px bg-dark/15"
            />
            <motion.div
              aria-hidden
              style={{ scaleY: reduce ? 1 : fill }}
              className="absolute bottom-0 left-0 top-0 w-[2px] -translate-x-[0.5px] origin-top bg-accent"
            />
            <ol
              ref={trackRef}
              className="flex flex-col gap-16 lg:gap-0"
            >
              {STEPS.map((step, i) => (
                <Step
                  key={step.no}
                  step={step}
                  index={i}
                  active={active === i}
                  onActive={setActive}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
