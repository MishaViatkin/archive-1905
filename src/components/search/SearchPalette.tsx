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

interface SearchPaletteProps {
  index: SearchItem[];
}

export function SearchPalette({ index }: SearchPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
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
      // Reset query/active on open. Wrapped in a microtask so React doesn't
      // see a synchronous setState cascade inside the effect.
      Promise.resolve().then(() => {
        setQuery("");
        setActive(0);
      });
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.slice(0, 12);
    return index
      .map((item) => {
        const hay = `${item.title} ${item.subtitle ?? ""} ${item.body ?? ""}`
          .toLowerCase();
        const idx = hay.indexOf(q);
        return { item, idx };
      })
      .filter((r) => r.idx !== -1)
      .sort((a, b) => a.idx - b.idx)
      .slice(0, 30)
      .map((r) => r.item);
  }, [query, index]);

  const onItemSelect = (item: SearchItem) => {
    setOpen(false);
    router.push(item.href as never);
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
        <span>Поиск по архиву</span>
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
                      const item = results[active];
                      if (item) onItemSelect(item);
                    }
                  }}
                  placeholder="Свердлов, погром, ВИЗ, лакуна…"
                  className="w-full bg-transparent px-3 py-3 font-display text-lg text-ink outline-none placeholder:text-ink-faded/60"
                />
                <kbd className="hidden rounded border border-ink/30 px-1.5 py-0.5 font-mono text-[10px] text-ink-faded sm:inline">
                  esc
                </kbd>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {results.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-ink-faded">
                    Ничего не найдено. Попробуйте «свердлов», «1905», «гасо».
                  </p>
                ) : (
                  <ul>
                    {results.map((item, i) => (
                      <li key={item.id}>
                        <Link
                          href={item.href as never}
                          onClick={() => setOpen(false)}
                          onMouseEnter={() => setActive(i)}
                          className={`flex items-start gap-3 border-b border-ink/10 px-4 py-3 text-sm transition ${
                            i === active ? "bg-accent/5" : ""
                          }`}
                        >
                          <span
                            className="mt-0.5 rounded-sm px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-paper"
                            style={{ background: KIND_COLOR[item.kind] }}
                          >
                            {KIND_LABEL[item.kind]}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-display text-ink">
                              {item.title}
                            </span>
                            {item.subtitle && (
                              <span className="block truncate text-xs text-ink-faded">
                                {item.subtitle}
                              </span>
                            )}
                            {item.body && (
                              <span className="mt-0.5 block truncate text-xs text-ink/70">
                                {item.body}
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-ink/20 px-4 py-2 text-[10px] uppercase tracking-widest text-ink-faded">
                <span>{index.length} записей в каталоге</span>
                <span className="font-mono">↑ ↓ выбор · ↵ открыть</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
