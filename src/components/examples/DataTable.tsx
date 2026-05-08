"use client";

import { ArrowDown, ArrowUp, Search, Table2 } from "lucide-react";
import { useMemo, useState } from "react";

type Status = "active" | "trial" | "lapsed";

type Row = {
  id: string;
  name: string;
  contact: string;
  plan: "Starter" | "Studio" | "Scale";
  mrr: number; // monthly recurring revenue (illustrative)
  status: Status;
  signedUp: string; // ISO date
};

const ROWS: Row[] = [
  { id: "r1", name: "Northgate Logistics", contact: "ops@northgate.example", plan: "Studio", mrr: 1200, status: "active", signedUp: "2025-09-12" },
  { id: "r2", name: "Westby Clinic", contact: "admin@westby.example", plan: "Starter", mrr: 450, status: "trial", signedUp: "2026-04-22" },
  { id: "r3", name: "Beeston Trading", contact: "team@beeston.example", plan: "Scale", mrr: 3200, status: "active", signedUp: "2024-11-03" },
  { id: "r4", name: "Harlow Print", contact: "hello@harlow.example", plan: "Starter", mrr: 380, status: "lapsed", signedUp: "2024-06-08" },
  { id: "r5", name: "Thornbury Studio", contact: "studio@thornbury.example", plan: "Studio", mrr: 1100, status: "active", signedUp: "2025-02-19" },
  { id: "r6", name: "Falmouth Maritime", contact: "ops@falmouth.example", plan: "Scale", mrr: 2800, status: "active", signedUp: "2024-08-14" },
  { id: "r7", name: "Carlisle Motors", contact: "service@carlisle.example", plan: "Starter", mrr: 420, status: "trial", signedUp: "2026-03-01" },
  { id: "r8", name: "Whitby Foods", contact: "orders@whitby.example", plan: "Studio", mrr: 980, status: "active", signedUp: "2025-05-30" },
  { id: "r9", name: "Penrith Property", contact: "lettings@penrith.example", plan: "Scale", mrr: 3450, status: "active", signedUp: "2024-12-17" },
  { id: "r10", name: "Hereford Bakers", contact: "hi@hereford.example", plan: "Starter", mrr: 350, status: "lapsed", signedUp: "2024-04-09" },
];

type SortKey = "name" | "plan" | "mrr" | "status" | "signedUp";

const STATUS_STYLES: Record<Status, string> = {
  active: "bg-brand-teal/10 text-brand-teal",
  trial: "bg-brand-accent/15 text-brand-teal",
  lapsed: "bg-red-50 text-red-700",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  }).format(new Date(iso));
}

function formatMrr(n: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);
}

export function DataTable() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "name",
    dir: "asc",
  });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? ROWS.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.contact.toLowerCase().includes(q),
        )
      : ROWS;

    const sorted = [...filtered].sort((a, b) => {
      const A = a[sort.key];
      const B = b[sort.key];
      let cmp = 0;
      if (typeof A === "number" && typeof B === "number") cmp = A - B;
      else cmp = String(A).localeCompare(String(B));
      return sort.dir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [query, sort]);

  function toggleSort(key: SortKey) {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-line bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-line bg-brand-canvas-soft px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted">
          <Table2 className="size-3.5" /> Customers
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs tabular-nums text-brand-muted">
            {rows.length} of {ROWS.length}
          </span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="h-9 w-44 rounded-full border border-brand-line bg-white pl-9 pr-4 text-sm text-brand-ink placeholder:text-brand-muted focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-accent/40 sm:w-56"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-brand-line bg-brand-canvas-soft/60 text-left">
              <SortHeader label="Customer" k="name" sort={sort} onSort={toggleSort} />
              <SortHeader label="Plan" k="plan" sort={sort} onSort={toggleSort} />
              <SortHeader label="MRR" k="mrr" sort={sort} onSort={toggleSort} align="right" />
              <SortHeader label="Status" k="status" sort={sort} onSort={toggleSort} />
              <SortHeader label="Signed up" k="signedUp" sort={sort} onSort={toggleSort} />
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-line">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-sm text-brand-muted"
                >
                  No matches.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-brand-canvas-soft/40">
                  <td className="px-5 py-3">
                    <div className="font-medium text-brand-ink">{r.name}</div>
                    <div className="mt-0.5 text-xs text-brand-muted">{r.contact}</div>
                  </td>
                  <td className="px-5 py-3 text-brand-ink">{r.plan}</td>
                  <td className="px-5 py-3 text-right font-mono tabular-nums text-brand-ink">
                    {formatMrr(r.mrr)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${STATUS_STYLES[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-brand-muted">
                    {formatDate(r.signedUp)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="border-t border-brand-line bg-brand-canvas-soft px-5 py-4 text-xs text-brand-muted sm:px-6">
        Demo data — fictional UK-themed customer names. Sort, filter, and the
        same memoised pipeline drive any back-office list view we&rsquo;d build.
      </p>
    </div>
  );
}

type SortHeaderProps = {
  label: string;
  k: SortKey;
  sort: { key: SortKey; dir: "asc" | "desc" };
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
};

function SortHeader({ label, k, sort, onSort, align = "left" }: SortHeaderProps) {
  const isActive = sort.key === k;
  return (
    <th
      scope="col"
      className={`px-5 py-3 ${align === "right" ? "text-right" : "text-left"}`}
    >
      <button
        type="button"
        onClick={() => onSort(k)}
        className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
          isActive ? "text-brand-teal" : "text-brand-muted hover:text-brand-ink"
        }`}
      >
        {label}
        {isActive ? (
          sort.dir === "asc" ? (
            <ArrowUp className="size-3" />
          ) : (
            <ArrowDown className="size-3" />
          )
        ) : null}
      </button>
    </th>
  );
}
