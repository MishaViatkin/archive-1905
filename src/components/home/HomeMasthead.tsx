"use client";

import { motion } from "framer-motion";
import { Typewriter } from "@/components/effects/Typewriter";

export function HomeMasthead() {
  return (
    <header className="border-y-4 border-double border-ink py-6">
      <div className="flex flex-wrap items-end justify-between gap-4 text-xs uppercase tracking-[0.2em] text-ink-faded">
        <span>УрФУ · группа ЭУ-153604</span>
        <span>Аналитическая работа</span>
        <span>Екатеринбург · 1905–1907</span>
      </div>

      <motion.h1
        className="mt-4 text-center font-display text-5xl font-bold leading-[0.95] tracking-tight text-ink md:text-7xl lg:text-8xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        АРХИВ 1905
      </motion.h1>

      <motion.p
        className="mt-2 text-center font-display text-lg italic text-ink-faded md:text-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Революция 1905–1907 годов в Екатеринбурге —
        <br className="hidden md:inline" /> от рабочего подполья до первого
        Совета депутатов
      </motion.p>

      <div className="mx-auto mt-6 max-w-3xl text-center font-mono text-xs uppercase tracking-[0.25em] text-accent">
        <Typewriter
          text="9 источников · 28 митингов · 32 депутата · 1 совет"
          speed={28}
          startDelay={900}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-[0.2em] text-ink-faded">
        <span className="flex items-center gap-2">
          <span className="h-1 w-12 bg-ink-faded" />
          только опубликованные источники
        </span>
        <span>сборники · монографии · статьи</span>
        <span className="flex items-center gap-2">
          без архивных шифров — честно
          <span className="h-1 w-12 bg-ink-faded" />
        </span>
      </div>
    </header>
  );
}
