import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  as?: "article" | "div";
};

export function Card({
  children,
  className = "",
  as: Component = "article",
}: CardProps) {
  return (
    <Component
      className={`surface-card flex h-full flex-col rounded-2xl p-7 sm:p-8 ${className}`}
    >
      {children}
    </Component>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-brand-line/80 bg-white/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-brand-muted">
      {children}
    </span>
  );
}
