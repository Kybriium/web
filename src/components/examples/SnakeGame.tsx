"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Gamepad2,
  RefreshCw,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from "react";

const COLS = 22;
const ROWS = 16;
const TICK_MS = 130;

type Vec = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";

const DIR_VECTORS: Record<Dir, Vec> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITES: Record<Dir, Dir> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

function randomFood(snake: Vec[]): Vec {
  while (true) {
    const candidate = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
    if (!snake.some((s) => s.x === candidate.x && s.y === candidate.y)) {
      return candidate;
    }
  }
}

function initialSnake(): Vec[] {
  const cy = Math.floor(ROWS / 2);
  const cx = Math.floor(COLS / 2);
  return [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
  ];
}

export function SnakeGame() {
  const [snake, setSnake] = useState<Vec[]>(() => initialSnake());
  const [food, setFood] = useState<Vec>(() => ({
    x: Math.floor(COLS * 0.7),
    y: Math.floor(ROWS / 2),
  }));
  const [dir, setDir] = useState<Dir>("right");
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  // Keep latest values in refs so the tick loop always reads fresh state
  const dirRef = useRef(dir);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const queuedDirRef = useRef<Dir | null>(null);

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);
  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);
  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  const reset = useCallback(() => {
    const fresh = initialSnake();
    setSnake(fresh);
    setFood(randomFood(fresh));
    setDir("right");
    queuedDirRef.current = null;
    setScore(0);
    setOver(false);
    setRunning(true);
  }, []);

  const turn = useCallback((next: Dir) => {
    const current = queuedDirRef.current ?? dirRef.current;
    if (next === current || next === OPPOSITES[current]) return;
    queuedDirRef.current = next;
    if (!snakeRef.current.length) return;
  }, []);

  // Game tick
  useEffect(() => {
    if (!running || over) return;
    const id = window.setInterval(() => {
      const queued = queuedDirRef.current;
      const currentDir = queued ?? dirRef.current;
      if (queued) {
        setDir(queued);
        queuedDirRef.current = null;
      }
      const v = DIR_VECTORS[currentDir];
      const head = snakeRef.current[0]!;
      const newHead = { x: head.x + v.x, y: head.y + v.y };

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= COLS ||
        newHead.y < 0 ||
        newHead.y >= ROWS
      ) {
        setOver(true);
        setRunning(false);
        setBest((b) => Math.max(b, score));
        return;
      }

      // Self collision
      if (
        snakeRef.current.some(
          (s, i) => i < snakeRef.current.length - 1 && s.x === newHead.x && s.y === newHead.y,
        )
      ) {
        setOver(true);
        setRunning(false);
        setBest((b) => Math.max(b, score));
        return;
      }

      const ate =
        newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;
      const nextSnake = ate
        ? [newHead, ...snakeRef.current]
        : [newHead, ...snakeRef.current.slice(0, -1)];
      setSnake(nextSnake);
      if (ate) {
        setFood(randomFood(nextSnake));
        setScore((s) => s + 1);
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [running, over, score]);

  // Keyboard
  useEffect(() => {
    const isTypingTarget = (t: EventTarget | null): boolean => {
      if (!(t instanceof HTMLElement)) return false;
      const tag = t.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      return t.isContentEditable;
    };

    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      const key = e.key.toLowerCase();
      const map: Record<string, Dir> = {
        arrowup: "up",
        arrowdown: "down",
        arrowleft: "left",
        arrowright: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };
      const next = map[key];
      if (!next) return;
      e.preventDefault();
      turn(next);
      if (!running && !over) setRunning(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turn, running, over]);

  // Touch / swipe
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: ReactTouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: ReactTouchEvent) => {
    const start = touchStartRef.current;
    if (!start) return;
    const t = e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const threshold = 24;
    if (Math.max(absX, absY) < threshold) return;
    if (absX > absY) turn(dx > 0 ? "right" : "left");
    else turn(dy > 0 ? "down" : "up");
    if (!running && !over) setRunning(true);
    touchStartRef.current = null;
  };

  return (
    <div className="rounded-2xl border border-brand-line bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted">
          <Gamepad2 className="size-3.5" /> Snake
        </div>
        <div className="flex items-center gap-4 text-xs text-brand-muted">
          <span>
            <span className="font-semibold text-brand-ink">{score}</span> score
          </span>
          <span>
            <span className="font-semibold text-brand-ink">{best}</span> best
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

      <div
        className="relative mx-auto mt-6 max-w-2xl overflow-hidden rounded-xl bg-brand-teal-deep p-3 select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <svg
          viewBox={`0 0 ${COLS} ${ROWS}`}
          className="aspect-[22/16] h-auto w-full"
          role="img"
          aria-label={`Snake game, score ${score}`}
        >
          <defs>
            <pattern
              id="snake-grid"
              width="1"
              height="1"
              patternUnits="userSpaceOnUse"
            >
              <rect
                width="1"
                height="1"
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.04"
              />
            </pattern>
          </defs>
          <rect width={COLS} height={ROWS} fill="url(#snake-grid)" />

          {/* Food */}
          <circle
            cx={food.x + 0.5}
            cy={food.y + 0.5}
            r="0.32"
            fill="#00e5c9"
          >
            <animate
              attributeName="r"
              values="0.28;0.4;0.28"
              dur="1.4s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Snake */}
          {snake.map((seg, i) => (
            <rect
              key={`${seg.x}-${seg.y}-${i}`}
              x={seg.x + 0.05}
              y={seg.y + 0.05}
              width="0.9"
              height="0.9"
              rx="0.18"
              fill={i === 0 ? "#f7f3ea" : "rgba(247,243,234,0.8)"}
            />
          ))}
        </svg>

        {!running && !over ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-brand-teal-deep/70 text-center">
            <div>
              <p className="text-sm font-semibold text-brand-canvas">
                Press a key, swipe, or tap a direction to start
              </p>
              <p className="mt-1 text-xs text-brand-canvas/70">
                Arrows / WASD on desktop · swipe or D-pad on touch
              </p>
            </div>
          </div>
        ) : null}

        {over ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-brand-teal-deep/85 text-center">
            <div>
              <p className="text-base font-semibold text-brand-canvas">
                Game over
              </p>
              <p className="mt-1 text-xs text-brand-canvas/75">
                Score {score} · best {Math.max(best, score)}
              </p>
              <button
                type="button"
                onClick={reset}
                className="pointer-events-auto mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-brand-canvas px-5 text-xs font-medium text-brand-teal-deep hover:bg-white"
              >
                <RefreshCw className="size-3" /> Play again
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* On-screen D-pad */}
      <div className="mt-5 grid grid-cols-3 gap-2 sm:max-w-xs sm:mx-auto">
        <div />
        <DpadButton label="Up" onPress={() => turn("up")}>
          <ArrowUp className="size-4" />
        </DpadButton>
        <div />
        <DpadButton label="Left" onPress={() => turn("left")}>
          <ArrowLeft className="size-4" />
        </DpadButton>
        <DpadButton
          label={running ? "Pause" : over ? "Restart" : "Start"}
          onPress={() => {
            if (over) reset();
            else setRunning((r) => !r);
          }}
        >
          <Gamepad2 className="size-4" />
        </DpadButton>
        <DpadButton label="Right" onPress={() => turn("right")}>
          <ArrowRight className="size-4" />
        </DpadButton>
        <div />
        <DpadButton label="Down" onPress={() => turn("down")}>
          <ArrowDown className="size-4" />
        </DpadButton>
        <div />
      </div>

      <p className="mt-6 border-t border-brand-line pt-5 text-xs leading-relaxed text-brand-muted">
        SVG renderer + a 130 ms tick loop + a queued-direction buffer to
        prevent reverse-into-self. Same loop pattern works for any real-time
        UI — dashboards, telemetry, anything that needs to repaint on a clock.
      </p>
    </div>
  );
}

function DpadButton({
  children,
  onPress,
  label,
}: {
  children: React.ReactNode;
  onPress: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onPress}
      className="inline-flex h-10 items-center justify-center rounded-lg border border-brand-line bg-white text-brand-ink transition-colors hover:border-brand-teal/40 hover:bg-brand-teal/5"
    >
      {children}
    </button>
  );
}
