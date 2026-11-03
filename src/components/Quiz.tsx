"use client";

// Two-step product finder, modelled on the reference "find your formula"
// block: a rounded photo on the left; on the right a serif headline with an
// italic sub-line, a grid of outlined choice chips, a pill CTA with a back
// button, and a step counter. Step 3 shows the matched products.
//
// Framed strictly around RESEARCH focus (the range is research-use only) —
// no health or body outcomes. Each area maps to product slugs below.
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  PRODUCTS,

  formatPrice,
  type Product,
} from "@/lib/data";

const EASE = [0.22, 0.61, 0.36, 1] as const;

// Six research areas (3 × 2 grid, as on the reference), each mapped to the
// products it covers by slug.
const AREAS = [
  { id: "glp", label: "GLP-1 & incretin receptor studies", slugs: ["tirzepatide", "retatrutide", "retatrutide-40"] },
  { id: "metabolic", label: "Metabolic & energy pathway research", slugs: ["retatrutide", "retatrutide-40", "nad"] },
  { id: "repair", label: "Tissue repair & recovery studies", slugs: ["glow"] },
  { id: "skin", label: "Skin, collagen & dermal research", slugs: ["glow"] },
  { id: "cellular", label: "Cellular energy & NAD+ studies", slugs: ["nad"] },
  { id: "longevity", label: "Ageing & longevity research", slugs: ["nad", "glow"] },
] as const;

const PRIORITIES = [
  { id: "value", label: "Best value per batch" },
  { id: "strength", label: "Highest strength available" },
  { id: "verified", label: "Published lab report only" },
] as const;

type AreaId = (typeof AREAS)[number]["id"];
type PriorityId = (typeof PRIORITIES)[number]["id"];

const shortName = (name: string) => name.replace(/\s*\(.*?\)\s*$/, "").trim();
const mg = (p: Product) => parseFloat((p.strengths[0] ?? "0").replace(/,/g, ""));

function recommend(areas: AreaId[], priority: PriorityId | null): Product[] {
  const slugs = new Set<string>(
    AREAS.filter((a) => areas.includes(a.id)).flatMap((a) => [...a.slugs])
  );
  let list = PRODUCTS.filter((p) => slugs.has(p.slug));
  if (priority === "verified") list = list.filter((p) => p.analysis);
  if (priority === "value") list = [...list].sort((a, b) => a.price - b.price);
  if (priority === "strength") list = [...list].sort((a, b) => mg(b) - mg(a));
  return list.slice(0, 3);
}

const chip = (active: boolean) =>
  `flex min-h-[56px] items-center justify-center rounded-[6px] border px-4 py-2.5 text-center text-[0.6875rem] font-medium uppercase leading-[1.3] tracking-[0.07em] text-dark transition-[background-color,border-color] duration-300 ${
    active
      ? "!border-dark bg-[#f3ece1]"
      : "!border-[#e8e1d4] bg-white hover:!border-dark/40"
  }`;

export default function Quiz() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(1);
  const [areas, setAreas] = useState<AreaId[]>([]);
  const [priority, setPriority] = useState<PriorityId | null>(null);

  const results = useMemo(() => recommend(areas, priority), [areas, priority]);

  const canNext = step === 1 ? areas.length > 0 : priority !== null;

  const toggleArea = (id: AreaId) =>
    setAreas((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const fade = {
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: reduce ? undefined : { opacity: 0, y: -12 },
    transition: { duration: 0.35, ease: EASE },
  };

  return (
    <section id="quiz" className="section-pad">
      <div className="container-lux">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-12">
          {/* Photo */}
          <div className="relative aspect-square overflow-hidden rounded-[10px] bg-background-secondary">
            <Image
              src="/images/gen/quiz-finder.webp"
              alt="A woman holding an Alluvi CJC-1295 pack and pen beside a kit bag"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>

          {/* Finder */}
          <div className="mx-auto w-full max-w-[700px] text-center">
            <h2 className="font-serif text-[clamp(2rem,2.9vw,2.75rem)] leading-[1.05] tracking-[-0.02em] text-dark">
              Find the Line That Fits Your Research
            </h2>
            <p className="font-serif text-[clamp(2rem,2.9vw,2.75rem)] italic leading-[1.05] tracking-[-0.02em] text-dark">
              {step === 1
                ? "Tell us what you’d like to study:"
                : step === 2
                  ? "Tell us what matters most:"
                  : "Your matched lines:"}
            </p>

            <div className="mt-10">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="s1" {...fade} className="grid gap-3 sm:grid-cols-3">
                    {AREAS.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        aria-pressed={areas.includes(a.id)}
                        onClick={() => toggleArea(a.id)}
                        className={chip(areas.includes(a.id))}
                      >
                        {a.label}
                      </button>
                    ))}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="s2" {...fade} className="grid gap-3 sm:grid-cols-3">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={priority === p.id}
                        onClick={() => setPriority(p.id)}
                        className={chip(priority === p.id)}
                      >
                        {p.label}
                      </button>
                    ))}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.ul key="s3" {...fade} className="grid gap-3 text-left">
                    {results.length ? (
                      results.map((p) => (
                        <li key={p.slug}>
                          <Link
                            href={`/products/${p.slug}`}
                            className="group flex items-center gap-4 rounded-md border !border-dark/15 bg-white/60 p-3 transition-colors duration-300 hover:!border-dark/50"
                          >
                            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded">
                              <Image src={p.image} alt="" fill sizes="56px" className="object-cover" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-serif text-[1.25rem] leading-tight text-dark">
                                {shortName(p.name)}
                              </span>
                              <span className="block truncate text-[0.75rem] text-muted">
                                {p.summary}
                              </span>
                            </span>
                            <span className="text-[0.875rem] text-dark">{formatPrice(p.price)}</span>
                            <span
                              aria-hidden
                              className="transition-transform duration-300 group-hover:translate-x-1"
                            >
                              →
                            </span>
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="text-center text-[0.9375rem] text-muted">
                        No line matches that combination yet —{" "}
                        <Link href="/shop" className="underline underline-offset-4">
                          browse the full range
                        </Link>
                        .
                      </li>
                    )}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                aria-label="Back"
                className="grid h-9 w-9 place-items-center rounded-full bg-[#f3ece1] text-dark/60 transition-opacity disabled:opacity-50"
              >
                ‹
              </button>
              {step < 3 ? (
                <button
                  type="button"
                  disabled={!canNext}
                  onClick={() => setStep((s) => s + 1)}
                  className="h-9 rounded-full bg-[#efe6da] px-10 text-[0.8125rem] uppercase tracking-[0.02em] text-dark transition-colors duration-300 enabled:hover:bg-accent disabled:opacity-50"
                >
                  {step === 1 ? "Find your line" : "See my matches"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setAreas([]);
                    setPriority(null);
                  }}
                  className="h-9 rounded-full bg-[#efe6da] px-10 text-[0.8125rem] uppercase tracking-[0.02em] text-dark transition-colors duration-300 hover:bg-accent"
                >
                  Start again
                </button>
              )}
            </div>
            <p className="mt-4 text-[0.6875rem] uppercase tracking-[0.02em] text-muted">
              {step < 3 ? `Step ${step} / 2` : "For research use only"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
