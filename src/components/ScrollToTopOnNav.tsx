"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Belt-and-braces: explicitly reset scroll on every pathname change. Next.js
// already does this for forward navigations, but we've seen edge cases when
// the new page renders shorter than the previous one — the visitor lands
// halfway down. Honors hash links (`/#contact`) so they still scroll to anchor.
export function ScrollToTopOnNav() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
