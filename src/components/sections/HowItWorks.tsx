import {
  MessageCircle,
  PenLine,
  Rocket,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/ui/SectionHeading";

type Step = {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    number: "01",
    icon: PenLine,
    title: "Tell us what you need",
    description:
      "Fill in the form with a few sentences about what you're trying to build, fix, or automate. Most fields are optional — write what you can.",
  },
  {
    number: "02",
    icon: MessageCircle,
    title: "We discuss the details",
    description:
      "We reply within one business day, ask the questions that matter, and get clear on scope, timeline, and a fixed price.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Free demo of the smallest piece",
    description:
      "Before any money changes hands, we build a small representative piece — a landing page, a working dashboard panel, a sample integration — so you see exactly what you'd be paying for.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "You pay, we finish — and we keep it running",
    description:
      "Fixed price agreed up front. We build the rest, ship it, and stay on hand to host and maintain it for as long as you want us to.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32"
    >
      <SectionHeading
        id="how-it-works"
        eyebrow="How it works"
        title="Four steps. Fixed-price."
        intro="From your first message to a working system. No mystery in the middle."
      />

      <ol
        className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        data-reveal-stagger
      >
        {/* Connecting dashed timeline — visible only in gaps on lg */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 z-0 hidden -translate-y-1/2 lg:block"
        >
          <div className="h-px border-t border-dashed border-brand-teal/30" />
        </div>

        {steps.map(({ number, icon: Icon, title, description }) => (
          <li
            key={number}
            className="surface-card group relative z-10 overflow-hidden rounded-2xl p-7 sm:p-8"
          >
            {/* Hover bloom in corner */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br from-brand-accent/20 via-brand-accent/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />

            <div className="relative flex h-full flex-col gap-5">
              <div className="flex items-start justify-between gap-3">
                <span
                  aria-hidden="true"
                  className="bg-gradient-to-br from-brand-teal to-brand-teal/40 bg-clip-text text-5xl font-semibold leading-none tracking-tight text-transparent sm:text-6xl"
                >
                  {number}
                </span>
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-teal/15 to-brand-teal/5 text-brand-teal ring-1 ring-brand-teal/10 transition-all duration-300 group-hover:ring-brand-teal/30">
                  <Icon className="size-5" />
                </div>
              </div>
              <h3 className="text-lg font-semibold leading-snug tracking-[-0.01em] text-brand-ink">
                {title}
              </h3>
              <p className="text-[15px] leading-relaxed text-brand-muted">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
