import type { Metadata } from "next";
import { site } from "@/lib/site";

// TODO(launch): this is a reasonable UK-GDPR-aligned baseline drafted to match the
// stack we actually run (Vercel, Resend, Cloudflare Turnstile, Upstash, Umami).
// Have a UK data-protection adviser review before public launch.

export const metadata: Metadata = {
  title: "Privacy notice",
  description: `How ${site.legalName} collects and uses personal data on the ${site.name} website.`,
  alternates: { canonical: "/privacy" },
};

const lastUpdated = "8 May 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 sm:px-10 sm:py-32">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-teal">
          Privacy
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-brand-ink sm:text-5xl">
          Privacy notice
        </h1>
        <p className="mt-4 text-sm text-brand-muted">
          Last updated: {lastUpdated}.
        </p>
        <p className="mt-6 text-base leading-relaxed text-brand-ink">
          This notice explains how {site.legalName} collects and uses personal
          data when you visit {site.url} or send us an enquiry. It is written to
          align with the UK General Data Protection Regulation and the Data
          Protection Act 2018.
        </p>
      </header>

      <article className="mt-12 space-y-10 text-base leading-relaxed text-brand-ink">
        <section>
          <h2 className="text-xl font-semibold tracking-tight text-brand-teal">
            Who we are
          </h2>
          <p className="mt-3">
            {site.name} is a trading name of {site.legalName}, a private company
            limited by shares, registered in England and Wales (company number{" "}
            {site.companyNumber}). Registered office: {site.registeredOffice}.
            The data controller is {site.legalName}. You can contact us at{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-brand-teal underline-offset-4 hover:underline"
            >
              {site.email}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-brand-teal">
            What we collect
          </h2>
          <div className="mt-3 space-y-3">
            <p>
              <span className="font-semibold">Enquiry form.</span> When you
              complete the contact form, we collect the information you provide
              (name, company, work email, project details, and any optional
              context fields you choose to fill).
            </p>
            <p>
              <span className="font-semibold">Operational logs.</span> Our
              hosting provider records short-lived server logs (IP address, user
              agent, request timestamp) for security and operations.
            </p>
            <p>
              <span className="font-semibold">Analytics.</span> We use Umami
              Cloud, a privacy-friendly, cookieless analytics service. Umami
              records aggregate page views without persistent identifiers, and
              we do not track you across sites.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-brand-teal">
            What we do not collect
          </h2>
          <p className="mt-3">
            We do not use Google Analytics, advertising pixels, or session
            replay tools. We do not store marketing or advertising cookies, and
            we do not sell or share personal data with advertisers or data
            brokers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-brand-teal">
            How we use your data
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>To reply to your enquiry, scope work, and prepare a quote.</li>
            <li>To stay in touch during an active or pending engagement.</li>
            <li>
              To prevent abuse of the contact form (rate limiting and bot
              protection).
            </li>
            <li>
              To understand, in aggregate, which pages help visitors find us.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-brand-teal">
            Lawful basis
          </h2>
          <p className="mt-3">
            For enquiries: necessary to take steps you requested prior to a
            contract (UK GDPR Art 6(1)(b)), and our legitimate interests in
            operating our business (Art 6(1)(f)). For abuse prevention and
            analytics: legitimate interests in keeping the site available and
            understanding aggregate use.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-brand-teal">
            Who processes your data on our behalf
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <span className="font-semibold">Vercel</span> — website hosting.
            </li>
            <li>
              <span className="font-semibold">Resend</span> — transmits enquiry
              emails to our inbox.
            </li>
            <li>
              <span className="font-semibold">Cloudflare</span> — bot protection
              (Turnstile) on the contact form.
            </li>
            <li>
              <span className="font-semibold">Upstash</span> — rate-limit
              records (short-lived).
            </li>
            <li>
              <span className="font-semibold">Umami Cloud</span> — aggregate
              analytics with no personal identifiers.
            </li>
          </ul>
          <p className="mt-3">
            Some processors are based outside the UK. Where transfers occur,
            they are protected by adequacy decisions, the UK-US Data Bridge,
            Standard Contractual Clauses, or equivalent mechanisms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-brand-teal">
            Retention
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <span className="font-semibold">Enquiry data:</span> up to 24
              months after our most recent contact with you, then deleted. If
              you become a client, retention is governed by your engagement
              agreement.
            </li>
            <li>
              <span className="font-semibold">Operational logs:</span> typically
              deleted within 30 days.
            </li>
            <li>
              <span className="font-semibold">Rate-limit records:</span> deleted
              within hours.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-brand-teal">
            Your rights
          </h2>
          <p className="mt-3">
            Under UK GDPR you have the right to access your data, correct
            inaccuracies, ask for deletion, restrict or object to processing,
            request portability, and withdraw consent where consent is the
            lawful basis. To exercise any of these, email{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-brand-teal underline-offset-4 hover:underline"
            >
              {site.email}
            </a>
            .
          </p>
          <p className="mt-3">
            You also have the right to complain to the Information
            Commissioner&rsquo;s Office (ICO) at{" "}
            <a
              href="https://ico.org.uk"
              className="text-brand-teal underline-offset-4 hover:underline"
              rel="noopener noreferrer"
            >
              ico.org.uk
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-brand-teal">
            Cookies
          </h2>
          <p className="mt-3">
            The site uses no marketing or analytics cookies. The contact form
            may set a short-lived security cookie when Cloudflare Turnstile is
            invoked. We do not display a cookie banner because we do not use
            non-essential cookies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-brand-teal">
            Changes to this notice
          </h2>
          <p className="mt-3">
            If we change this notice, we will update the date above. Material
            changes will be flagged at the top of this page for at least 30
            days.
          </p>
        </section>
      </article>
    </main>
  );
}
