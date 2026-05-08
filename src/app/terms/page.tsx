import type { Metadata } from "next";
import { site } from "@/lib/site";

// TODO(launch): baseline website terms of use covering use of kybrium.com only.
// Engagement-of-work contracts are separate and supersede this. Have a UK
// commercial adviser review before public launch.

export const metadata: Metadata = {
  title: "Terms of use",
  description: `Terms governing use of the ${site.name} website.`,
  alternates: { canonical: "/terms" },
};

const lastUpdated = "8 May 2026";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 sm:px-10 sm:py-32">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-teal">
          Terms
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-brand-ink sm:text-5xl">
          Terms of use
        </h1>
        <p className="mt-4 text-sm text-brand-muted">
          Last updated: {lastUpdated}.
        </p>
        <p className="mt-6 text-base leading-relaxed text-brand-ink">
          These terms govern your use of {site.url}. They do not govern any
          engagement to deliver work — engagements are set out in a separate
          written agreement that takes precedence over these terms.
        </p>
      </header>

      <article className="mt-12 space-y-10 text-base leading-relaxed text-brand-ink">
        <section>
          <h2 className="text-xl font-semibold tracking-tight text-brand-teal">
            About us
          </h2>
          <p className="mt-3">
            {site.name} is a trading name of {site.legalName}, a private company
            limited by shares, registered in England and Wales (company number{" "}
            {site.companyNumber}). Registered office: {site.registeredOffice}.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-brand-teal">
            Use of this site
          </h2>
          <p className="mt-3">
            You may browse and read this site, share its links, and use the
            contact form to get in touch about a possible engagement. You agree
            not to attempt to disrupt or compromise the site, scrape it at
            unreasonable rates, or impersonate another person.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-brand-teal">
            Accuracy of information
          </h2>
          <p className="mt-3">
            We try to keep the site accurate and up to date, but we provide it
            &ldquo;as is&rdquo; and make no warranties about completeness or
            fitness for any particular purpose. Case studies marked
            &ldquo;Concept&rdquo; describe the kind of work we do, not specific
            delivered engagements, until they are replaced with confirmed
            client work.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-brand-teal">
            Intellectual property
          </h2>
          <p className="mt-3">
            The {site.name} name, design, and content on this site belong to{" "}
            {site.legalName} or its licensors. You may not reproduce them
            without our written permission, except for personal, non-commercial
            reading and short, attributed quotations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-brand-teal">
            Limitation of liability
          </h2>
          <p className="mt-3">
            To the extent permitted by law, we are not liable for any indirect
            or consequential loss arising from your use of this site. Nothing
            in these terms excludes or limits liability that cannot be excluded
            or limited under English law, including liability for death or
            personal injury caused by negligence, or for fraud or fraudulent
            misrepresentation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-brand-teal">
            Governing law
          </h2>
          <p className="mt-3">
            These terms are governed by the laws of England and Wales. Any
            dispute relating to these terms will be subject to the exclusive
            jurisdiction of the courts of England and Wales.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-brand-teal">
            Contact
          </h2>
          <p className="mt-3">
            <a
              href={`mailto:${site.email}`}
              className="text-brand-teal underline-offset-4 hover:underline"
            >
              {site.email}
            </a>
          </p>
        </section>
      </article>
    </main>
  );
}
