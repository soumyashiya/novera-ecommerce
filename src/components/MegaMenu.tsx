"use client";

// Desktop "Shop" mega menu. Drops out of the yellow nav bar as one continuous
// yellow panel: large serif primary links on the left, three columns of
// grouped links (bold uppercase headings, serif items), and a feature card for
// the newest product on the right. Every link points at a real route/anchor.
//
// Motion: the panel itself unrolls (see Navigation); here each column rises
// in on a short stagger, and links nudge right with an underline on hover.
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CATEGORIES, PRODUCTS, formatPrice } from "@/lib/data";

const EASE = [0.22, 0.61, 0.36, 1] as const;

const PRIMARY = [
  { label: "Shop all", href: "/shop" },
  { label: "New in", href: "/#new-arrivals", tag: "New" },
  { label: "Bestsellers", href: "/#products" },
  { label: "Subscribe & save", href: "/#subscribe" },
];

const COLUMNS = [
  {
    title: "Shop by line",
    links: [
      ...CATEGORIES.map((c) => ({
        label: c.label,
        href: `/shop?category=${c.slug}`,
      })),
      { label: "The full range", href: "/shop" },
    ],
  },
  {
    title: "Laboratory",
    links: [
      { label: "How we verify", href: "/#process" },
      { label: "Lab reports", href: "/shop" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Client care",
    links: [
      { label: "My orders", href: "/account/orders" },
      { label: "Track order", href: "/track" },
      { label: "Delivery", href: "/policies/shipping-policy" },
      { label: "Returns", href: "/policies/refund-policy" },
    ],
  },
];

const shortName = (name: string) => name.replace(/\s*\(.*?\)\s*$/, "").trim();

// Feature card: the first product tagged New (falls back to the first product).
const FEATURE = PRODUCTS.find((p) => p.badge === "New") ?? PRODUCTS[0];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const linkCls =
  "inline-block text-dark transition-transform duration-300 ease-out hover:translate-x-1.5";

export default function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={container}
      initial={reduce ? false : "hidden"}
      animate="show"
      className="grid grid-cols-12 gap-8 px-8 pb-10 pt-6"
    >
      {/* Primary */}
      <motion.ul variants={item} className="col-span-3 flex flex-col gap-3">
        {PRIMARY.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              onClick={onNavigate}
              className={`${linkCls} group font-serif text-[2rem] leading-[1.05] tracking-[-0.02em]`}
            >
              <span className="link-underline">{l.label}</span>
              {l.tag && (
                <sup className="ml-1.5 font-sans text-[0.625rem] font-bold uppercase tracking-[-0.01em]">
                  {l.tag}
                </sup>
              )}
            </Link>
          </li>
        ))}
      </motion.ul>

      {/* Grouped columns */}
      {COLUMNS.map((col) => (
        <motion.div key={col.title} variants={item} className="col-span-2">
          <p className="mb-5 text-[0.8125rem] font-bold uppercase tracking-[-0.01em] text-dark">
            {col.title}
          </p>
          <ul className="flex flex-col gap-2">
            {col.links.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  onClick={onNavigate}
                  className={`${linkCls} font-serif text-[1.1875rem] leading-snug`}
                >
                  <span className="link-underline">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}

      {/* Feature card */}
      <motion.div variants={item} className="col-span-3">
        <Link
          href={`/products/${FEATURE.slug}`}
          onClick={onNavigate}
          className="group block"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-background">
            <span className="absolute left-3 top-3 z-10 bg-dark px-2.5 py-1.5 text-[0.625rem] font-bold uppercase leading-none tracking-[0.04em] text-accent">
              New batch
            </span>
            <Image
              src={FEATURE.image}
              alt={shortName(FEATURE.name)}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-4">
            <p className="font-serif text-[1.375rem] leading-none text-dark">
              {shortName(FEATURE.name)}
            </p>
            <p className="text-[0.875rem] text-dark">
              {formatPrice(FEATURE.price)}
            </p>
          </div>
          {FEATURE.analysis && (
            <p className="mt-1.5 text-[0.8125rem] text-dark/75">
              Janoshik verified · Batch {FEATURE.analysis.batchNumber}
            </p>
          )}
          <span className="mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] font-bold uppercase tracking-[-0.01em] text-dark underline underline-offset-4">
            Shop now
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
