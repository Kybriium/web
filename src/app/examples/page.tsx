import type { Metadata } from "next";

import { DataTable } from "@/components/examples/DataTable";
import { KanbanBoard } from "@/components/examples/KanbanBoard";
import { MemoryGame } from "@/components/examples/MemoryGame";
import { PomodoroTimer } from "@/components/examples/PomodoroTimer";
import { RoiCalculator } from "@/components/examples/RoiCalculator";
import { SnakeGame } from "@/components/examples/SnakeGame";
import { StockTicker } from "@/components/examples/StockTicker";
import { SynthPad } from "@/components/examples/SynthPad";
import { UkMapDemo } from "@/components/examples/UkMapDemo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Examples",
  description: `Live, interactive demos of the kinds of components ${site.name} builds — none of them are client work, all of them are real code running in your browser.`,
  alternates: { canonical: "/examples" },
};

type Demo = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  Component: () => React.ReactElement;
};

const demos: Demo[] = [
  {
    id: "uk-map",
    number: "01",
    eyebrow: "Geographic data viz",
    title: "An interactive map of the UK.",
    description:
      "Click any city to bind a side panel to it. The same pattern powers any geographic dashboard — assets, deliveries, support cases, customers — all selectable and bound to live data.",
    Component: UkMapDemo,
  },
  {
    id: "roi",
    number: "02",
    eyebrow: "Computation + form UX",
    title: "An automation ROI calculator.",
    description:
      "Three sliders, real-time output, sensible defaults. The maths every operations director runs in their head — visible, scrubable, and honest about its limitations.",
    Component: RoiCalculator,
  },
  {
    id: "synth",
    number: "03",
    eyebrow: "Web Audio + interaction",
    title: "A 16-pad synthesiser.",
    description:
      "Pentatonic, so any tap order sounds musical. No samples, no audio files — every note is synthesised in the browser via the Web Audio API. Triangle wave, low-pass filter, bell-shape envelope.",
    Component: SynthPad,
  },
  {
    id: "ticker",
    number: "04",
    eyebrow: "Real-time streams",
    title: "A live UK stock ticker.",
    description:
      "Five LSE-listed companies on a simulated tick stream. Sparklines redraw on every push; up/down direction tinted accent or red. The same render path drops onto a real WebSocket feed without changing the UI.",
    Component: StockTicker,
  },
  {
    id: "memory",
    number: "05",
    eyebrow: "State + interaction",
    title: "Memory match.",
    description:
      "Eight pairs, no library, all state in pure React. Selection · resolve · win-check is the same shape every booking flow, shopping cart, and form wizard runs.",
    Component: MemoryGame,
  },
  {
    id: "snake",
    number: "06",
    eyebrow: "Game loop + input",
    title: "Snake.",
    description:
      "Classic. Keyboard arrows or WASD, swipe gestures on touch, plus an on-screen D-pad. Queued-direction buffer to stop you reversing into yourself. A tight loop is a tight loop — the same shape powers any real-time dashboard.",
    Component: SnakeGame,
  },
  {
    id: "kanban",
    number: "07",
    eyebrow: "Workflow UI",
    title: "Kanban board.",
    description:
      "Three columns, click-to-move chevrons on each card, add/remove tasks. The same column-and-card model under the hood of every helpdesk pipeline, sales board, and content workflow.",
    Component: KanbanBoard,
  },
  {
    id: "table",
    number: "08",
    eyebrow: "Back-office data",
    title: "Sortable, filterable customer table.",
    description:
      "Ten rows of fictional UK-themed customers, click any column header to sort, type in the search box to filter. Memoised pipeline so re-renders stay cheap as the dataset grows.",
    Component: DataTable,
  },
  {
    id: "pomodoro",
    number: "09",
    eyebrow: "Time-based UI",
    title: "Pomodoro timer.",
    description:
      "25 / 5 cycle, SVG ring driven by stroke-dashoffset, mm:ss display, auto-switching phases. The same primitives power onboarding wizards, file uploads, and any multi-step progress UI.",
    Component: PomodoroTimer,
  },
];

export default function ExamplesPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-12 sm:px-10 sm:pt-32 sm:pb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-teal">
          Examples
        </p>
        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.025em] text-brand-ink sm:text-5xl md:text-6xl">
          Live, interactive demos. Real code running in your browser.
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-brand-muted sm:text-lg">
          None of these are client work. They&rsquo;re small, focused
          components that demonstrate the kinds of things we ship every week —
          data viz, calculators, audio, animation, real-time UI. Tap them.
          They&rsquo;re live.
        </p>
      </section>

      <div className="space-y-20 pb-24 sm:space-y-28 sm:pb-32">
        {demos.map(({ id, number, eyebrow, title, description, Component }) => (
          <section
            key={id}
            id={id}
            aria-labelledby={`${id}-heading`}
            className="mx-auto max-w-6xl scroll-mt-24 px-6 sm:px-10"
          >
            <header className="max-w-3xl">
              <div className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="bg-gradient-to-br from-brand-teal to-brand-teal/40 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl"
                >
                  {number}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-teal">
                  {eyebrow}
                </span>
              </div>
              <h2
                id={`${id}-heading`}
                className="mt-4 text-balance text-2xl font-semibold leading-[1.15] tracking-[-0.02em] text-brand-ink sm:text-3xl md:text-4xl"
              >
                {title}
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-brand-muted sm:text-[17px]">
                {description}
              </p>
            </header>

            <div className="mt-10 sm:mt-12">
              <Component />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
