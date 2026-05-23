"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import type { GlossaryTerm } from "@/lib/types";

interface TermProps {
  term: GlossaryTerm;
  children?: React.ReactNode;
}

export function Term({ term, children }: TermProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <span ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="cursor-help border-b border-dotted border-accent/60 text-accent transition hover:border-accent"
      >
        {children ?? term.term}
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-full z-30 mt-2 block w-72 -translate-x-1/2 doc-card rounded-sm p-4 text-left text-xs leading-snug shadow-xl"
          >
            <span className="block font-display text-sm font-bold text-ink">
              {term.term}
            </span>
            <span className="mt-1 block text-ink/85">{term.definition}</span>
            {term.source && (
              <span className="mt-2 block border-t border-dashed border-ink/30 pt-1 text-[10px] text-ink-faded">
                {term.source}
              </span>
            )}
            <Link
              href={`/glossary#${term.id}` as never}
              className="mt-2 inline-block text-[10px] uppercase tracking-widest text-accent hover:underline"
            >
              К словарю →
            </Link>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
