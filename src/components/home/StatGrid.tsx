"use client";

import { CountUp } from "@/components/effects/CountUp";
import { StaggerContainer, StaggerItem } from "@/components/effects/AnimatedSection";
import type { StatItem } from "@/lib/types";

interface StatGridProps {
  stats: StatItem[];
}

export function StatGrid({ stats }: StatGridProps) {
  return (
    <StaggerContainer className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <StaggerItem
          key={s.label}
          className="doc-card relative rounded-sm p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <p className="font-display text-4xl font-bold text-accent md:text-5xl">
            <CountUp to={s.value} duration={1500} />
          </p>
          <p className="mt-1 font-display text-base text-ink">{s.label}</p>
          <p className="mt-1 text-xs text-ink-faded">{s.context}</p>
          <p className="mt-2 border-t border-dashed border-ink/20 pt-1.5 font-mono text-[9px] uppercase tracking-widest text-ink-faded">
            {s.source}
          </p>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
