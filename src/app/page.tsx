import { CaseStudies } from "@/components/sections/CaseStudies";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Services } from "@/components/sections/Services";
import { StudioTeaser } from "@/components/sections/StudioTeaser";

export default function Page() {
  return (
    <main>
      <Hero />
      <Services />
      <HowItWorks />
      <CaseStudies />
      <StudioTeaser />
      <Contact />
    </main>
  );
}
