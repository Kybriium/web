"use client";

import { Calculator, TrendingUp } from "lucide-react";
import { useState } from "react";

const WEEKS_PER_YEAR = 50;

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-GB").format(Math.round(n));
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

type SliderProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  onChange: (value: number) => void;
};

function Slider({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  onChange,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm text-brand-ink">
          {label}
        </label>
        <span className="text-base font-semibold tabular-nums text-brand-teal">
          {prefix}
          {formatNumber(value)}
          {suffix}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="mt-3 h-1 w-full cursor-pointer appearance-none rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50"
        style={{
          background: `linear-gradient(to right, var(--color-brand-teal) 0%, var(--color-brand-teal) ${pct}%, rgba(24,69,74,0.15) ${pct}%, rgba(24,69,74,0.15) 100%)`,
        }}
      />
    </div>
  );
}

export function RoiCalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(8);
  const [hourlyCost, setHourlyCost] = useState(35);
  const [teamSize, setTeamSize] = useState(3);

  const hoursSavedPerYear = hoursPerWeek * WEEKS_PER_YEAR * teamSize;
  const moneySavedPerYear = hoursSavedPerYear * hourlyCost;

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
      <div className="space-y-7 rounded-2xl border border-brand-line bg-white p-7 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted">
          <Calculator className="size-3.5" /> Inputs
        </div>

        <Slider
          id="roi-hours"
          label="Hours per person, per week, on this task"
          value={hoursPerWeek}
          min={1}
          max={40}
          suffix=" h"
          onChange={setHoursPerWeek}
        />
        <Slider
          id="roi-rate"
          label="Hourly cost (incl. overheads)"
          value={hourlyCost}
          min={15}
          max={150}
          prefix="£"
          suffix=" / h"
          onChange={setHourlyCost}
        />
        <Slider
          id="roi-team"
          label="Team members affected"
          value={teamSize}
          min={1}
          max={50}
          onChange={setTeamSize}
        />

        <p className="border-t border-brand-line pt-5 text-xs leading-relaxed text-brand-muted">
          Same maths every operations director runs in their head. Slide the
          values to see the year-on-year cost of leaving a task manual.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-brand-teal-deep p-7 text-brand-canvas shadow-[0_30px_60px_-30px_rgba(14,46,50,0.6)] sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 70% at 100% 0%, rgba(0,229,201,0.18), transparent 60%)",
          }}
        />
        <div className="relative space-y-7">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            <TrendingUp className="size-3.5" /> If automated
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-canvas/55">
              Hours reclaimed per year
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-semibold tracking-[-0.02em] tabular-nums text-brand-canvas sm:text-5xl">
                {formatNumber(hoursSavedPerYear)}
              </span>
              <span className="text-sm text-brand-canvas/60">hours</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-canvas/55">
              Cost reclaimed per year
            </div>
            <div className="mt-2 text-4xl font-semibold tracking-[-0.02em] tabular-nums text-brand-accent sm:text-5xl">
              {formatCurrency(moneySavedPerYear)}
            </div>
          </div>

          <p className="border-t border-brand-canvas/15 pt-5 text-xs leading-relaxed text-brand-canvas/65">
            Rough estimate. Actual savings depend on what&rsquo;s automated, how
            often it runs, and what your team already spends on it. We quote
            against a real audit, not a slider.
          </p>
        </div>
      </div>
    </div>
  );
}
