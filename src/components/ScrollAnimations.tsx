"use client";

import { useEffect } from "react";

// Wires up:
//   [data-hero-stage]      — hero load-in stagger (one timeline on mount)
//   [data-reveal]          — fade-up on scroll, batched via ScrollTrigger.batch
//   [data-reveal-stagger]  — direct children fade-up on scroll, staggered, one
//                             ScrollTrigger per parent (not per child)
// Initial-hidden state lives in globals.css; <noscript> in layout.tsx reverses
// it for no-JS users.
export function ScrollAnimations() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      document
        .querySelectorAll<HTMLElement>(
          "[data-reveal], [data-hero-stage], [data-reveal-stagger] > *",
        )
        .forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
      return;
    }

    let ctx: ReturnType<typeof import("gsap").default.context> | null = null;
    let cancelled = false;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Hero load-in (above-the-fold, fires once on mount)
        const heroEls = gsap.utils.toArray<HTMLElement>("[data-hero-stage]");
        if (heroEls.length) {
          gsap.to(heroEls, {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            delay: 0.15,
          });
        }

        // Standalone reveals — one batched ScrollTrigger for all elements
        ScrollTrigger.batch("[data-reveal]", {
          start: "top 85%",
          onEnter: (batch) => {
            gsap.to(batch, {
              y: 0,
              autoAlpha: 1,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: "auto",
            });
          },
        });

        // Stagger groups — one ScrollTrigger per parent (not per child)
        gsap.utils
          .toArray<HTMLElement>("[data-reveal-stagger]")
          .forEach((parent) => {
            const children = parent.querySelectorAll<HTMLElement>(
              ":scope > *",
            );
            if (!children.length) return;
            ScrollTrigger.create({
              trigger: parent,
              start: "top 82%",
              once: true,
              onEnter: () => {
                gsap.to(children, {
                  y: 0,
                  autoAlpha: 1,
                  duration: 0.75,
                  ease: "power3.out",
                  stagger: 0.1,
                  overwrite: "auto",
                });
              },
            });
          });

        ScrollTrigger.refresh();
      });
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return null;
}
