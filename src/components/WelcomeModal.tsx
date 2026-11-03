"use client";

// First-visit welcome modal: a wide card with the photograph on the left and
// the authorised-partner pitch (Alluvi wordmark, headline, two CTAs) right.
// Shown once per browser (remembered in localStorage), a moment after load,
// and never on checkout/payment/sign-in routes. Escape, the close button or
// clicking the backdrop dismisses it; focus moves into the dialog and back.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

const STORAGE_KEY = "novera:welcome-seen";
const DELAY_MS = 1800;
const EXCLUDED = ["/checkout", "/payment-capture", "/signin", "/reset-password"];
const EASE = [0.22, 0.61, 0.36, 1] as const;

const markSeen = () => {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {}
};

export default function WelcomeModal() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (EXCLUDED.some((r) => pathname?.startsWith(r))) return;
    let seen = false;
    try {
      seen = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {}
    if (seen) return;
    const id = setTimeout(() => {
      lastFocus.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    }, DELAY_MS);
    return () => clearTimeout(id);
  }, [pathname]);

  const close = () => {
    markSeen();
    setOpen(false);
    lastFocus.current?.focus();
  };

  // Escape to close, focus into the dialog, lock page scroll while open.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("lenis-stopped");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-dark/55 p-4 backdrop-blur-[2px]"
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative grid w-full max-w-[960px] overflow-hidden bg-background shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)] md:grid-cols-2"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/85 text-dark transition-colors duration-300 hover:bg-accent"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {/* Photo */}
            <div className="relative hidden aspect-[4/5] md:block md:aspect-auto md:min-h-[540px]">
              <Image
                src="/images/gen/quiz-finder.webp"
                alt=""
                fill
                sizes="480px"
                className="object-cover"
              />
            </div>

            {/* Partner pitch */}
            <div className="flex flex-col justify-center px-8 py-12 sm:px-10">
              <p className="flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-copper">
                <span aria-hidden className="h-px w-8 bg-copper" />
                Official partner
              </p>

              {/* Partner wordmark, set in type (no logo file in the project) */}
              <p className="mt-5 leading-none text-dark">
                <span className="block font-sans text-[1.875rem] font-extrabold tracking-[-0.01em]">
                  ALLUVI<sup className="ml-0.5 text-[0.75rem] font-semibold">®</sup>
                </span>
                <span className="mt-1 block text-[0.6875rem] font-bold uppercase tracking-[0.18em]">
                  Healthcare
                </span>
              </p>

              <h2
                id="welcome-title"
                className="mt-6 font-serif text-[clamp(2.25rem,3.4vw,3.25rem)] leading-[1] tracking-[-0.02em] text-dark"
              >
                Authorised reseller of <em className="text-copper">Alluvi</em>{" "}
                research products.
              </h2>
              <p className="mt-5 max-w-[400px] text-[0.9375rem] leading-relaxed text-dark/75">
                Every pen on this site is a genuine Alluvi Healthcare kit,
                supplied through our authorised partnership, batch-verified by
                Janoshik Analytical and shipped sealed and cold.
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {["Genuine Alluvi batches", "Janoshik verified"].map((t) => (
                  <li
                    key={t}
                    className="inline-flex items-center gap-2 border !border-dark/20 px-3 py-2 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-dark"
                  >
                    <svg viewBox="0 0 16 16" aria-hidden className="h-3 w-3 text-copper" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="8" cy="8" r="6.5" />
                      <path d="M5.2 8.3l1.9 1.9 3.7-4" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/shop"
                  onClick={close}
                  className="group inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap bg-accent px-4 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-dark transition-colors duration-300 hover:bg-dark hover:text-white"
                >
                  Shop the range
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/#process"
                  onClick={close}
                  className="inline-flex h-12 items-center justify-center whitespace-nowrap border !border-dark px-4 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-dark transition-colors duration-300 hover:bg-dark hover:text-white"
                >
                  How we verify
                </Link>
              </div>

              <p className="mt-8 text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                For research use only — not for human or veterinary use.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

