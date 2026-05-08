"use client";

import { Music } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// 4×4 grid of pentatonic notes — sounds harmonious in any combination, so even
// random taps don't sound bad.
type Pad = { freq: number; label: string; key: string };

const PADS: Pad[] = [
  { freq: 261.63, label: "C4", key: "1" },
  { freq: 293.66, label: "D4", key: "2" },
  { freq: 329.63, label: "E4", key: "3" },
  { freq: 392.0, label: "G4", key: "4" },

  { freq: 440.0, label: "A4", key: "q" },
  { freq: 523.25, label: "C5", key: "w" },
  { freq: 587.33, label: "D5", key: "e" },
  { freq: 659.25, label: "E5", key: "r" },

  { freq: 783.99, label: "G5", key: "a" },
  { freq: 880.0, label: "A5", key: "s" },
  { freq: 1046.5, label: "C6", key: "d" },
  { freq: 1174.66, label: "D6", key: "f" },

  { freq: 1318.51, label: "E6", key: "z" },
  { freq: 1567.98, label: "G6", key: "x" },
  { freq: 1760.0, label: "A6", key: "c" },
  { freq: 2093.0, label: "C7", key: "v" },
];

export function SynthPad() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const [active, setActive] = useState<Set<string>>(new Set());
  const [armed, setArmed] = useState(false);

  const ensureAudio = useCallback(() => {
    if (audioCtxRef.current) return audioCtxRef.current;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.18;
    master.connect(ctx.destination);
    audioCtxRef.current = ctx;
    masterGainRef.current = master;
    return ctx;
  }, []);

  const playPad = useCallback(
    (pad: Pad) => {
      const ctx = ensureAudio();
      const master = masterGainRef.current;
      if (!master) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.value = pad.freq;

      filter.type = "lowpass";
      filter.frequency.value = Math.min(pad.freq * 6, 8000);
      filter.Q.value = 0.5;

      // ADSR-ish envelope, short and bell-like
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.7, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      osc.connect(filter).connect(gain).connect(master);
      osc.start(now);
      osc.stop(now + 1.5);

      setArmed(true);
      setActive((prev) => {
        const next = new Set(prev);
        next.add(pad.key);
        return next;
      });
      window.setTimeout(() => {
        setActive((prev) => {
          const next = new Set(prev);
          next.delete(pad.key);
          return next;
        });
      }, 240);
    },
    [ensureAudio],
  );

  useEffect(() => {
    const isTypingTarget = (t: EventTarget | null): boolean => {
      if (!(t instanceof HTMLElement)) return false;
      const tag = t.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      return t.isContentEditable;
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (isTypingTarget(e.target)) return;
      const k = e.key.toLowerCase();
      const pad = PADS.find((p) => p.key === k);
      if (pad) {
        e.preventDefault();
        playPad(pad);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [playPad]);

  return (
    <div className="rounded-2xl border border-brand-line bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted">
          <Music className="size-3.5" /> Synth pad · pentatonic
        </div>
        <div className="text-xs text-brand-muted">
          {armed
            ? "Tap pads or use keyboard 1234 / qwer / asdf / zxcv"
            : "Tap any pad to wake the audio engine."}
        </div>
      </div>

      <div className="mx-auto mt-6 grid max-w-lg grid-cols-4 gap-2 sm:gap-3">
        {PADS.map((pad) => {
          const isActive = active.has(pad.key);
          return (
            <button
              key={pad.key}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                playPad(pad);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                playPad(pad);
              }}
              className={`group relative aspect-square overflow-hidden rounded-xl border transition-all duration-150 ${
                isActive
                  ? "border-brand-accent/70 bg-brand-accent/15 shadow-[0_0_24px_rgba(0,229,201,0.4)]"
                  : "border-brand-line bg-gradient-to-br from-white to-brand-canvas-soft hover:border-brand-teal/35 hover:bg-brand-teal/5"
              }`}
              aria-label={`Play ${pad.label}`}
            >
              <span
                className={`absolute left-2 top-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  isActive ? "text-brand-teal" : "text-brand-muted"
                }`}
              >
                {pad.key.toUpperCase()}
              </span>
              <span
                className={`absolute right-2 bottom-2 text-xs font-semibold tabular-nums transition-colors ${
                  isActive ? "text-brand-teal" : "text-brand-ink/70"
                }`}
              >
                {pad.label}
              </span>
              {isActive ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-brand-accent/50"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <p className="mt-6 border-t border-brand-line pt-5 text-xs leading-relaxed text-brand-muted">
        Pure Web Audio API — no samples, no audio files. Each tap synthesises a
        triangle wave through a low-pass filter with a short bell envelope. The
        same primitives power any in-browser audio tool we&rsquo;d build for a
        client.
      </p>
    </div>
  );
}
