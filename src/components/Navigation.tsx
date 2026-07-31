"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS } from "@/lib/data";
import { useCart } from "./cart/CartContext";

const CHROMELESS_ROUTES = ["/signin"];

const EASE = [0.16, 1, 0.3, 1] as const;

function CartButton({ onClick }: { onClick?: () => void }) {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      onClick={onClick}
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-500 hover:bg-dark/5"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M6 6h15l-1.5 9h-12L5 3H2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
      </svg>
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-olive px-1 text-[0.65rem] font-medium text-background"
        >
          {count}
        </span>
      )}
    </Link>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const hidden = CHROMELESS_ROUTES.some((r) => pathname?.startsWith(r));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll behind the mobile overlay.
  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [open]);

  // Escape closes the overlay, and focus moves into it on open / back to the
  // burger on close — otherwise a keyboard user is left on a button hidden
  // behind a full-screen dialog.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    burgerRef.current?.focus();
  };

  if (hidden) return null;

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`transition-[background-color,backdrop-filter,border-color,padding] duration-[600ms] ${
            scrolled
              ? "bg-background/70 backdrop-blur-xl border-b border-line"
              : "bg-transparent border-b border-transparent"
          }`}
        >
          <nav
            aria-label="Primary"
            className="container-lux flex items-center justify-between gap-8 py-5"
          >
            {/* Logo */}
            <Link
              href="/"
              aria-label="Novera — home"
              className="font-sans font-semibold uppercase text-lg md:text-xl tracking-[0.26em] leading-none text-dark"
            >
              Novera
            </Link>

            {/* Desktop links */}
            <ul className="hidden lg:flex items-center gap-10 text-sm text-muted">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={pathname === l.href ? "page" : undefined}
                    className="link-underline hover:text-dark transition-colors duration-500 aria-[current=page]:text-dark"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Shop CTA + Cart + burger */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/shop"
                className="btn-lux !py-2.5 !px-6 !text-[0.68rem] hidden sm:inline-flex"
              >
                Shop
              </Link>
              <Link
                href="/signin"
                className="hidden sm:inline-flex text-sm text-muted hover:text-dark transition-colors duration-500"
              >
                Sign in
              </Link>
              <CartButton />
              <button
                ref={burgerRef}
                type="button"
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen(true)}
                className="lg:hidden -mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px]"
              >
                <span aria-hidden="true" className="block h-px w-6 bg-dark" />
                <span aria-hidden="true" className="block h-px w-6 bg-dark" />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-2xl lg:hidden"
          >
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="h-full"
            >
              <div className="container-lux flex items-center justify-between py-5">
                <span className="font-sans font-semibold uppercase text-lg tracking-[0.26em]">
                  Novera
                </span>
                <button
                  ref={closeRef}
                  type="button"
                  aria-label="Close menu"
                  onClick={closeMenu}
                  className="relative h-11 w-11"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-2 top-1/2 h-px w-7 bg-dark rotate-45"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-2 top-1/2 h-px w-7 bg-dark -rotate-45"
                  />
                </button>
              </div>

              <div className="container-lux mt-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
                >
                  <Link
                    href="/shop"
                    onClick={closeMenu}
                    className="btn-lux !py-3.5 !px-8"
                  >
                    Shop
                  </Link>
                </motion.div>
              </div>

              <ul className="container-lux mt-8 flex flex-col gap-2">
                {NAV_LINKS.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.2 + i * 0.07,
                      duration: 0.6,
                      ease: EASE,
                    }}
                  >
                    <Link
                      href={l.href}
                      onClick={closeMenu}
                      className="font-serif text-5xl sm:text-6xl py-3 block leading-tight"
                    >
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.6, ease: EASE }}
                >
                  <Link
                    href="/signin"
                    onClick={closeMenu}
                    className="font-serif text-5xl sm:text-6xl py-3 block leading-tight"
                  >
                    Sign in
                  </Link>
                </motion.li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
