"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";

// Stylised silhouette of Great Britain — hand-tuned for the demo, not
// cartographically precise. Filled subtly so the dotted bg shows through.
const GB_PATH =
  "M 51 18 C 53 17 57 18 59 22 C 60 26 58 29 56 31 C 60 34 64 38 63 42 C 61 46 63 50 65 53 C 64 57 62 61 64 65 C 66 67 69 70 68 75 C 67 79 70 82 71 87 C 73 91 75 96 76 102 C 76 108 74 113 70 115 C 64 117 58 116 53 114 C 50 113 47 112 49 109 C 51 107 54 108 56 109 C 53 105 49 102 47 97 C 45 93 46 89 50 87 C 53 86 55 88 55 84 C 51 81 48 78 49 73 C 50 70 52 68 49 65 C 46 62 44 57 47 53 C 50 50 47 46 49 42 C 51 38 49 34 51 30 C 53 26 51 22 51 18 Z";

const NI_PATH =
  "M 30 73 C 33 71 38 72 40 76 C 42 80 39 83 35 82 C 31 81 28 77 30 73 Z";

type City = {
  id: string;
  name: string;
  x: number;
  y: number;
  labelSide: "left" | "right";
  population: string;
  sectors: string;
};

const cities: City[] = [
  { id: "edinburgh", name: "Edinburgh", x: 62, y: 44, labelSide: "right", population: "~488,000", sectors: "Finance, tourism, biotech" },
  { id: "glasgow", name: "Glasgow", x: 54, y: 47, labelSide: "left", population: "~635,000", sectors: "Engineering, finance" },
  { id: "newcastle", name: "Newcastle", x: 66, y: 63, labelSide: "right", population: "~300,000", sectors: "Tech, retail, education" },
  { id: "belfast", name: "Belfast", x: 35, y: 77, labelSide: "right", population: "~346,000", sectors: "Tech, manufacturing" },
  { id: "leeds", name: "Leeds", x: 65, y: 75, labelSide: "right", population: "~789,000", sectors: "Finance, retail" },
  { id: "manchester", name: "Manchester", x: 58, y: 79, labelSide: "left", population: "~555,000", sectors: "Media, tech, finance" },
  { id: "liverpool", name: "Liverpool", x: 52, y: 81, labelSide: "left", population: "~498,000", sectors: "Maritime, retail" },
  { id: "birmingham", name: "Birmingham", x: 58, y: 93, labelSide: "right", population: "~1,140,000", sectors: "Manufacturing, finance" },
  { id: "cambridge", name: "Cambridge", x: 70, y: 101, labelSide: "right", population: "~146,000", sectors: "Tech, biotech, research" },
  { id: "cardiff", name: "Cardiff", x: 50, y: 110, labelSide: "left", population: "~362,000", sectors: "Public sector, media" },
  { id: "bristol", name: "Bristol", x: 56, y: 109, labelSide: "right", population: "~467,000", sectors: "Aerospace, tech" },
  { id: "london", name: "London", x: 68, y: 111, labelSide: "right", population: "~9,000,000", sectors: "Finance, tech, creative" },
];

export function UkMapDemo() {
  const [activeId, setActiveId] = useState<string>("cambridge");
  const active = cities.find((c) => c.id === activeId) ?? cities[0]!;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
      <div className="relative overflow-hidden rounded-2xl border border-brand-line bg-gradient-to-br from-white to-brand-canvas-soft p-4 sm:p-6">
        <svg
          viewBox="20 12 60 110"
          className="aspect-[3/5] h-auto w-full"
          role="img"
          aria-label="Map of the United Kingdom with selectable cities"
        >
          <defs>
            <pattern
              id="uk-bg-dots"
              width="2"
              height="2"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="0.18" fill="rgba(24,69,74,0.12)" />
            </pattern>
          </defs>

          {/* Dot-grid bg — covers the whole viewBox subtly */}
          <rect x="20" y="12" width="60" height="110" fill="url(#uk-bg-dots)" />

          {/* UK silhouettes */}
          <path
            d={GB_PATH}
            fill="rgba(24,69,74,0.08)"
            stroke="rgba(24,69,74,0.35)"
            strokeWidth="0.35"
            strokeLinejoin="round"
          />
          <path
            d={NI_PATH}
            fill="rgba(24,69,74,0.08)"
            stroke="rgba(24,69,74,0.35)"
            strokeWidth="0.35"
            strokeLinejoin="round"
          />

          {/* Cities */}
          {cities.map((city) => {
            const isActive = city.id === activeId;
            const labelX =
              city.labelSide === "left" ? city.x - 1.2 : city.x + 1.2;
            return (
              <g
                key={city.id}
                role="button"
                tabIndex={0}
                aria-label={city.name}
                className="cursor-pointer outline-none focus-visible:[&_circle:nth-of-type(2)]:stroke-brand-accent focus-visible:[&_circle:nth-of-type(2)]:stroke-[0.2]"
                onClick={() => setActiveId(city.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveId(city.id);
                  }
                }}
              >
                {/* Generous invisible hit area for touch */}
                <circle cx={city.x} cy={city.y} r="3.5" fill="transparent" />

                {isActive ? (
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="1.8"
                    fill="rgba(0,229,201,0.28)"
                  >
                    <animate
                      attributeName="r"
                      values="1.5;2.6;1.5"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.45;0;0.45"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                ) : null}

                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isActive ? 0.95 : 0.7}
                  fill={isActive ? "#00e5c9" : "#18454a"}
                  className="transition-all duration-200"
                />

                <text
                  x={labelX}
                  y={city.y + 0.5}
                  fontSize="1.9"
                  fill={isActive ? "#18454a" : "rgba(24,69,74,0.6)"}
                  textAnchor={city.labelSide === "left" ? "end" : "start"}
                  className="pointer-events-none select-none transition-colors duration-200"
                  style={{ fontWeight: isActive ? 600 : 400 }}
                >
                  {city.name}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="mt-4 text-xs text-brand-muted">
          Tap a city. Stylised silhouette; population figures are rounded ONS
          mid-2021 estimates and illustrative.
        </p>
      </div>

      <div className="rounded-2xl border border-brand-line bg-white p-7 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted">
          <MapPin className="size-3.5" /> United Kingdom
        </div>
        <h3 className="mt-4 text-2xl font-semibold tracking-[-0.01em] text-brand-ink sm:text-3xl">
          {active.name}
        </h3>
        <dl className="mt-6 space-y-5 text-sm leading-relaxed">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-muted">
              Population
            </dt>
            <dd className="mt-1.5 text-brand-ink">{active.population}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-muted">
              Notable sectors
            </dt>
            <dd className="mt-1.5 text-brand-ink">{active.sectors}</dd>
          </div>
        </dl>
        <div className="mt-7 border-t border-brand-line pt-5 text-xs leading-relaxed text-brand-muted">
          The same pattern powers any geographic dashboard — assets, customers,
          deliveries, support cases — all clickable, all bound to a data panel.
        </div>
      </div>
    </div>
  );
}
