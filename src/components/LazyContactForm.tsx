"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// ContactForm pulls in Zod + RHF + Turnstile loader — ~100KB. Defer the chunk
// download until the visitor scrolls within 300px of the section, so above-
// the-fold metrics aren't dragged down by code that may never run.
const ContactForm = dynamic(
  () => import("@/components/ContactForm").then((m) => ({ default: m.ContactForm })),
  { ssr: false, loading: () => <FormSkeleton /> },
);

function FormSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="space-y-4 rounded-2xl border border-brand-line bg-white/40 p-8"
    >
      <div className="h-12 rounded-xl bg-brand-line/50" />
      <div className="h-12 rounded-xl bg-brand-line/50" />
      <div className="h-32 rounded-xl bg-brand-line/50" />
      <div className="h-12 w-32 rounded-full bg-brand-line/50" />
    </div>
  );
}

export function LazyContactForm() {
  const [shouldMount, setShouldMount] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sentinelRef}>
      {shouldMount ? <ContactForm /> : <FormSkeleton />}
    </div>
  );
}
