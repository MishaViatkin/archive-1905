"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { SearchItem, SearchItemKind } from "@/lib/types";

const KIND_LABEL: Record<SearchItemKind, string> = {
  event: "Событие",
  person: "Фигурант",
  source: "Источник",
  term: "Термин",
  place: "Место",
  enterprise: "Предприятие",
  legacy: "Наследие",
};

const KIND_COLOR: Record<SearchItemKind, string> = {
  event: "#a4271c",
  person: "#1f2a44",
  source: "#3a4a3a",
  term: "#6b5326",
  place: "#5a4a3a",
  enterprise: "#2b231b",
  legacy: "#a4271c",
};

// Russian-friendly normalization: lowercase + remove diacritics + ё→е + й→и.
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ё/g, "е")
    .replace(/й/g, "и");
}

interface SearchPaletteProps {
  index: SearchItem[];
}

interface ScoredItem {
  item: SearchItem;
  score: number;
  hits: { titleHit: number; subtitleHit: number; bodyHit: number };
}

export function SearchPalette({ index }: SearchPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Pre-normalize the whole index once — avoids work on every keystroke.
  const normalizedIndex = useMemo(
    () =>
      index.map((item) => ({
        item,
        title: normalize(item.title),
        subtitle: normalize(item.subtitle ?? ""),
        body: normalize(item.body ?? ""),
      })),
    [index],
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === "k" || e.key === "л"; // RU layout
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      Promise.resolve().then(() => {
        setQuery("");
        setActive(0);
      });
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) {
      return normalizedIndex.slice(0, 12).map((n) => ({
        item: n.item,
        score: 0,
        hits: { titleHit: -1, subtitleHit: -1, bodyHit: -1 },
      })) as ScoredItem[];
    }

    // Multi-word AND: every space-separated token must match somewhere.
    const tokens = q.split(/\s+/).filter(Boolean);

    const scored: ScoredItem[] = [];
    for (const n of normalizedIndex) {
      let totalScore = 0;
      const hits = { titleHit: -1, subtitleHit: -1, bodyHit: -1 };
      let allMatched = true;

      for (const t of tokens) {
        const titleHit = n.title.indexOf(t);
        const subtitleHit = n.subtitle.indexOf(t);
        const bodyHit = n.body.indexOf(t);

        if (titleHit === -1 && subtitleHit === -1 && bodyHit === -1) {
          allMatched = false;
          break;
        }

        // Higher score for matches earlier and in stronger fields.
        if (titleHit !== -1) {
          totalScore += 1000 - titleHit;
          if (titleHit === 0 || /\s/.test(n.title[titleHit - 1] ?? " ")) {
            totalScore += 400; // word-boundary boost
          }
          if (hits.titleHit === -1) hits.titleHit = titleHit;
        } else if (subtitleHit !== -1) {
          totalScore += 400 - subtitleHit;
          if (hits.subtitleHit === -1) hits.subtitleHit = subtitleHit;
        } else if (bodyHit !== -1) {
          totalScore += 100 - Math.min(bodyHit, 99);
          if (hits.bodyHit === -1) hits.bodyHit = bodyHit;
        }
      }

      if (allMatched) {
        scored.push({ item: n.item, score: totalScore, hits });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 30);
  }, [query, normalizedIndex]);

  const onItemSelect = (item: SearchItem) => {
    setOpen(false);
    router.push(item.href as never);
  };

  // Highlight helper — wraps every token occurrence in <mark>.
  const tokens = normalize(query.trim())
    .split(/\s+/)
    .filter(Boolean);

  const highlight = (raw: string | undefined) => {
    if (!raw) return null;
    if (tokens.length === 0) return raw;
    const norm = normalize(raw);
    const ranges: [number, number][] = [];
    for (const t of tokens) {
      let from = 0;
      while (from <= norm.length) {
        const idx = norm.indexOf(t, from);
        if (idx === -1) break;
        ranges.push([idx, idx + t.length]);
        from = idx + t.length;
      }
    }
    if (ranges.length === 0) return raw;
    ranges.sort((a, b) => a[0] - b[0]);
    // Merge overlaps
    const merged: [number, number][] = [];
    for (const r of ranges) {
      const last = merged[merged.length - 1];
      if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
      else merged.push([...r]);
    }
    const out: React.ReactNode[] = [];
    let pos = 0;
    merged.forEach(([a, b], i) => {
      if (a > pos) out.push(raw.slice(pos, a));
      out.push(
        <mark
          key={`m-${i}`}
          className="bg-accent/25 text-ink rounded-[2px] px-[1px]"
        >
          {raw.slice(a, b)}
        </mark>,
      );
      pos = b;
    });
    if (pos < raw.length) out.push(raw.slice(pos));
    return out;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded border border-ink/30 bg-paper/70 px-3 py-1.5 text-xs text-ink-faded transition hover:border-ink/60 hover:text-ink md:flex"
        aria-label="Открыть поиск"
      >
        <span>🔎</span>
        <span>Поиск</span>
        <kbd className="rounded border border-ink/30 bg-paper px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </button>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden text-lg text-ink/70"
        aria-label="Открыть поиск"
      >
        🔎
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[10vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-label="Поиск по архиву"
              className="relative w-full max-w-xl rounded-sm border border-ink/30 bg-paper shadow-2xl"
              initial={{ y: -20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center border-b border-ink/20 px-4">
                <span className="text-ink-faded">🔎</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActive((a) => Math.min(results.length - 1, a + 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActive((a) => Math.max(0, a - 1));
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      const r = results[active];
                      if (r) onItemSelect(r.item);
                    }
                  }}
                  placeholder="Свердлов · 1905 · ВИЗ · Манифест · Совет"
                  className="w-full bg-transparent px-3 py-3 font-display text-lg text-ink outline-none placeholder:text-ink-faded/60"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setActive(0);
                      inputRef.current?.focus();
                    }}
                    className="mr-2 rounded p-1 text-xs text-ink-faded hover:text-ink"
                    aria-label="Очистить"
                  >
                    ×
                  </button>
                )}
                <kbd className="hidden rounded border border-ink/30 px-1.5 py-0.5 font-mono text-[10px] text-ink-faded sm:inline">
                  esc
                </kbd>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {results.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-ink-faded">
                    <p>Ничего не найдено по запросу «{query}».</p>
                    <p className="mt-2 text-xs">
                      Попробуйте: <em>свердлов</em>, <em>виз</em>,{" "}
                      <em>манифест</em>, <em>совет</em>, <em>генеральная репетиция</em>.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="px-4 pt-2 font-mono text-[10px] uppercase tracking-widest text-ink-faded">
                      {query.trim()
                        ? `найдено ${results.length}`
                        : "недавнее / случайное"}
                    </p>
                    <ul>
                      {results.map((r, i) => (
                        <li key={r.item.id}>
                          <Link
                            href={r.item.href as never}
                            onClick={() => setOpen(false)}
                            onMouseEnter={() => setActive(i)}
                            className={`flex items-start gap-3 border-b border-ink/10 px-4 py-3 text-sm transition ${
                              i === active ? "bg-accent/5" : ""
                            }`}
                          >
                            <span
                              className="mt-0.5 rounded-sm px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-paper"
                              style={{ background: KIND_COLOR[r.item.kind] }}
                            >
                              {KIND_LABEL[r.item.kind]}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-display text-ink">
                                {highlight(r.item.title)}
                              </span>
                              {r.item.subtitle && (
                                <span className="block truncate text-xs text-ink-faded">
                                  {highlight(r.item.subtitle)}
                                </span>
                              )}
                              {r.item.body && (
                                <span className="mt-0.5 block truncate text-xs text-ink/70">
                                  {highlight(r.item.body)}
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-ink/20 px-4 py-2 text-[10px] uppercase tracking-widest text-ink-faded">
                <span>{index.length} записей в каталоге</span>
                <span className="font-mono">↑ ↓ выбор · ↵ открыть · esc</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
