"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { captureAttribution } from "@/lib/attribution";

// Captures utm_* params on every (re-)mount and on soft-nav. Mounted in the
// root layout so a visit to /?utm_source=facebook still sticks even if the
// visitor wanders to /studio before opening the contact modal.
export function AttributionTracker() {
  const pathname = usePathname();
  useEffect(() => {
    captureAttribution();
  }, [pathname]);
  return null;
}
