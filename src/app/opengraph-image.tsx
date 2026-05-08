import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#18454a",
          color: "#f7f3ea",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            opacity: 0.9,
          }}
        >
          {site.name}
        </div>

        <div
          style={{
            fontSize: 84,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            maxWidth: 980,
          }}
        >
          {site.tagline}
        </div>

        <div
          style={{
            fontSize: 22,
            opacity: 0.75,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>A UK software studio · Cambridgeshire</span>
          <span>{site.legalName} · {site.companyNumber}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
