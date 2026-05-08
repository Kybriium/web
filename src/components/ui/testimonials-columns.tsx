"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export type ProjectItem = {
  text: string;
  name: string;
  role: string;
  icon: LucideIcon;
};

function ProjectCard({ text, name, role, icon: Icon }: ProjectItem) {
  return (
    <article className="w-full max-w-xs rounded-3xl border border-brand-line bg-white p-8 shadow-lg shadow-brand-teal/5">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-teal/25 bg-brand-teal/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-teal">
        <span aria-hidden className="size-1 rounded-full bg-brand-accent" />
        Concept
      </span>
      <p className="mt-5 text-sm leading-relaxed text-brand-ink">{text}</p>
      <div className="mt-6 flex items-center gap-3 border-t border-brand-line pt-5">
        <div className="flex size-10 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal">
          <Icon className="size-4" />
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-medium leading-5 tracking-tight text-brand-ink">
            {name}
          </div>
          <div className="text-xs leading-5 text-brand-muted">{role}</div>
        </div>
      </div>
    </article>
  );
}

type ProjectsColumnProps = {
  className?: string;
  projects: ProjectItem[];
  duration?: number;
};

export function ProjectsColumn({
  className,
  projects,
  duration = 18,
}: ProjectsColumnProps) {
  return (
    <div className={className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[0, 1].map((dupIndex) => (
          <React.Fragment key={dupIndex}>
            {projects.map((project, i) => (
              <ProjectCard key={`${dupIndex}-${i}`} {...project} />
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}
