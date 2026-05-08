import {
  AppWindow,
  Network,
  Server,
  ShieldCheck,
  Wrench,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/ui/SectionHeading";

type Capability = {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

const capabilities: Capability[] = [
  {
    number: "01",
    icon: Workflow,
    title: "Automate your business processes",
    description:
      "Replace the manual work that's eating your team's day. Sales follow-ups, scheduling, invoicing, data syncing between tools, AI-assisted drafting — built once, runs every day.",
  },
  {
    number: "02",
    icon: AppWindow,
    title: "Build websites and web apps",
    description:
      "Marketing sites that load fast and rank, custom CRMs, internal tools, dashboards, multi-tenant platforms. Whatever the system needs to do — we've built something close before.",
  },
  {
    number: "03",
    icon: Wrench,
    title: "Improve what you already have",
    description:
      "Audit, fix, extend. Performance issues, broken integrations, missing features, weak SEO, dated design. We can lift an existing site or tool without a full rebuild.",
  },
];

type SupportService = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const supportServices: SupportService[] = [
  {
    icon: Server,
    title: "The boring infrastructure — handled.",
    description:
      "Hosting, domain set-up, security patches, ongoing maintenance — the stuff a non-technical team shouldn't have to think about. If something breaks at 9pm on a Sunday, that's our problem, not yours.",
  },
  {
    icon: ShieldCheck,
    title: "Plain-English on the technical jargon.",
    description:
      "GDPR, HIPAA, end-to-end encryption, multi-tenant architecture, public/private keys, data residency — we explain in plain English what your project actually needs, and what you can safely leave to us.",
  },
  {
    icon: Network,
    title: "Many devices, big teams — coordinated.",
    description:
      "Phones, tablets, desktops, kiosks, IoT sensors — synchronised. Big teams on the same workflow — without colliding. Real-time state, role-based access, the boring details that make multi-device, multi-user systems actually work at scale.",
  },
];

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 sm:px-10 sm:py-32"
    >
      <SectionHeading
        id="services"
        eyebrow="What we do"
        title="Automate, build, and improve."
        intro="Three lanes we know inside out — straight to the point."
      />

      {/* Modernized capability cards */}
      <div className="mt-14 grid gap-6 md:grid-cols-3" data-reveal-stagger>
        {capabilities.map(
          ({ number, icon: Icon, title, description }) => (
            <article
              key={number}
              className="surface-card group relative overflow-hidden rounded-2xl p-7 sm:p-8"
            >
              {/* Hover bloom in corner */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br from-brand-accent/20 via-brand-accent/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />

              <div className="relative flex h-full flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-teal/15 to-brand-teal/5 text-brand-teal ring-1 ring-brand-teal/10 transition-all duration-300 group-hover:ring-brand-teal/30">
                    <Icon className="size-6" />
                  </div>
                  <span
                    aria-hidden="true"
                    className="text-xs font-semibold tracking-[0.2em] text-brand-muted"
                  >
                    {number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold leading-snug tracking-[-0.01em] text-brand-ink">
                  {title}
                </h3>
                <p className="text-[15px] leading-relaxed text-brand-muted">
                  {description}
                </p>
              </div>
            </article>
          ),
        )}
      </div>

      {/* Supporting services — three callouts for non-technical readers */}
      <div className="mt-6 grid gap-6 md:grid-cols-3" data-reveal-stagger>
        {supportServices.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex items-start gap-4 rounded-2xl border border-brand-teal/20 bg-brand-teal/5 p-6 sm:gap-5 sm:p-7"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-teal text-brand-canvas">
              <Icon className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-[-0.01em] text-brand-ink sm:text-[17px]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted sm:text-[15px]">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
