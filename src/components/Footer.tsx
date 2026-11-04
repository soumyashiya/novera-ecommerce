"use client";

// Yellow footer, modelled on the reference: an italic uppercase statement with
// a small outlined CTA, a full-bleed row of tall product tiles that bleeds off
// both edges, then a compact centred block — newsletter, four link columns,
// and the research-use disclaimer.
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FOOTER_LINKS, CONTACT, DISCLAIMER } from "@/lib/data";
import { api, ApiError } from "@/lib/api";
import VideoReel from "./VideoReel";

const RANGE_LINKS = [
  { label: "Tirzepatide", href: "/products/tirzepatide" },
  { label: "Retatrutide", href: "/products/retatrutide" },
  { label: "NAD+", href: "/products/nad" },
  { label: "Glow", href: "/products/glow" },
];
const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/policies/privacy-policy" },
  { label: "Terms of Service", href: "/policies/terms-of-service" },
  { label: "Shipping Policy", href: "/policies/shipping-policy" },
  { label: "Refund Policy", href: "/policies/refund-policy" },
  { label: "Press", href: "/policies/press" },
];
const HELP_LINKS = [
  { label: "Track Order", href: "/track" },
  { label: "My Orders", href: "/account/orders" },
  { label: "FAQ", href: "/#faq" },
];
const CHROMELESS_ROUTES = ["/signin"];


// Video reviews, compressed copies of the originals in public/images/videos.
// Mixed lengths (20s / 30s), alternated so neighbours differ.
const VIDEOS = [
  { n: 1, duration: "0:20" },
  { n: 2, duration: "0:30" },
  { n: 3, duration: "0:20" },
  { n: 4, duration: "0:30" },
].map((v) => ({
  ...v,
  src: `/images/videos/web/review-${v.n}.mp4`,
  poster: `/images/videos/web/review-${v.n}.jpg`,
  label: `Video review ${v.n}`,
}));

export default function Footer() {
  const pathname = usePathname();
  if (CHROMELESS_ROUTES.some((r) => pathname?.startsWith(r))) return null;

  return (
    <footer className="overflow-hidden bg-accent text-dark">
      {/* Statement */}
      <div className="container-lux pb-10 pt-14 text-center lg:pt-16">
        <p className="text-hero mx-auto max-w-[900px] !text-[clamp(2rem,3.74vw,3.25rem)]">
          Real reviews.
          <br />
          On camera.
        </p>
        <Link
          href="/shop"
          className="mt-5 inline-flex h-8 items-center border border-dark px-4 text-[0.6875rem] font-bold uppercase tracking-[-0.01em] transition-colors duration-300 hover:bg-dark hover:text-accent"
        >
          See the range
        </Link>
      </div>

      {/* Video review reel — plays one clip at a time, centred. */}
      <VideoReel clips={VIDEOS} />

      {/* Newsletter + links. Side padding matches the header exactly: the
          bar's outer gutter (px-2 / lg:px-3) plus its inner padding
          (px-3 / lg:px-8) = 20px / 44px, so footer content lines up with the
          nav links above. */}
      <div className="px-5 py-14 lg:px-11 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <NewsletterForm />
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-7 lg:col-start-6">
            <FooterCol
              title="Explore"
              links={FOOTER_LINKS.map((l) => ({ label: l.label, href: l.href }))}
            />
            <FooterCol title="Our Range" links={RANGE_LINKS} />
            <FooterCol title="Help" links={HELP_LINKS} />
            <FooterCol title="Legal" links={LEGAL_LINKS} />
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t !border-dark/20 pt-6 text-[0.75rem]">
          <a href={`mailto:${CONTACT.email}`} className="link-underline">
            {CONTACT.email}
          </a>
          <p>© {new Date().getFullYear()} Novera. All rights reserved.</p>
        </div>

        {/* Research-use disclaimer — a legal requirement, kept prominent. */}
        <div className="mt-6 bg-dark px-5 py-4 text-background">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.04em] text-accent">
            Research use only
          </p>
          <p className="mt-1.5 text-[0.75rem] leading-relaxed text-background/75">
            {DISCLAIMER}
          </p>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    { kind: "idle" } | { kind: "loading" } | { kind: "success"; msg: string } | { kind: "error"; msg: string }
  >({ kind: "idle" });

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
            source: "novera_footer",
            website: "",
          },
        }
      );
      setStatus({
        kind: "success",
        msg: res.already_subscribed
          ? "You're already on the list, thank you."
          : "Thanks you're on the list.",
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
    <div className="max-w-sm">
      <p className="font-serif text-[1.25rem] leading-snug">
        Subscribe for new batch releases, lab reports and first look at new
        lines.
      </p>
      <form
        onSubmit={onSubmit}
        className="mt-4 flex items-center border !border-dark"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Your email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-dark placeholder-dark/55 focus:outline-none"
          autoComplete="email"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="shrink-0 px-4 py-2.5 text-[0.75rem] font-bold uppercase tracking-[-0.01em] text-dark transition-colors duration-300 hover:bg-dark hover:text-accent disabled:opacity-70"
        >
          {isLoading ? "…" : "Sign up"}
        </button>
      </form>
      <p
        aria-live="polite"
        className={`mt-2 min-h-4 text-xs ${
          status.kind === "error" ? "text-red-700" : "text-dark"
        }`}
      >
        {status.kind === "success" || status.kind === "error" ? status.msg : ""}
      </p>
    </div>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="mb-4 text-[0.6875rem] font-bold uppercase tracking-[0.04em]">
        {title}
      </p>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.label}>
            {/* next/link, not a bare <a> — these are internal routes. */}
            <Link
              href={l.href}
              className="link-underline font-serif text-[0.9375rem] text-dark"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
