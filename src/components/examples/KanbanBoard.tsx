"use client";

import {
  ChevronLeft,
  ChevronRight,
  KanbanSquare,
  Plus,
  X,
} from "lucide-react";
import { useState, type FormEvent } from "react";

type ColumnId = "backlog" | "progress" | "done";

type Card = {
  id: string;
  title: string;
  column: ColumnId;
};

const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "progress", label: "In progress" },
  { id: "done", label: "Done" },
];

const INITIAL_CARDS: Card[] = [
  { id: "c1", title: "Audit Salesforce integration", column: "backlog" },
  { id: "c2", title: "Replace stock spreadsheet", column: "backlog" },
  { id: "c3", title: "Set up booking page", column: "backlog" },
  { id: "c4", title: "Migrate forms to Zod", column: "progress" },
  { id: "c5", title: "Wire RingCentral webhook", column: "progress" },
  { id: "c6", title: "Deploy v1 to staging", column: "done" },
  { id: "c7", title: "Set up monitoring", column: "done" },
];

export function KanbanBoard() {
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [draft, setDraft] = useState("");

  function move(id: string, dir: -1 | 1) {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const idx = COLUMNS.findIndex((col) => col.id === c.column);
        const next = COLUMNS[idx + dir];
        return next ? { ...c, column: next.id } : c;
      }),
    );
  }

  function remove(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setCards((prev) => [
      ...prev,
      { id: `c${Date.now()}`, title, column: "backlog" },
    ]);
    setDraft("");
  }

  return (
    <div className="rounded-2xl border border-brand-line bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted">
          <KanbanSquare className="size-3.5" /> Kanban
        </div>
        <form onSubmit={add} className="flex items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a task…"
            className="h-9 w-44 rounded-full border border-brand-line bg-white px-4 text-sm text-brand-ink placeholder:text-brand-muted focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-accent/40 sm:w-56"
          />
          <button
            type="submit"
            aria-label="Add task"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-teal text-brand-canvas transition-colors hover:bg-brand-ink"
          >
            <Plus className="size-4" />
          </button>
        </form>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {COLUMNS.map((col, colIdx) => {
          const columnCards = cards.filter((c) => c.column === col.id);
          return (
            <div
              key={col.id}
              className="rounded-xl border border-brand-line bg-brand-canvas-soft p-3"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">
                  {col.label}
                </span>
                <span className="text-xs tabular-nums text-brand-muted">
                  {columnCards.length}
                </span>
              </div>
              <ul className="space-y-2">
                {columnCards.map((card) => (
                  <li
                    key={card.id}
                    className="group rounded-lg border border-brand-line bg-white p-3 shadow-sm shadow-brand-teal/5"
                  >
                    <p className="text-sm leading-snug text-brand-ink">
                      {card.title}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => move(card.id, -1)}
                          disabled={colIdx === 0}
                          aria-label="Move left"
                          className="inline-flex size-7 items-center justify-center rounded-md text-brand-muted transition-colors hover:bg-brand-teal/10 hover:text-brand-teal disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronLeft className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => move(card.id, 1)}
                          disabled={colIdx === COLUMNS.length - 1}
                          aria-label="Move right"
                          className="inline-flex size-7 items-center justify-center rounded-md text-brand-muted transition-colors hover:bg-brand-teal/10 hover:text-brand-teal disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronRight className="size-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(card.id)}
                        aria-label="Delete task"
                        className="inline-flex size-7 items-center justify-center rounded-md text-brand-muted opacity-0 transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 focus:opacity-100"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
                {!columnCards.length ? (
                  <li className="rounded-lg border border-dashed border-brand-line/80 px-3 py-6 text-center text-xs text-brand-muted">
                    Empty
                  </li>
                ) : null}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-5 border-t border-brand-line pt-4 text-xs leading-relaxed text-brand-muted">
        Per-card chevron buttons work on every device, no drag-drop library.
        The same column-and-card model underpins helpdesk pipelines, sales
        boards, content workflows, and editorial calendars.
      </p>
    </div>
  );
}
