import { SectionHeading } from "@/components/ui/SectionHeading";

export function Approach() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className="relative isolate scroll-mt-24 overflow-hidden bg-brand-teal-deep py-28 sm:py-36"
    >
      {/* Ambient texture for the dark section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 80% 0%, rgba(0,229,201,0.18), transparent 60%), radial-gradient(ellipse 60% 40% at 10% 100%, rgba(0,229,201,0.08), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <SectionHeading
          id="approach"
          eyebrow="How we work"
          title="Calm, careful, fixed-price."
          inverse
        />

        <div
          data-reveal
          className="mt-14 grid gap-12 text-base leading-relaxed text-brand-canvas/85 md:grid-cols-2 sm:text-lg"
        >
          <div className="space-y-6">
            <p>
              We work with a small number of clients at a time. That keeps the
              conversation direct, the decisions small, and the work moving.
              You speak to the people who write the code.
            </p>
            <p>
              Engagements are scoped after a discovery call and quoted at a
              fixed price. No hourly meters, no vague change orders. If scope
              grows, we agree the next slice the same way the first one was
              agreed.
            </p>
          </div>
          <div className="space-y-6">
            <p>
              We host and maintain what we ship. UK-based, registered in
              England and Wales, happy to meet local clients in person. The
              studio runs from{" "}
              <span className="text-brand-accent">Cambridgeshire</span>;
              clients are spread across the United Kingdom.
            </p>
            <p>
              Boring, obvious code wins. The systems we build live for years
              and get touched once a month — often by humans who were not in
              the room when they were written.
            </p>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="mt-20 h-px w-full bg-gradient-to-r from-transparent via-brand-canvas/30 to-transparent"
        />

        <figure
          data-reveal
          className="relative mx-auto mt-16 max-w-4xl text-center"
        >
          <span
            aria-hidden="true"
            className="absolute -top-10 left-1/2 -translate-x-1/2 font-serif text-7xl leading-none text-brand-accent/40"
          >
            &ldquo;
          </span>
          <blockquote className="text-balance text-2xl font-light italic leading-[1.25] tracking-[-0.01em] text-brand-canvas sm:text-3xl md:text-4xl">
            We measure ourselves on the systems still working a year after
            launch — not on what they looked like the day they shipped.
          </blockquote>
        </figure>
      </div>
    </section>
  );
}
