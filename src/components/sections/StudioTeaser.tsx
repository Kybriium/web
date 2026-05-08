import Link from "next/link";

export function StudioTeaser() {
  return (
    <section
      id="studio-teaser"
      aria-labelledby="studio-teaser-heading"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32"
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-16">
        <div data-reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-teal">
            The studio
          </p>
          <h2
            id="studio-teaser-heading"
            className="mt-5 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-brand-ink sm:text-4xl"
          >
            Pretty pages are the easy part.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-brand-muted sm:text-[17px]">
            Anyone with a Figma file can sell you a beautiful website. The work
            that earns its fee is the work you don&rsquo;t see — understanding
            the problem, building it to last, testing it before anyone else
            does.
          </p>
          <Link
            href="/studio"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand-teal hover:text-brand-ink"
          >
            Read our full approach
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        <figure
          data-reveal
          className="relative border-l-2 border-brand-teal/30 pl-8 sm:pl-10"
        >
          <span
            aria-hidden="true"
            className="absolute -left-1 top-0 size-2 -translate-x-1/2 rounded-full bg-brand-accent shadow-[0_0_12px_rgba(0,229,201,0.7)]"
          />
          <blockquote className="text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.025em] text-brand-teal sm:text-4xl md:text-5xl">
            Beautiful is cheap.
            <span className="block text-brand-ink">Solved is rare.</span>
          </blockquote>
          <figcaption className="mt-6 text-xs uppercase tracking-[0.2em] text-brand-muted">
            Studio principle · 01
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
