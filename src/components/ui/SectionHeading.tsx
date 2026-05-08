type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  id?: string;
  inverse?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  inverse = false,
}: SectionHeadingProps) {
  const headingId = id ? `${id}-heading` : undefined;
  const eyebrowColor = inverse ? "text-brand-accent" : "text-brand-teal";
  const titleColor = inverse ? "text-brand-canvas" : "text-brand-ink";
  const introColor = inverse ? "text-brand-canvas/75" : "text-brand-muted";

  return (
    <header className="max-w-3xl" data-reveal>
      <p
        className={`mb-5 text-xs font-semibold uppercase tracking-[0.32em] ${eyebrowColor}`}
      >
        {eyebrow}
      </p>
      <h2
        id={headingId}
        className={`text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-4xl md:text-5xl ${titleColor}`}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className={`mt-5 max-w-2xl text-pretty text-base leading-relaxed sm:text-lg ${introColor}`}
        >
          {intro}
        </p>
      ) : null}
    </header>
  );
}
