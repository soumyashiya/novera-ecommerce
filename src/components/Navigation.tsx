"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS } from "@/lib/data";
import { clearSession, getCurrentUser, type ApiUser } from "@/lib/api";
import { useCart } from "./cart/CartContext";
import AnnouncementBar from "./AnnouncementBar";
import MegaMenu from "./MegaMenu";

const CHROMELESS_ROUTES = ["/signin"];

const EASE = [0.16, 1, 0.3, 1] as const;

function CartButton({ onClick }: { onClick?: () => void }) {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      onClick={onClick}
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative inline-flex h-11 min-w-11 items-center justify-center lg:min-w-0"
    >
      <span className="link-underline hidden lg:inline">Bag ({count})</span>
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 lg:hidden"
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
          className="absolute -top-0.5 -right-0.5 flex h-5 min-w-[1.25rem] items-center justify-center bg-dark px-1 text-[0.75rem] font-medium text-background lg:hidden"
        >
          {count}
        </span>
      )}
    </Link>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <circle cx="12" cy="8" r="3.5" />
      <path
        d="M4.5 20c1.4-4.2 4.4-6.4 7.5-6.4s6.1 2.2 7.5 6.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AccountMenu({ user, onLogout }: { user: ApiUser | null; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const itemCls =
    "block w-full px-3.5 py-2.5 text-left text-sm text-dark hover:bg-background transition-colors duration-300";

  return (
    <div className="relative hidden sm:block" ref={rootRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={user ? "Account menu" : "Sign in"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 min-w-11 items-center justify-center font-bold uppercase text-dark lg:min-w-0"
      >
        <span className="link-underline hidden lg:inline">Account</span>
        <span className="lg:hidden">
          <UserIcon />
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={user ? "Account" : "Sign in"}
          className="absolute right-0 mt-2 w-56 border border-line bg-card p-2 normal-case font-normal tracking-normal shadow-[0_20px_60px_-25px_rgba(26,26,26,0.3)]"
        >
          {user && (
            <p className="truncate px-3.5 py-2 text-[0.75rem] uppercase tracking-[-0.005em] text-muted">
              {user.name}
            </p>
          )}
          {user && (
            <Link
              href="/account/orders"
              role="menuitem"
              onClick={() => setOpen(false)}
              className={itemCls}
            >
              My Orders
            </Link>
          )}
          <Link
            href="/track"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={itemCls}
          >
            Track Order
          </Link>
          {user ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className={itemCls}
            >
              Logout
            </button>
          ) : (
            <Link
              href="/signin"
              role="menuitem"
              onClick={() => setOpen(false)}
              className={itemCls}
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [user, setUser] = useState<ApiUser | null>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const hidden = CHROMELESS_ROUTES.some((r) => pathname?.startsWith(r));

  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser());
    syncUser();
    window.addEventListener("novera-auth-change", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("novera-auth-change", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

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

  // Mega menu hover intent: a short delay before opening/closing, so brushing
  // past "Shop" or briefly leaving the panel doesn't flicker it.
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setMegaSoon = (next: boolean) => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    megaTimer.current = setTimeout(() => setMega(next), next ? 90 : 160);
  };
  useEffect(
    () => () => {
      if (megaTimer.current) clearTimeout(megaTimer.current);
    },
    []
  );

  // Mega menu: close on route change and on Escape.
  useEffect(() => setMega(false), [pathname]);
  useEffect(() => {
    if (!mega) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMega(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mega]);

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
        <AnnouncementBar />
        {/* Reference header: a solid yellow bar inset from the viewport edges,
            floating over the hero. Once scrolled, the gutters fill in so page
            content doesn't show through around the bar. */}
        <div
          className={`px-2 pt-2 lg:px-3 lg:pt-4 transition-colors duration-500 ${
            scrolled ? "bg-background" : "bg-transparent"
          }`}
        >
          {/* Wrapper spans the bar and the mega menu, so moving the pointer
              from "Shop" down into the panel doesn't close it. */}
          <div
            className="relative"
            onMouseEnter={() => {
              if (megaTimer.current) clearTimeout(megaTimer.current);
            }}
            onMouseLeave={() => setMegaSoon(false)}
          >
          {/* Three-column grid so the wordmark is optically centred regardless
              of how wide the link list or the icon cluster gets — the
              reference centres its logotype. */}
          <nav
            aria-label="Primary"
            className="grid h-[60px] grid-cols-[1fr_auto_1fr] items-center gap-4 bg-accent px-3 lg:h-[76px] lg:px-8"
          >
            {/* Desktop links (left). "Shop" opens the mega menu on hover or
                keyboard focus; the others close it. */}
            <ul className="hidden lg:flex items-center gap-8 text-[0.875rem] font-bold uppercase tracking-[-0.02em] text-dark">
              {NAV_LINKS.map((l) => {
                const isShop = l.href === "/shop";
                return (
                  <li
                    key={l.href}
                    onMouseEnter={() => setMegaSoon(isShop)}
                    onFocus={() => setMega(isShop)}
                  >
                    <Link
                      href={l.href}
                      aria-current={pathname === l.href ? "page" : undefined}
                      aria-haspopup={isShop ? "true" : undefined}
                      aria-expanded={isShop ? mega : undefined}
                      className={`link-underline aria-[current=page]:underline underline-offset-4 ${
                        isShop && mega ? "underline" : ""
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Burger (left, mobile only) */}
            <button
              ref={burgerRef}
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
              className="lg:hidden -ml-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px] justify-self-start"
            >
              <span aria-hidden="true" className="block h-px w-6 bg-dark" />
              <span aria-hidden="true" className="block h-px w-6 bg-dark" />
            </button>

            {/* Centred wordmark */}
            <Link
              href="/"
              aria-label="Novera — home"
              className="justify-self-center font-serif text-[1.75rem] md:text-[2rem] leading-none tracking-[-0.02em] text-dark"
            >
              Novera
            </Link>

            {/* Text links (right) — the reference uses words, not icons */}
            <div className="flex items-center gap-1 justify-self-end text-[0.875rem] font-bold uppercase tracking-[-0.02em] text-dark lg:gap-8">
              <Link href="/track" className="link-underline hidden lg:inline">
                Track order
              </Link>
              <AccountMenu user={user} onLogout={handleLogout} />
              <CartButton />
            </div>
          </nav>

          {/* Shop mega menu (desktop) */}
          <AnimatePresence>
            {mega && (
              <motion.div
                key="mega"
                // Panel unrolls downward from the bar; content staggers in
                // inside MegaMenu.
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                animate={{ clipPath: "inset(0 0 0% 0)" }}
                exit={{ clipPath: "inset(0 0 100% 0)" }}
                transition={{ duration: 0.5, ease: EASE }}
                className="absolute inset-x-0 top-full hidden bg-accent shadow-[0_24px_40px_-24px_rgba(0,0,0,0.35)] lg:block"
              >
                <MegaMenu onNavigate={() => setMega(false)} />
              </motion.div>
            )}
          </AnimatePresence>
          </div>
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
                <span className="font-sans font-semibold uppercase text-lg tracking-[-0.005em]">
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
                    className="btn-lux !px-8"
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
                {user && (
                  <motion.li
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.6, ease: EASE }}
                  >
                    <Link
                      href="/account/orders"
                      onClick={closeMenu}
                      className="font-serif text-5xl sm:text-6xl py-3 block leading-tight"
                    >
                      My Orders
                    </Link>
                  </motion.li>
                )}
                <motion.li
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.62, duration: 0.6, ease: EASE }}
                >
                  <Link
                    href="/track"
                    onClick={closeMenu}
                    className="font-serif text-5xl sm:text-6xl py-3 block leading-tight"
                  >
                    Track Order
                  </Link>
                </motion.li>
                {user ? (
                  <motion.li
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.69, duration: 0.6, ease: EASE }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      className="font-serif text-5xl sm:text-6xl py-3 block leading-tight text-left"
                    >
                      Logout
                    </button>
                  </motion.li>
                ) : (
                  <motion.li
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.69, duration: 0.6, ease: EASE }}
                  >
                    <Link
                      href="/signin"
                      onClick={closeMenu}
                      className="font-serif text-5xl sm:text-6xl py-3 block leading-tight"
                    >
                      Sign in
                    </Link>
                  </motion.li>
                )}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
