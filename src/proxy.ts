import { NextResponse } from "next/server";

// Security headers per CLAUDE.md §9. Note v1 uses 'unsafe-inline' for script-src
// to keep the JSON-LD inline script and Next runtime working without nonce
// threading. Tighten to a per-request nonce once the site has more usage.
//
// 'unsafe-eval' is added in development only — React dev mode uses eval() for
// stack reconstruction. Production React never calls eval().
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = [
  "script-src 'self' 'unsafe-inline'",
  isDev ? "'unsafe-eval'" : "",
  "https://challenges.cloudflare.com https://cloud.umami.is https://*.umami.is",
]
  .filter(Boolean)
  .join(" ");

const csp = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://challenges.cloudflare.com https://api.resend.com https://cloud.umami.is https://*.umami.is",
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

export function proxy() {
  const response = NextResponse.next();

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );

  return response;
}

export const config = {
  matcher: [
    // Match every path except Next internal assets and metadata files we serve raw.
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|opengraph-image|.well-known).*)",
  ],
};
