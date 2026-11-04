"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { CONTACT, DISCLAIMER, PRODUCTS } from "@/lib/data";

const STORAGE_KEY = "novera:contact-submissions";

/* ---- inline icons ---- */
const IconMail = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconArrow = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CHANNELS = [
  {
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    Icon: IconMail,
  },
];

const inputCls =
  "w-full bg-transparent border-b border-background/25 py-3 text-background placeholder-background/35 focus:border-accent focus:outline-none transition-colors duration-300";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    product: "General enquiry",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const existing = JSON.parse(
        window.localStorage.getItem(STORAGE_KEY) ?? "[]"
      ) as unknown[];
      const list = Array.isArray(existing) ? existing : [];
      list.push({ ...form, submittedAt: new Date().toISOString() });
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      console.error("[contact] failed to persist submission:", err);
    }
    setSent(true);
  };

  const closeModal = () => {
    setSent(false);
    setForm({
      name: "",
      email: "",
      product: "General enquiry",
      message: "",
    });
  };

  useEffect(() => {
    if (!sent) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sent]);

  return (
    <section id="contact" className="on-ink section-band section-pad bg-dark text-background">
      <div className="container-lux">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left — heading + channels */}
          <div className="min-w-0 lg:col-span-5">
            <Reveal>
              <p className="eyebrow mb-6 text-accent">Get in Touch</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-serif font-light text-[clamp(2.4rem,6.05vw,4.4rem)] leading-[1.05] tracking-tight">
                Let&apos;s talk
                <br />
                <span className="italic">orders</span> &amp; answers.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 text-background/70 max-w-md leading-relaxed">
                Email us with your requirements and we&apos;ll get back to you
                promptly quantities, strengths, and timelines welcome.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-col gap-3">
                {CHANNELS.map(({ label, value, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    className="group contact-channel flex items-center gap-4 border p-4 transition-[border-color,background-color,transform] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:-translate-y-0.5 hover:bg-background/[0.04]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-background/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.75rem] tracking-[-0.005em] uppercase text-background/45">
                        {label}
                      </span>
                      <span className="block text-background mt-0.5 break-words">{value}</span>
                    </span>
                    <IconArrow className="ml-auto h-5 w-5 text-background/40 transition-all duration-500 group-hover:text-accent group-hover:translate-x-1" />
                  </a>
                ))}
              </div>
            </Reveal>

          </div>

          {/* Right — contact form */}
          <div className="min-w-0 lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.15}>
              <form
                onSubmit={submit}
                className=" border border-background/15 bg-background/[0.03] p-7 lg:p-9"
              >
                <div className="flex items-center gap-2.5 mb-8 text-sm text-background/70">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                  </span>
                  Enquiries answered promptly by email
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <Field label="Full name">
                    <input
                      required
                      name="name"
                      autoComplete="name"
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Your name"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      required
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="you@email.com"
                      className={inputCls}
                    />
                  </Field>
                </div>

                <div className="mt-6">
                  <Field label="Product interest">
                    <select
                      value={form.product}
                      onChange={set("product")}
                      className={`${inputCls} appearance-none cursor-pointer`}
                    >
                      <option className="text-dark">General enquiry</option>
                      {PRODUCTS.map((p) => (
                        <option key={p.name} className="text-dark">
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="mt-6">
                  <Field label="Message">
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={set("message")}
                      placeholder="Tell us what you need quantities, strengths, timelines…"
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                </div>

                <button
                  type="submit"
                  className="btn-lux btn-invert mt-9 w-full justify-center"
                >
                  Send Message
                  <IconArrow className="h-4 w-4" />
                </button>

                <p className="mt-5 text-[0.8125rem] leading-relaxed text-background/40">
                  {DISCLAIMER}
                </p>
              </form>
            </Reveal>
          </div>
        </div>
      </div>

      {sent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-sent-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/50 backdrop-blur-sm p-4"
        >
          <div className="relative w-full max-w-md overflow-hidden border border-line bg-card p-8 text-center shadow-[0_40px_80px_-20px_rgba(83,96,82,0.35)]">
            <div className="mx-auto grid h-16 w-16 place-items-center bg-copper text-background">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 12l5 5L20 7" />
              </svg>
            </div>

            <h3
              id="contact-sent-title"
              className="mt-6 font-serif text-3xl tracking-[-0.02em] text-dark"
            >
              Submitted successfully
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-muted">
              Thanks — we&apos;ve received your message and will get back to you
              shortly.
            </p>

            <button
              type="button"
              onClick={closeModal}
              className="btn-lux mt-7 w-full justify-center"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[0.75rem] tracking-[-0.005em] uppercase text-background/45 mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}
