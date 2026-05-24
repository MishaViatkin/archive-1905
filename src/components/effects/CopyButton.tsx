"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface CopyButtonProps {
  value: string;
  label?: string;
  successLabel?: string;
  className?: string;
}

export function CopyButton({
  value,
  label = "копировать",
  successLabel = "скопировано",
  className,
}: CopyButtonProps) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      className={`inline-flex items-center gap-1 rounded border border-ink/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink/60 transition hover:border-accent hover:text-accent ${
        className ?? ""
      }`}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <AnimatePresence mode="wait">
        <motion.span
          key={done ? "ok" : "copy"}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 3 }}
          transition={{ duration: 0.15 }}
        >
          {done ? successLabel : label}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
