// Thin wrapper around Umami's track API. Safe-by-default: if Umami isn't
// loaded (blocker, no env var, network failure) we silently skip rather than
// throw. Custom events surface in the dashboard's Events panel and can be
// used as funnel steps alongside automatic page views.

declare global {
  interface Window {
    umami?: {
      track: (
        eventName: string,
        eventData?: Record<string, unknown>,
      ) => void;
    };
  }
}

export function track(
  eventName: string,
  eventData?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(eventName, eventData);
  } catch {
    // Umami not loaded or API surface changed — never let analytics break UX.
  }
}
