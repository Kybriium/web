import type { Metadata } from "next";

import { Approach } from "@/components/sections/Approach";
import { Manifesto } from "@/components/sections/Manifesto";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Studio",
  description: `How ${site.name} thinks about software, who we build for, and why we work the way we do.`,
  alternates: { canonical: "/studio" },
};

export default function StudioPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-8 sm:px-10 sm:pt-32 sm:pb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-teal">
          Studio
        </p>
        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.025em] text-brand-ink sm:text-5xl md:text-6xl">
          How we think about software.
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-brand-muted sm:text-lg">
          A small UK studio building the systems UK businesses run on. Fixed
          price, end-to-end, calm. Here&rsquo;s the philosophy that drives
          everything we ship — and the way we operate to make sure it
          survives the contract.
        </p>
      </section>

      <Manifesto />
      <Approach />
    </main>
  );
}
