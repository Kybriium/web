"use client";

import {
  Anchor,
  Bird,
  Cloud,
  Compass,
  Feather,
  Flame,
  Leaf,
  RefreshCw,
  Snowflake,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const ICONS: { id: string; Icon: LucideIcon }[] = [
  { id: "anchor", Icon: Anchor },
  { id: "bird", Icon: Bird },
  { id: "cloud", Icon: Cloud },
  { id: "compass", Icon: Compass },
  { id: "feather", Icon: Feather },
  { id: "flame", Icon: Flame },
  { id: "leaf", Icon: Leaf },
  { id: "snowflake", Icon: Snowflake },
];

type Card = {
  uid: number;
  iconId: string;
  Icon: LucideIcon;
  flipped: boolean;
  matched: boolean;
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function buildDeck(): Card[] {
  const pairs = ICONS.flatMap(({ id, Icon }, i) => [
    { uid: i * 2, iconId: id, Icon, flipped: false, matched: false },
    { uid: i * 2 + 1, iconId: id, Icon, flipped: false, matched: false },
  ]);
  return shuffle(pairs);
}

export function MemoryGame() {
  const [deck, setDeck] = useState<Card[]>(() => buildDeck());
  const [moves, setMoves] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);

  const matchedPairs = useMemo(
    () => deck.filter((c) => c.matched).length / 2,
    [deck],
  );
  const won = matchedPairs === ICONS.length;

  // When two cards are picked, resolve match/no-match
  useEffect(() => {
    if (picked.length !== 2) return;
    const [aIdx, bIdx] = picked;
    const a = deck[aIdx!];
    const b = deck[bIdx!];
    if (!a || !b) return;

    if (a.iconId === b.iconId) {
      // Match — keep flipped
      const t = window.setTimeout(() => {
        setDeck((prev) =>
          prev.map((c, i) =>
            i === aIdx || i === bIdx ? { ...c, matched: true } : c,
          ),
        );
        setPicked([]);
        setMoves((m) => m + 1);
      }, 380);
      return () => window.clearTimeout(t);
    }

    // No match — flip back after a beat
    const t = window.setTimeout(() => {
      setDeck((prev) =>
        prev.map((c, i) =>
          i === aIdx || i === bIdx ? { ...c, flipped: false } : c,
        ),
      );
      setPicked([]);
      setMoves((m) => m + 1);
    }, 800);
    return () => window.clearTimeout(t);
  }, [picked, deck]);

  function flip(index: number) {
    if (picked.length === 2) return;
    const card = deck[index];
    if (!card || card.flipped || card.matched) return;
    setDeck((prev) =>
      prev.map((c, i) => (i === index ? { ...c, flipped: true } : c)),
    );
    setPicked((prev) => [...prev, index]);
  }

  function reset() {
    setDeck(buildDeck());
    setMoves(0);
    setPicked([]);
  }

  return (
    <div className="rounded-2xl border border-brand-line bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted">
          <Sparkles className="size-3.5" /> Memory match
        </div>
        <div className="flex items-center gap-4 text-xs text-brand-muted">
          <span>
            <span className="font-semibold text-brand-ink">{matchedPairs}</span>{" "}
            / {ICONS.length} pairs
          </span>
          <span>
            <span className="font-semibold text-brand-ink">{moves}</span> moves
          </span>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-line px-3 py-1 text-xs font-medium text-brand-ink transition-colors hover:border-brand-teal/40 hover:bg-brand-teal/5"
          >
            <RefreshCw className="size-3" /> Restart
          </button>
        </div>
      </div>

      <div className="mx-auto mt-6 grid max-w-lg grid-cols-4 gap-2 sm:gap-3">
        {deck.map((card, i) => {
          const showFace = card.flipped || card.matched;
          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => flip(i)}
              disabled={card.matched || card.flipped || picked.length === 2}
              aria-label={
                showFace ? `Card showing ${card.iconId}` : "Hidden card"
              }
              className={`group relative aspect-square overflow-hidden rounded-xl border transition-all duration-200 ${
                card.matched
                  ? "border-brand-accent/40 bg-brand-accent/10"
                  : card.flipped
                    ? "border-brand-teal/40 bg-brand-teal/5"
                    : "border-brand-line bg-gradient-to-br from-white to-brand-canvas-soft hover:border-brand-teal/30 hover:bg-brand-teal/5"
              }`}
            >
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                  showFace
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-90 scale-50 opacity-0"
                }`}
              >
                <card.Icon
                  className={`size-7 sm:size-8 ${
                    card.matched ? "text-brand-teal" : "text-brand-teal"
                  }`}
                />
              </span>
              <span
                aria-hidden
                className={`absolute inset-0 flex items-center justify-center text-xs font-semibold tracking-[0.2em] text-brand-muted transition-opacity duration-200 ${
                  showFace ? "opacity-0" : "opacity-100"
                }`}
              >
                ·
              </span>
            </button>
          );
        })}
      </div>

      {won ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-6 rounded-xl border border-brand-accent/30 bg-brand-accent/10 p-4 text-sm text-brand-ink"
        >
          <span className="font-semibold text-brand-teal">Solved.</span> Eight
          pairs in {moves} moves.{" "}
          <button
            type="button"
            onClick={reset}
            className="font-medium text-brand-teal underline-offset-4 hover:underline"
          >
            Play again
          </button>
        </div>
      ) : null}

      <p className="mt-6 border-t border-brand-line pt-5 text-xs leading-relaxed text-brand-muted">
        State held in pure React. The same pattern (selection · resolve · win
        check) underpins booking flows, shopping carts, and form wizards.
      </p>
    </div>
  );
}
