"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useContactModal } from "@/components/ContactModal";

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

  return (
    <header className="sticky top-0 z-50 border-b border-brand-line/40 bg-brand-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 sm:px-10">
        <Link
          href="/"
          aria-label="Kybrium home"
          className={`relative text-sm font-semibold uppercase tracking-[0.28em] transition-colors ${
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
                className={`relative py-1 text-sm transition-colors duration-200 ${
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

        <button
          type="button"
          onClick={openContactModal}
          className="group inline-flex h-10 items-center justify-center rounded-full bg-brand-teal px-5 text-sm font-medium text-brand-canvas transition-colors duration-200 hover:bg-brand-ink"
        >
          Start a project
          <span
            aria-hidden="true"
            className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        </button>
      </div>
    </header>
  );
}
