"use client";

// Full-bleed subscription banner: the stone photograph fills the band and the
// copy sits bottom-left over a soft shadow — serif headline, one-line subhead,
// a pill CTA — then a hairline and a single row of perks with icons.
//
// DISCOUNT and PERKS are marketing statements: keep them in step with the
// subscription offer you actually run.
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 0.61, 0.36, 1] as const;

const DISCOUNT = 15; // percent

const icon = (d: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden
    className="h-4 w-4 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {d}
  </svg>
);

const PERKS = [
  {
    label: `${DISCOUNT}% off every delivery`,
    icon: icon(
      <>
        <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" />
        <circle cx="7.5" cy="7.5" r="1.5" />
      </>
    ),
  },
  {
    label: "Free cold-chain shipping",
    icon: icon(
      <>
        <path d="M1 6h13v10H1zM14 10h4l3 3v3h-7" />
        <circle cx="5.5" cy="18" r="1.8" />
        <circle cx="17.5" cy="18" r="1.8" />
      </>
    ),
  },
  {
    label: "Lab report with every batch",
    icon: icon(
      <>
        <path d="M9 3h6M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3" />
        <path d="M7.5 15h9" />
      </>
    ),
  },
  {
    label: "Pause or cancel anytime",
    icon: icon(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M10 9v6M14 9v6" />
      </>
    ),
  },
  {
    label: "Priority batch access",
    icon: icon(
      <path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" />
    ),
  },
];

export default function Subscribe() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    // No negative margin: the perks row sits at the very bottom of the band
    // and must still reveal when the band is scrolled fully into view.
    viewport: { once: true },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section
      id="subscribe"
      className="relative isolate flex min-h-[620px] items-end overflow-hidden text-white lg:min-h-0 lg:aspect-[1344/640]"
    >
      <motion.div
        aria-hidden
        initial={reduce ? false : { scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: EASE }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src="/images/gen/subscribe-bg-stone.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[75%_center]"
        />
      </motion.div>
      {/* Shadow under the copy so white text holds on the light stone. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#2e1d0e]/85 via-[#2e1d0e]/35 to-transparent"
      />

      <div className="container-lux w-full pb-10 pt-40 lg:pb-12">
        <motion.h2
          {...rise(0)}
          className="max-w-[820px] font-serif text-[clamp(2.25rem,3.6vw,3.25rem)] leading-[1] tracking-[-0.02em]"
        >
          Never run short on the bench
        </motion.h2>
        <motion.p {...rise(0.08)} className="mt-4 text-[0.9375rem] text-white/85">
          Your chosen line, delivered monthly from each verified batch.
        </motion.p>
        <motion.div {...rise(0.16)}>
          <Link
            href="/shop"
            className="mt-5 inline-flex h-10 items-center rounded-full bg-white px-6 text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-dark transition-colors duration-300 hover:bg-accent"
          >
            Subscribe &amp; save {DISCOUNT}%
          </Link>
        </motion.div>

        <motion.ul
          {...rise(0.24)}
          className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t !border-white/35 pt-6 lg:justify-between lg:gap-x-6"
        >
          {PERKS.map((p) => (
            <li
              key={p.label}
              className="flex items-center gap-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-white"
            >
              {p.icon}
              {p.label}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
