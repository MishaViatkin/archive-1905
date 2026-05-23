"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HistoryEvent } from "@/lib/types";

interface DocumentOfDayProps {
  events: HistoryEvent[];
}

export function DocumentOfDay({ events }: DocumentOfDayProps) {
  const withQuotes = useMemo(
    () => events.filter((e) => e.quote),
    [events],
  );
  // Start with index 0 on the server so SSR is deterministic; then re-roll
  // on the client after mount via setIndex in an effect (allowed via setState
  // inside an effect that runs only once).
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex(Math.floor(Math.random() * Math.max(withQuotes.length, 1)));
  }, [withQuotes.length]);

  const next = () =>
    setIndex((i) => (i + 1) % Math.max(withQuotes.length, 1));

  const cur = withQuotes[index];
  if (!cur) return null;

  return (
    <section className="mt-16">
      <div className="rule-thick-thin flex flex-wrap items-end justify-between gap-2 pt-3">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-faded">
            Документ дня
          </p>
          <h2 className="mt-1 font-display text-3xl text-ink">
            Случайный материал из фондов
          </h2>
        </div>
        <button
          type="button"
          onClick={next}
          className="rounded border border-ink/30 px-3 py-1.5 text-xs uppercase tracking-widest text-ink/70 hover:border-accent hover:text-accent"
        >
          ↻ Другой документ
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          key={cur.id}
          initial={{ opacity: 0, y: 16, rotate: -0.6 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: -10, rotate: 0.6 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="doc-card mt-6 grid gap-6 rounded-sm p-6 lg:grid-cols-[2fr_1fr] lg:p-8"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              {cur.dateEnd
                ? `${formatDate(cur.date)} — ${formatDate(cur.dateEnd)}`
                : formatDate(cur.date)}
            </p>
            <h3 className="mt-1 font-display text-2xl text-ink">{cur.title}</h3>
            <blockquote className="mt-4 border-l-4 border-accent/60 pl-4 font-display text-xl italic leading-snug text-ink/90">
              «{cur.quote}»
            </blockquote>
            <p className="mt-3 text-sm text-ink/80">{cur.summary}</p>
          </div>
          <aside className="border-l border-dashed border-ink/30 pl-6 text-sm">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
              Место
            </p>
            <p className="mt-1 text-ink">{cur.location}</p>

            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-ink-faded">
              Источник
            </p>
            <p className="mt-1 text-xs leading-snug text-ink/80">
              {cur.source}
            </p>

            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-ink-faded">
              Статус
            </p>
            <p
              className={`mt-1 inline-block rounded px-2 py-0.5 text-[10px] uppercase tracking-widest ${
                cur.verified
                  ? "bg-green-50 text-green-800"
                  : "bg-amber-50 text-amber-800"
              }`}
            >
              {cur.verified ? "верифицировано" : "под вопросом"}
            </p>
          </aside>
        </motion.article>
      </AnimatePresence>
    </section>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
