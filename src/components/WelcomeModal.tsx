"use client";

// First-visit sign-up modal: the photograph on the left, a yellow panel on the
// right with a headline, an email field and the consent note. Sign-ups go to
// the same newsletter endpoint as the footer form.
// Shown on every new visit a moment after load (closing it hides it for the
// rest of the tab session; subscribing hides it for good), and never on
// checkout/payment/sign-in routes. Escape, the close button or
// clicking the backdrop dismisses it; focus moves into the dialog and back.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { api, ApiError } from "@/lib/api";

const SUBSCRIBED_KEY = "novera:welcome-subscribed";
const DISMISSED_KEY = "novera:welcome-dismissed";
const DELAY_MS = 1800;
const EXCLUDED = ["/checkout", "/payment-capture", "/signin", "/reset-password"];
const EASE = [0.22, 0.61, 0.36, 1] as const;

const markDismissed = () => {
  try {
    sessionStorage.setItem(DISMISSED_KEY, "1");
  } catch {}
};

const markSubscribed = () => {
  try {
    localStorage.setItem(SUBSCRIBED_KEY, "1");
  } catch {}
};

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; msg: string }
  | { kind: "error"; msg: string };

export default function WelcomeModal() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (EXCLUDED.some((r) => pathname?.startsWith(r))) return;
    let seen = false;
    try {
      seen =
        localStorage.getItem(SUBSCRIBED_KEY) === "1" ||
        sessionStorage.getItem(DISMISSED_KEY) === "1";
    } catch {}
    if (seen) return;
    const id = setTimeout(() => {
      lastFocus.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    }, DELAY_MS);
    return () => clearTimeout(id);
  }, [pathname]);

  const close = () => {
    markDismissed();
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ kind: "loading" });
    try {
      const res = await api<{ ok: boolean; already_subscribed?: boolean }>(
        "/api/newsletter/subscribe",
        {
          method: "POST",
          json: {
            email,
            consent: true,
            source: "novera_welcome_modal",
            website: "",
          },
        }
      );
      markSubscribed();
      setStatus({
        kind: "success",
        msg: res.already_subscribed
          ? "You're already on the list, thank you."
          : "You're on the list. Watch your inbox for the next batch release.",
      });
      setEmail("");
    } catch (err) {
      const msg =
        err instanceof ApiError && err.status === 429
          ? "Too many submissions. Please try again later."
          : err instanceof Error
            ? err.message
            : "Failed to subscribe. Please try again.";
      setStatus({ kind: "error", msg });
    }
  };

  const isLoading = status.kind === "loading";

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
            className="relative grid max-h-[calc(100dvh-2rem)] w-full max-w-[900px] overflow-y-auto bg-accent shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)] md:grid-cols-2 md:overflow-hidden"
          >
            {/* Outlined circle close, as in the reference */}
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center !rounded-full border-2 !border-dark bg-accent text-dark transition-colors duration-300 hover:bg-dark hover:text-accent"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {/* Photo: full height on desktop, a short banner on mobile */}
            <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[560px]">
              <Image
                src="/images/modal.webp"
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover object-[center_45%] md:object-[center_30%]"
              />
            </div>

            <div className="flex flex-col justify-center px-7 py-10 text-center sm:px-10 md:py-12">
              <p className="font-sans text-[0.875rem] font-bold italic uppercase tracking-[0.02em] text-dark">
                Pure. Verified. Documented.
              </p>

              <h2
                id="welcome-title"
                className="mt-5 font-serif text-[clamp(2.5rem,4.6vw,3.5rem)] italic uppercase leading-[0.95] tracking-[-0.02em] text-dark"
              >
                First look at every new batch
              </h2>

              <p className="mx-auto mt-5 max-w-[34ch] font-sans text-[1rem] leading-snug text-dark">
                Sign up for new batch releases, lab reports and early access to
                new research lines.
              </p>

              {status.kind === "success" ? (
                <p
                  role="status"
                  className="mt-7 border-2 !border-dark px-4 py-4 font-sans text-[0.9375rem] font-semibold text-dark"
                >
                  {status.msg}
                </p>
              ) : (
                <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-3">
                  <label htmlFor="welcome-email" className="sr-only">
                    Your email address
                  </label>
                  <input
                    id="welcome-email"
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    disabled={isLoading}
                    className="h-[52px] w-full border !border-dark bg-background px-4 font-sans text-[0.9375rem] text-dark placeholder-dark/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="h-[52px] w-full bg-dark font-sans text-[0.875rem] font-bold uppercase tracking-[0.04em] text-white transition-colors duration-300 hover:bg-dark/85 disabled:opacity-60"
                  >
                    {isLoading ? "Signing up…" : "Sign me up"}
                  </button>
                  {status.kind === "error" && (
                    <p role="alert" className="font-sans text-[0.8125rem] text-dark">
                      {status.msg}
                    </p>
                  )}
                </form>
              )}

              <p className="mx-auto mt-6 max-w-[48ch] font-sans text-[0.6875rem] leading-relaxed text-dark/85">
                Sign up to receive the latest news from Novera by email,
                including new batch releases and lab reports. You can
                unsubscribe at any time. By signing up you agree to our{" "}
                <Link
                  href="/policies/privacy-policy"
                  onClick={close}
                  className="underline underline-offset-2"
                >
                  Privacy Policy
                </Link>
                . For research use only.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
