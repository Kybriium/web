"use client";

import { Activity, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

// Mock UK-listed tickers. Initial prices are illustrative only — the demo
// simulates streaming ticks client-side and is not real market data.
type Stock = {
  symbol: string;
  name: string;
  start: number; // illustrative starting price (pence)
};

const STOCKS: Stock[] = [
  { symbol: "BP",   name: "BP plc",                    start: 482 },
  { symbol: "HSBA", name: "HSBC Holdings",             start: 905 },
  { symbol: "VOD",  name: "Vodafone Group",            start: 75 },
  { symbol: "TSCO", name: "Tesco",                     start: 351 },
  { symbol: "LSEG", name: "London Stock Exchange Grp", start: 11420 },
];

const HISTORY_LENGTH = 28;

type Series = number[]; // most recent on the right

function nextTick(prev: number): number {
  // Random walk with slight mean-reversion bias.
  const pct = (Math.random() - 0.5) * 0.012; // ±0.6%
  return Math.max(1, prev * (1 + pct));
}

function formatPrice(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(pence);
}

function Sparkline({ data, up }: { data: Series; up: boolean }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 32;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  const stroke = up ? "rgb(0,229,201)" : "rgb(239,68,68)";
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="h-8 w-full"
      aria-hidden
    >
      <polyline
        points={pts}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StockTicker() {
  const [series, setSeries] = useState<Record<string, Series>>(() =>
    Object.fromEntries(STOCKS.map((s) => [s.symbol, [s.start]])),
  );
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setSeries((prev) => {
        const next: Record<string, Series> = {};
        for (const s of STOCKS) {
          const arr = prev[s.symbol] ?? [s.start];
          const last = arr[arr.length - 1] ?? s.start;
          const v = nextTick(last);
          const updated = [...arr, v];
          next[s.symbol] =
            updated.length > HISTORY_LENGTH
              ? updated.slice(updated.length - HISTORY_LENGTH)
              : updated;
        }
        return next;
      });
    }, 1500);
    return () => {
      if (intervalRef.current !== null)
        window.clearInterval(intervalRef.current);
    };
  }, []);

  const rows = useMemo(
    () =>
      STOCKS.map((s) => {
        const arr = series[s.symbol] ?? [s.start];
        const current = arr[arr.length - 1] ?? s.start;
        const changePct = ((current - s.start) / s.start) * 100;
        const up = current >= s.start;
        return {
          stock: s,
          current,
          changePct,
          up,
          arr,
        };
      }),
    [series],
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-line bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-line bg-brand-canvas-soft px-6 py-4 sm:px-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted">
          <Activity className="size-3.5" /> Live · simulated stream
        </div>
        <div className="flex items-center gap-2 text-xs text-brand-muted">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-brand-accent" />
          </span>
          Updating every 1.5s
        </div>
      </div>

      <ul className="divide-y divide-brand-line">
        {rows.map(({ stock, current, changePct, up, arr }) => (
          <li
            key={stock.symbol}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4 sm:grid-cols-[auto_1fr_120px_auto] sm:gap-6 sm:px-8 sm:py-5"
          >
            <div>
              <div className="font-mono text-sm font-semibold tracking-tight text-brand-ink sm:text-base">
                {stock.symbol}
              </div>
              <div className="mt-0.5 text-xs text-brand-muted">
                {stock.name}
              </div>
            </div>

            {/* Sparkline — full width on mobile via col-span hack via order */}
            <div className="col-span-3 row-start-2 sm:col-span-1 sm:col-start-3 sm:row-start-1">
              <Sparkline data={arr} up={up} />
            </div>

            <div className="text-right font-mono text-sm tabular-nums text-brand-ink sm:text-base">
              {formatPrice(current)}
              <span className="ml-1 text-xs text-brand-muted">p</span>
            </div>

            <div
              className={`inline-flex items-center justify-end gap-1 text-right text-xs font-semibold tabular-nums sm:text-sm ${
                up ? "text-brand-teal" : "text-red-600"
              }`}
            >
              {up ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}
              {(up ? "+" : "") + changePct.toFixed(2)}%
            </div>
          </li>
        ))}
      </ul>

      <p className="border-t border-brand-line bg-brand-canvas-soft px-6 py-4 text-xs text-brand-muted sm:px-8">
        Demo data — random walk client-side from illustrative starting prices.
        The pattern (subscribe · push · re-render · update sparkline) is the
        same one we&rsquo;d wire to a real WebSocket feed.
      </p>
    </div>
  );
}
