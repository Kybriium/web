import { LazyContactForm } from "@/components/LazyContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32"
    >
      <SectionHeading
        id="contact"
        eyebrow="Start a project"
        title="Tell us what you're trying to build."
        intro="This helps us scope and price your project accurately. Most fields are optional — fill what you can. We reply within one business day."
      />

      <div
        className="mt-12 grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16"
        data-reveal
      >
        <aside className="space-y-6 text-base leading-relaxed text-brand-ink">
          <p>
            Prefer email? Write directly to{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-medium text-brand-teal underline-offset-4 hover:underline"
            >
              {site.email}
            </a>
            .
          </p>
          <div className="rounded-2xl border border-brand-line bg-white p-6 text-sm leading-relaxed text-brand-muted">
            <p className="text-brand-ink">
              <span className="font-semibold">What happens next.</span>
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>We read your enquiry within one business day.</li>
              <li>We reply with questions or book a 30-minute call.</li>
              <li>You get a fixed-price quote within a week of the call.</li>
            </ol>
          </div>
        </aside>

        <LazyContactForm />
      </div>
    </section>
  );
}
