"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useContactModal } from "@/components/ContactModal";
import { site } from "@/lib/site";

const navLinks = [
  { href: "/studio", label: "Studio" },
  { href: "/examples", label: "Examples" },
];

function isActiveRoute(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const { open: openContactModal } = useContactModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Auto-close the mobile menu on route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Esc closes the menu + body scroll lock while open.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-line/40 bg-brand-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4 sm:gap-6 sm:px-10">
        <Link
          href="/"
          aria-label="Kybrium home"
          className={`relative inline-flex min-h-[44px] items-center text-sm font-semibold uppercase tracking-[0.28em] transition-colors ${
            isActiveRoute(pathname, "/")
              ? "text-brand-teal"
              : "text-brand-teal/85 hover:text-brand-teal"
          }`}
        >
          Kybrium
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 sm:flex"
        >
          {navLinks.map((link) => {
            const active = isActiveRoute(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative inline-flex min-h-[44px] items-center px-1 text-sm transition-colors duration-200 ${
                  active
                    ? "text-brand-ink"
                    : "text-brand-muted hover:text-brand-ink"
                }`}
              >
                {link.label}
                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(0,229,201,0.7)]"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openContactModal}
            className="group inline-flex h-10 items-center justify-center rounded-full bg-brand-teal px-4 text-sm font-medium text-brand-canvas transition-colors duration-200 hover:bg-brand-ink sm:px-5"
          >
            Start a project
            <span
              aria-hidden="true"
              className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </button>

          {/* Mobile hamburger — paired pill matching the CTA's height/shape so
              the two read as a unit. Desktop nav above handles >=640px. */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-teal/25 bg-brand-canvas text-brand-ink transition-colors hover:border-brand-teal/50 hover:bg-brand-line/40 focus:outline-none focus:ring-2 focus:ring-brand-accent/40 sm:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex"
                >
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex"
                >
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Full-screen mobile menu — portalled to document.body so it sits
          past the Hero's WebGL canvas in DOM order. WebGL canvases get
          promoted to their own GPU compositor layer, and on some browsers
          (notably mobile Safari) those layers can render above fixed
          elements regardless of z-index. Portal + DOM order solves it. */}
      {mounted
        ? createPortal(
            <AnimatePresence initial={false}>
              {menuOpen ? (
                <motion.div
                  id="mobile-nav"
                  aria-label="Primary"
                  role="dialog"
                  aria-modal="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="fixed inset-0 z-[60] flex flex-col bg-brand-teal-deep sm:hidden"
                  style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
                >
                  {/* Top toolbar — wordmark + close, both 40px tall */}
                  <div className="relative z-10 flex items-center justify-between px-6 py-4">
                    <span className="inline-flex h-10 items-center text-sm font-semibold uppercase tracking-[0.28em] text-brand-canvas">
                      {site.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMenuOpen(false)}
                      aria-label="Close menu"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-canvas/20 bg-brand-canvas/5 text-brand-canvas transition-colors hover:border-brand-accent/60 hover:bg-brand-canvas/10 hover:text-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Ambient gradient bloom for depth */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage:
                        "radial-gradient(ellipse 90% 60% at 100% 0%, rgba(0,229,201,0.10), transparent 60%), radial-gradient(ellipse 80% 50% at 0% 100%, rgba(24,69,74,0.55), transparent 70%)",
                    }}
                  />

                  <nav
                    aria-label="Primary"
                    className="relative flex flex-1 flex-col px-6 pt-10"
                  >
                    {navLinks.map((link, i) => {
                      const active = isActiveRoute(pathname, link.href);
                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{
                            duration: 0.32,
                            delay: 0.08 + i * 0.07,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <Link
                            href={link.href}
                            aria-current={active ? "page" : undefined}
                            className={`group flex items-baseline justify-between border-b border-brand-canvas/15 py-6 text-4xl font-semibold tracking-[-0.02em] transition-colors ${
                              active
                                ? "text-brand-accent"
                                : "text-brand-canvas hover:text-brand-accent"
                            }`}
                          >
                            <span>{link.label}</span>
                            <span
                              aria-hidden="true"
                              className="text-2xl text-brand-canvas/40 transition-all duration-200 group-hover:translate-x-1 group-hover:text-brand-accent"
                            >
                              →
                            </span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: 0.32 }}
                    className="relative border-t border-brand-canvas/15 px-6 py-8"
                    style={{
                      paddingBottom:
                        "calc(env(safe-area-inset-bottom, 0px) + 32px)",
                    }}
                  >
                    <a
                      href={`mailto:${site.email}`}
                      className="block text-base text-brand-canvas transition-colors hover:text-brand-accent"
                    >
                      {site.email}
                    </a>
                    <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-brand-canvas/55">
                      <span
                        aria-hidden="true"
                        className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent shadow-[0_0_10px_rgba(0,229,201,0.85)]"
                      />
                      <span>
                        {site.region} · {site.country}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </header>
  );
}
