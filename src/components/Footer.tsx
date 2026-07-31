"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Reveal from "./Reveal";
import { NAV_LINKS, CONTACT, DISCLAIMER } from "@/lib/data";
import { api, ApiError } from "@/lib/api";

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
const CHROMELESS_ROUTES = ["/signin"];

export default function Footer() {
  const pathname = usePathname();
  if (CHROMELESS_ROUTES.some((r) => pathname?.startsWith(r))) return null;

  return (
    <footer className="bg-background-secondary border-t border-line">
      <div className="container-lux py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="min-w-0 lg:col-span-4">
            <Reveal>
              <p className="font-sans font-semibold uppercase text-3xl lg:text-4xl leading-none tracking-[0.22em] text-dark">
                Novera
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-muted mt-6 max-w-sm leading-relaxed">
                Research-grade peptides for laboratory analysis  clean, reliable,
                and precisely made.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <NewsletterForm />
            </Reveal>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-2 lg:col-start-6">
            <FooterCol
              title="Explore"
              links={NAV_LINKS.map((l) => ({ label: l.label, href: l.href }))}
            />
          </div>
          <div className="lg:col-span-2 lg:col-start-8">
            <FooterCol title="Our Range" links={RANGE_LINKS} />
          </div>
          <div className="lg:col-span-3 lg:col-start-10">
            <FooterCol title="Legal" links={LEGAL_LINKS} />
          </div>
        </div>

        {/* Contact + bottom row */}
        <div className="mt-20 pt-10 border-t border-line grid md:grid-cols-2 gap-8 items-start">
          <div>
            <p className="eyebrow mb-3">Contact</p>
            <p className="text-muted leading-relaxed">
              <a href={`mailto:${CONTACT.email}`} className="link-underline">
                {CONTACT.email}
              </a>
            </p>
          </div>
          <div className="md:text-right text-sm text-muted">
            <p>© {new Date().getFullYear()} Novera. All rights reserved.</p>
          </div>
        </div>

        {/* Compliance note */}
        <p className="mt-10 text-[0.72rem] leading-relaxed text-muted/80 max-w-3xl">
          {DISCLAIMER}
        </p>
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
    <div className="mt-9 max-w-sm">
      <p className="eyebrow mb-3">Newsletter</p>
      <form
        onSubmit={onSubmit}
        className="relative flex items-center rounded-full border border-line bg-card focus-within:border-olive transition-colors"
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
          placeholder="Your email address"
          className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-dark placeholder-muted/70 focus:outline-none"
          autoComplete="email"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="shrink-0 rounded-full bg-dark px-5 py-2.5 my-1 mr-1 text-[0.72rem] uppercase tracking-[0.16em] font-medium text-background hover:bg-olive transition-colors duration-500 disabled:opacity-70"
        >
          {isLoading ? "…" : "Subscribe"}
        </button>
      </form>
      <p
        aria-live="polite"
        className={`mt-3 text-xs min-h-4 ${
          status.kind === "error" ? "text-red-600" : "text-olive"
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
      <p className="eyebrow mb-6">{title}</p>
      <ul className="flex flex-col gap-4">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="link-underline text-muted hover:text-dark transition-colors duration-500"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
