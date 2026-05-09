import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reverse-proxy Umami so tracker blockers don't kill stats. The browser only
  // sees same-origin /stats/* URLs; the actual fetch to cloud.umami.is happens
  // server-side from Vercel's edge.
  async rewrites() {
    return [
      {
        source: "/stats/script.js",
        destination: "https://cloud.umami.is/script.js",
      },
      {
        source: "/stats/api/send",
        destination: "https://cloud.umami.is/api/send",
      },
    ];
  },
};

export default nextConfig;
