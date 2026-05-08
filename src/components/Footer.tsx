import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-brand-line/60 bg-brand-canvas">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-teal"
            >
              {site.name}
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-muted">
              {site.tagline} A studio based in {site.region}, {site.country}.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-ink">
              Studio
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-brand-muted">
              <li>
                <Link
                  href="/#services"
                  className="transition-colors hover:text-brand-ink"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/#case-studies"
                  className="transition-colors hover:text-brand-ink"
                >
                  Case studies
                </Link>
              </li>
              <li>
                <Link
                  href="/studio"
                  className="transition-colors hover:text-brand-ink"
                >
                  Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/examples"
                  className="transition-colors hover:text-brand-ink"
                >
                  Examples
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="transition-colors hover:text-brand-ink"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-ink">
              Get in touch
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-brand-muted">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-brand-ink"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-brand-ink">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-brand-ink">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-brand-line/60 pt-8 text-xs leading-relaxed text-brand-muted">
          <p>
            {site.name} is a trading name of {site.legalName}, a private company limited by
            shares, registered in England and Wales (company number {site.companyNumber}).
            Registered office: {site.registeredOffice}.
          </p>
          <p className="mt-3">© {year} {site.legalName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
