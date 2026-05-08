"use client";

import {
  Coffee,
  Focus,
  Pause,
  Play,
  RotateCcw,
  Timer,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Phase = "work" | "break";

const DURATIONS: Record<Phase, number> = {
  work: 25 * 60,
  break: 5 * 60,
};

type TimerState = {
  phase: Phase;
  remaining: number;
  running: boolean;
  completed: number;
};

const INITIAL_STATE: TimerState = {
  phase: "work",
  remaining: DURATIONS.work,
  running: false,
  completed: 0,
};

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function PomodoroTimer() {
  const [state, setState] = useState<TimerState>(INITIAL_STATE);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!state.running) {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setState((prev) => {
        if (prev.remaining > 1) {
          return { ...prev, remaining: prev.remaining - 1 };
        }
        // Phase complete — flip to next phase atomically
        const nextPhase: Phase = prev.phase === "work" ? "break" : "work";
        return {
          phase: nextPhase,
          remaining: DURATIONS[nextPhase],
          running: prev.running,
          completed:
            prev.phase === "work" ? prev.completed + 1 : prev.completed,
        };
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.running]);

  function toggleRunning() {
    setState((prev) => ({ ...prev, running: !prev.running }));
  }

  function reset() {
    setState(INITIAL_STATE);
  }

  function skip() {
    setState((prev) => {
      const nextPhase: Phase = prev.phase === "work" ? "break" : "work";
      return {
        ...prev,
        phase: nextPhase,
        remaining: DURATIONS[nextPhase],
      };
    });
  }

  const total = DURATIONS[state.phase];
  const progress = 1 - state.remaining / total;
  const RADIUS = 78;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const ringColor = state.phase === "work" ? "#00e5c9" : "#18454a";

  return (
    <div className="rounded-2xl border border-brand-line bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted">
          <Timer className="size-3.5" /> Pomodoro · 25 / 5
        </div>
        <div className="text-xs text-brand-muted">
          <span className="font-semibold text-brand-ink">
            {state.completed}
          </span>{" "}
          completed
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-md flex-col items-center">
        <div
          className={`mb-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
            state.phase === "work"
              ? "border-brand-teal/30 bg-brand-teal/5 text-brand-teal"
              : "border-brand-accent/30 bg-brand-accent/10 text-brand-teal"
          }`}
        >
          {state.phase === "work" ? (
            <>
              <Focus className="size-3" />
              Focus
            </>
          ) : (
            <>
              <Coffee className="size-3" />
              Break
            </>
          )}
        </div>

        <div className="relative">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="block"
            aria-hidden="true"
          >
            <circle
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              stroke="rgba(24,69,74,0.1)"
              strokeWidth="6"
            />
            <circle
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              stroke={ringColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 100 100)"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-live="polite"
          >
            <span className="font-mono text-5xl font-semibold tracking-tight tabular-nums text-brand-ink">
              {formatTime(state.remaining)}
            </span>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={toggleRunning}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-teal px-6 text-sm font-medium text-brand-canvas transition-colors hover:bg-brand-ink"
          >
            {state.running ? (
              <>
                <Pause className="size-4" /> Pause
              </>
            ) : (
              <>
                <Play className="size-4" /> Start
              </>
            )}
          </button>
          <button
            type="button"
            onClick={skip}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-brand-line bg-white px-5 text-sm font-medium text-brand-ink transition-colors hover:border-brand-teal/40 hover:bg-brand-teal/5"
          >
            Skip phase
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="Reset"
            className="inline-flex size-11 items-center justify-center rounded-full border border-brand-line bg-white text-brand-muted transition-colors hover:border-brand-teal/40 hover:bg-brand-teal/5 hover:text-brand-ink"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>

      <p className="mt-8 border-t border-brand-line pt-5 text-xs leading-relaxed text-brand-muted">
        SVG ring driven by stroke-dashoffset, single combined state object,
        plain JS interval. Same primitives power any progress UI — onboarding
        wizards, file uploads, deployment status, multi-step forms.
      </p>
    </div>
  );
}
