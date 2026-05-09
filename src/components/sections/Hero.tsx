"use client";

import { motion } from "framer-motion";
import { Mail, MoveRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { useContactModal } from "@/components/ContactModal";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

// Defer the three.js bundle so the hero text paints first.
const HeroScene = dynamic(
  () =>
    import("@/components/ui/hero-scene").then((m) => ({
      default: m.HeroScene,
    })),
  { ssr: false, loading: () => null },
);

export function Hero() {
  const { open: openContactModal } = useContactModal();
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["web platforms", "internal tools", "automation"],
    [],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2400);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-brand-teal-deep"
    >
      {/* Ambient gradient bloom — also acts as fallback bg before R3F mounts */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(0,229,201,0.10), transparent 60%), radial-gradient(ellipse 60% 80% at 100% 100%, rgba(24,69,74,0.55), transparent 70%)",
        }}
      />

      {/* 3D scene — full bg on mobile, anchored right of centre on desktop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 lg:left-[30%]"
      >
        <HeroScene />
      </div>

      {/* Left-side fade for text contrast over the scene */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-20"
        style={{
          background:
            "linear-gradient(to right, rgba(14,46,50,0.85) 0%, rgba(14,46,50,0.55) 38%, transparent 68%)",
        }}
      />

      <div className="relative z-30 mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl flex-col items-start justify-center gap-8 px-6 py-24 sm:px-10 sm:py-32">
        <div data-hero-stage>
          <Button asChild variant="secondary" size="sm" className="gap-3">
            <a href="#services">
              What we build <MoveRight className="h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="flex flex-col gap-6" data-hero-stage>
          <h1
            id="hero-heading"
            className="max-w-4xl text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.025em] text-brand-canvas sm:text-6xl md:text-7xl"
          >
            <span className="block">We build</span>
            <span className="relative flex w-full justify-start overflow-hidden md:py-2">
              &nbsp;
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute left-0 font-semibold text-brand-accent"
                  style={{
                    filter:
                      "drop-shadow(0 2px 28px rgba(0,229,201,0.45))",
                  }}
                  initial={{ opacity: 0, y: -100 }}
                  transition={{ type: "spring", stiffness: 50 }}
                  animate={
                    titleNumber === index
                      ? { y: 0, opacity: 1 }
                      : {
                          y: titleNumber > index ? -150 : 150,
                          opacity: 0,
                        }
                  }
                >
                  {title}
                </motion.span>
              ))}
            </span>
            <span className="block">for UK businesses.</span>
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-brand-canvas/75 sm:text-lg md:text-xl">
            A small studio building the software UK businesses run on. Fixed
            price, end-to-end — websites, internal tools, and the automation
            between them.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row" data-hero-stage>
          <Button
            type="button"
            size="lg"
            variant="default"
            className="gap-3"
            onClick={openContactModal}
          >
            Start a project <MoveRight className="h-5 w-5" />
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-3">
            <a href={`mailto:${site.email}`}>
              Email us <Mail className="h-5 w-5" />
            </a>
          </Button>
        </div>

        <div
          className="mt-2 flex items-center gap-3 text-xs text-brand-canvas/65"
          data-hero-stage
        >
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent shadow-[0_0_12px_rgba(0,229,201,0.85)]"
          />
          <span>Cambridgeshire · United Kingdom</span>
        </div>
      </div>
    </section>
  );
}
