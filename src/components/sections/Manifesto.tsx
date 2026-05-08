export function Manifesto() {
  return (
    <section
      id="manifesto"
      aria-labelledby="manifesto-heading"
      className="mx-auto max-w-3xl scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32"
    >
      <header data-reveal>
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-brand-teal">
          Where the value is
        </p>
        <h2
          id="manifesto-heading"
          className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.025em] text-brand-ink sm:text-5xl md:text-6xl"
        >
          Pretty pages are the easy part.
        </h2>
      </header>

      <div
        data-reveal
        className="mt-12 space-y-7 text-[17px] leading-relaxed text-brand-ink sm:text-lg"
      >
        <p>
          Today, anyone with a Figma file and a template can sell you a
          beautiful website. The price tag UK studios put on that work bears
          little relation to what&rsquo;s actually involved. If a polished
          homepage is all you need, fair enough — there are cheaper places to
          get one.
        </p>

        <p className="text-brand-ink/90">
          The work that earns its fee is the work you don&rsquo;t see:
        </p>

        <ul className="space-y-3 border-l-2 border-brand-teal/40 pl-6 text-[16px] leading-relaxed text-brand-ink/90 sm:text-[17px]">
          <li>Understanding the actual problem you&rsquo;re trying to solve.</li>
          <li>
            Knowing how the system needs to sell, retain, and automate — not
            just how it should look.
          </li>
          <li>
            Building something that still works in two years, when somebody
            else has to touch it.
          </li>
          <li>
            Making it load on a budget Android in a coffee shop, not just on a
            5K monitor in our studio.
          </li>
          <li>Testing it properly before anyone else sees it.</li>
        </ul>

        <p>
          Sometimes the right answer is small — a single page, an off-the-shelf
          integration, a static export. Studios that bill by the hour have a
          quiet incentive to invent complexity. We don&rsquo;t. If your project
          doesn&rsquo;t need a custom CMS, a multi-tenant backend, or a
          twelve-week engagement, we&rsquo;ll tell you and quote it accordingly.
        </p>
      </div>

      <figure
        data-reveal
        className="relative my-16 border-y border-brand-line py-12 text-center sm:my-20 sm:py-16"
      >
        <span
          aria-hidden="true"
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-canvas px-4 text-xs font-semibold uppercase tracking-[0.32em] text-brand-teal/60"
        >
          ·
        </span>
        <blockquote className="text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.025em] text-brand-teal sm:text-4xl md:text-5xl">
          Beautiful is cheap.
          <span className="block text-brand-ink">Solved is rare.</span>
        </blockquote>
      </figure>

      <div
        data-reveal
        className="space-y-7 text-[17px] leading-relaxed text-brand-ink sm:text-lg"
      >
        <p>
          We started Kybrium to help UK small businesses get the software they
          should have had five years ago. The automations that never happened.
          The internal tools still living in spreadsheets. The local sites that
          haven&rsquo;t been touched since 2019.
        </p>

        <p>
          Especially small businesses and early-stage studios — the people who
          need this most and have been priced out the longest. Our job is to
          make these tools accessible, not to sell visuals at a mark-up.
        </p>
      </div>
    </section>
  );
}
