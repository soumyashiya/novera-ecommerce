"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { PRODUCTS } from "@/lib/data";

const EASE = [0.22, 0.61, 0.36, 1] as const;
// Points at the lossless source, not a pre-made .webp: next/image re-encodes
// to AVIF/WebP anyway, so a pre-compressed source would be compressed twice.
const HERO_IMG = "/images/hero-updated.png";

// Reference hero: one continuous pale ground; the photo sits on the left
// and dissolves into it, the copy block is right-aligned against the gutter.
// A yellow band of logo-style marks follows immediately underneath.
export default function Hero() {
  const reduce = useReducedMotion();
  const verified = PRODUCTS.filter((p) => p.analysis).length;

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  // Set in alternating faces so the strip reads like a row of press marks.
  const marks = [
    { label: "Janoshik", cls: "font-serif text-[1.65rem] uppercase tracking-[-0.02em]" },
    { label: `${verified} Verified Batches`, cls: "font-sans text-[1.15rem] font-extrabold uppercase tracking-[-0.03em]" },
    { label: "Third-Party Tested", cls: "font-serif italic text-[1.5rem]" },
    { label: "Batch No. Published", cls: "font-sans text-[1.05rem] font-black uppercase tracking-[-0.04em]" },
    { label: "Sealed Vials", cls: "font-serif text-[1.55rem] uppercase tracking-[0.12em]" },
    { label: "Tamper-Evident", cls: "font-sans text-[1.15rem] font-bold italic uppercase tracking-[-0.02em]" },
  ];

  return (
    <section id="top">
      {/* Starts at the very top of the page: the fixed header (dark strip +
          inset yellow bar) floats over it, as on the reference. */}
      {/* Ground is keyed to the photo's own wall tone (#e5dad0) so the
          masked right edge dissolves into it without a warm/cool seam. */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#e6dbd1] via-[#e9e1d8] to-[#efe9e3] pt-[94px] lg:pt-0">
        {/* One image (single preload): stacked above the copy on mobile,
            pinned left and fading into the ground on desktop. The source is
            3:1 with the subject in its left third, so both crops sit well
            left of centre to keep her and the carton in frame.
            sizes is far wider than the slot on purpose: object-cover fits
            this 3:1 source to the box HEIGHT and crops the sides, so the
            pixels needed are ~3x the box height, not its width. Asking for
            60vw shipped a 1080px file into a 690px-tall box — a 2x upscale,
            which is what made the photo look soft.
            Desktop zoom is capped at 1.05: the 724px-tall source then fills
            the ~690px box at 1:1, so it moves closer to the copy without
            being upscaled. object-[0%] adds the rest of the shift for free. */}
        <div className="hero-photo relative aspect-[4/3] w-full lg:absolute lg:inset-y-0 lg:left-0 lg:aspect-auto lg:w-[60%]">
          <Image
            src={HERO_IMG}
            alt="A woman seated beside a sealed ALLUVI NAD+ carton, holding one of its single-use vials"
            fill
            preload
            quality={90}
            sizes="(max-width: 1024px) 250vw, 200vw"
            className="object-cover object-[10%_center] lg:origin-left lg:scale-[1.05] lg:object-[0%_center]"
          />
        </div>

        {/* Side padding = header inset + bar padding (8+16 / 48+24), so the
            copy lines up with the nav items above. */}
        <div className="relative z-10 px-6 lg:px-[72px] flex items-end justify-end py-12 lg:h-[clamp(690px,38.5vw,810px)] lg:pt-[106px] lg:pb-12">
          <div className="w-full text-left lg:max-w-[640px] lg:text-right">
            <motion.p
              {...rise(0.05)}
              className="mb-3 flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[-0.02em] text-dark lg:justify-end"
            >
              <span aria-hidden className="text-[0.7rem] tracking-[0.15em] text-[#F5C400]">
                ★★★★★
              </span>
              Independently verified batches
            </motion.p>

            <motion.h1 {...rise(0.12)} className="text-hero text-dark">
              Purity that&apos;s
              <br />
              proven.
              <br />
              Not promised.
            </motion.h1>

            <motion.p
              {...rise(0.2)}
              className="mt-4 font-serif text-[1.2rem] leading-[1.15] tracking-[-0.015em] text-dark lg:ml-auto"
            >
              Every certified Novera batch is assayed by Janoshik Analytical
              before it is listed.
              <br className="hidden lg:block" /> Not some. Not most. Every.
              Single. One.
            </motion.p>

            <motion.div
              {...rise(0.28)}
              className="mt-7 flex flex-wrap gap-4 lg:justify-end"
            >
              {/* Reference pair: 44px tall, square, 14px bold uppercase with
                  tight tracking; solid ink + 1px ink outline. */}
              <Link
                href="/shop"
                className="inline-flex h-11 items-center justify-center border border-dark bg-dark px-6 text-[0.875rem] font-bold uppercase leading-none tracking-[-0.03em] text-white transition-colors duration-300 hover:bg-transparent hover:text-dark"
              >
                Shop the range
              </Link>
              <Link
                href="/#process"
                className="inline-flex h-11 items-center justify-center border border-dark bg-transparent px-6 text-[0.875rem] font-bold uppercase leading-none tracking-[-0.03em] text-dark transition-colors duration-300 hover:bg-dark hover:text-white"
              >
                How it works
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Yellow band in the position of the reference's press-logo row. We
          have no press coverage, so each "logo" is a verifiable fact. */}
      {/* Scrolls continuously: the list is rendered twice and the track
          slides by half its width, so the loop is seamless. Pauses on hover. */}
      <div className="group overflow-hidden bg-accent text-dark">
        <div className="marquee-track flex h-16 w-max items-center group-hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 || undefined}
              className="flex shrink-0 items-center gap-20 whitespace-nowrap pr-20"
            >
              {/* Each half holds the set twice so it is always wider than
                  the viewport — otherwise a gap shows before the loop. */}
              {[...marks, ...marks].map((m, i) => (
                <li
                  key={`${m.label}-${i}`}
                  aria-hidden={i >= marks.length || undefined}
                  className={`shrink-0 leading-none ${m.cls}`}
                >
                  {m.label}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
