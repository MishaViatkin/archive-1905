"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GlossaryTerm } from "@/lib/types";

export function GlossaryGrid({ terms }: { terms: GlossaryTerm[] }) {
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q),
    );
  }, [filter, terms]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Фильтр по словарю…"
          className="flex-1 min-w-[200px] rounded border border-ink/30 bg-paper/80 px-3 py-2 text-sm outline-none placeholder:text-ink-faded/60 focus:border-accent"
        />
        <span className="font-mono text-xs uppercase tracking-widest text-ink-faded">
          {filtered.length} / {terms.length}
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((t, i) => (
            <motion.article
              key={t.id}
              id={t.id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              className="doc-card group relative scroll-mt-24 rounded-sm p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <h3 className="font-display text-lg font-bold text-ink">
                {t.term}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/85">
                {t.definition}
              </p>
              {t.source && (
                <p className="mt-3 border-t border-dashed border-ink/30 pt-2 text-[10px] text-ink-faded">
                  {t.source}
                </p>
              )}
            </motion.article>
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-ink-faded">
          Нет совпадений по фильтру «{filter}».
        </p>
      )}
    </div>
  );
}
