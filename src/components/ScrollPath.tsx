"use client";

import { useEffect, useRef, useState } from "react";

// Asymmetric S-curve drifting through the viewBox. Hand-tuned to feel organic
// rather than mathematically smooth.
const PATH_D =
  "M 40 0 C 66 90, 16 195, 38 295 C 60 395, 18 500, 40 600 C 64 700, 24 770, 40 800";

export function ScrollPath() {
  const pathRef = useRef<SVGPathElement>(null);
  const rafRef = useRef<number | null>(null);
  const [pathLen, setPathLen] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dotPos, setDotPos] = useState({ x: 40, y: 0 });

  // Measure total path length on mount
  useEffect(() => {
    if (pathRef.current) {
      setPathLen(pathRef.current.getTotalLength());
    }
  }, []);

  // Track scroll, throttled via rAF
  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const p =
        docHeight > 0
          ? Math.min(1, Math.max(0, scrollTop / docHeight))
          : 0;
      setProgress(p);
      rafRef.current = null;
    };

    const onScroll = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Move the dot to the leading edge of the drawn portion
  useEffect(() => {
    if (pathRef.current && pathLen > 0) {
      const point = pathRef.current.getPointAtLength(pathLen * progress);
      setDotPos({ x: point.x, y: point.y });
    }
  }, [progress, pathLen]);

  const dashOffset = pathLen * (1 - progress);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 right-0 z-[5] hidden w-16 xl:block"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 80 800"
        preserveAspectRatio="none"
      >
        <defs>
          <filter
            id="scroll-path-glow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="3.5" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient
            id="scroll-path-gradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="rgba(0,229,201,0.05)" />
            <stop offset="50%" stopColor="rgba(0,229,201,0.35)" />
            <stop offset="100%" stopColor="rgba(0,229,201,0.55)" />
          </linearGradient>
        </defs>

        {/* Ghost line — full path at very low opacity, always visible */}
        <path
          d={PATH_D}
          fill="none"
          stroke="rgba(0, 229, 201, 0.06)"
          strokeWidth="1"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Drawn portion — animates via dashoffset */}
        <path
          ref={pathRef}
          d={PATH_D}
          fill="none"
          stroke="url(#scroll-path-gradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={pathLen || undefined}
          strokeDashoffset={dashOffset}
          vectorEffect="non-scaling-stroke"
        />

        {/* Glowing dot at the leading edge */}
        {pathLen > 0 ? (
          <circle
            cx={dotPos.x}
            cy={dotPos.y}
            r="3"
            fill="#00e5c9"
            filter="url(#scroll-path-glow)"
          />
        ) : null}
      </svg>
    </div>
  );
}
