"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import type { ChronicleChapter, Place } from "@/lib/types";

interface Props {
  chapters: ChronicleChapter[];
  places?: Place[];
}

export function ChronicleScroll({ chapters, places = [] }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const placeMap = useMemo(() => {
    const m = new Map<string, Place>();
    for (const p of places) m.set(p.id, p);
    return m;
  }, [places]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = Number((visible.target as HTMLElement).dataset.idx);
          if (!Number.isNaN(idx)) setActive(idx);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.5, 1] },
    );

    const els = containerRef.current?.querySelectorAll("[data-idx]") ?? [];
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToChapter = (idx: number) => {
    const el = containerRef.current?.querySelector(`[data-idx="${idx}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-10" style={{ position: "relative" }}>
      <header className="rule-thick-thin pt-3">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-faded">
          Раздел I
        </p>
        <h1 className="mt-1 font-display text-5xl text-ink md:text-6xl">
          Хроника
        </h1>
        <p className="mt-3 max-w-2xl text-ink-faded">
          {chapters.length} сцен — от условий труда и Кровавого воскресенья
          до создания Совета и преемственности 1917 года. Прокручивайте: слева
          отмечается время, справа сменяются цитаты опубликованных источников.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => scrollToChapter(0)}
            className="rounded border border-ink/30 px-3 py-1.5 hover:bg-ink/5"
          >
            ↑ К началу
          </button>
          <button
            type="button"
            onClick={() => scrollToChapter(chapters.length - 1)}
            className="rounded border border-ink/30 px-3 py-1.5 hover:bg-ink/5"
          >
            ↓ К концу
          </button>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
            Глава {String(active + 1).padStart(2, "0")} из{" "}
            {chapters.length}
          </span>
        </div>
      </header>

      <div
        ref={containerRef}
        className="relative mt-12 grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)_minmax(0,1fr)] lg:gap-16"
        style={{ position: "relative" }}
      >
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="relative max-h-[70vh] overflow-y-auto pr-2">
              <div className="absolute inset-y-0 left-2 w-px bg-ink/20" />
              <motion.div
                className="absolute left-2 top-0 w-px bg-accent"
                style={{ height: progressHeight }}
              />
              <ul className="space-y-3">
                {chapters.map((c, i) => (
                  <li key={c.id} className="relative pl-8">
                    <button
                      type="button"
                      onClick={() => scrollToChapter(i)}
                      className="block text-left"
                    >
                      <span
                        className={`absolute left-0 top-1.5 h-4 w-4 -translate-x-1/2 rounded-full border-2 transition ${
                          i <= active
                            ? "border-accent bg-accent"
                            : "border-ink/40 bg-paper"
                        }`}
                      />
                      <p
                        className={`text-xs font-mono uppercase tracking-wider transition ${
                          i === active ? "text-accent" : "text-ink-faded"
                        }`}
                      >
                        {c.dateLabel}
                      </p>
                      <p
                        className={`mt-0.5 font-display text-sm leading-tight ${
                          i === active ? "text-ink" : "text-ink/50"
                        }`}
                      >
                        {c.title}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <div className="space-y-32">
          {chapters.map((c, i) => (
            <motion.section
              key={c.id}
              data-idx={i}
              className="min-h-[60vh] scroll-mt-24"
              initial={{ opacity: 0.4, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-baseline gap-3">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                  {c.dateLabel}
                </p>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
                  · сцена {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <motion.h2
                className="mt-2 font-display text-3xl text-ink md:text-4xl"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {c.title}
              </motion.h2>
              <p className="mt-4 font-display text-xl italic leading-snug text-ink/80">
                {c.lede}
              </p>
              <p className="mt-6 text-[0.95rem] leading-relaxed text-ink/90">
                {c.body}
              </p>
              {c.marginNote && (
                <motion.p
                  className="mt-6 border-l-2 border-accent/60 pl-4 font-display text-sm italic text-accent"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {c.marginNote}
                </motion.p>
              )}
              <ChapterLinks chapter={c} placeMap={placeMap} />
            </motion.section>
          ))}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <AnimatePresence mode="wait">
              <ChroniclePane key={chapters[active].id} chapter={chapters[active]} />
            </AnimatePresence>
          </div>
        </aside>
      </div>

      <div className="mt-10 lg:hidden">
        <p className="font-display text-xs uppercase tracking-widest text-ink-faded">
          Цитаты глав
        </p>
        <div className="mt-3 space-y-4">
          {chapters
            .filter((c) => c.quote)
            .map((c) => (
              <div key={c.id} className="doc-card rounded-sm p-4">
                <p className="text-xs text-ink-faded">{c.dateLabel}</p>
                <p className="mt-1 italic text-ink">«{c.quote!.text}»</p>
                <p className="mt-1 text-xs text-ink-faded">— {c.quote!.source}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function ChapterLinks({
  chapter,
  placeMap,
}: {
  chapter: ChronicleChapter;
  placeMap: Map<string, Place>;
}) {
  const place = chapter.placeId ? placeMap.get(chapter.placeId) : null;
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest text-ink-faded">
      {place && (
        <Link
          href={"/atlas" as never}
          className="rounded-full border border-ink/30 px-3 py-1 hover:border-accent hover:text-accent"
        >
          📍 на карте · {place.name}
        </Link>
      )}
      {chapter.quote?.sourceId && (
        <Link
          href={`/sources#${chapter.quote.sourceId}` as never}
          className="rounded-full border border-ink/30 px-3 py-1 hover:border-accent hover:text-accent"
        >
          📜 источник
        </Link>
      )}
      <Link
        href={"/network" as never}
        className="rounded-full border border-ink/30 px-3 py-1 hover:border-accent hover:text-accent"
      >
        👥 фигуранты
      </Link>
      <Link
        href={"/source-base" as never}
        className="rounded-full border border-ink/30 px-3 py-1 hover:border-accent hover:text-accent"
      >
        ◇ источниковая база
      </Link>
    </div>
  );
}

function ChroniclePane({ chapter }: { chapter: ChronicleChapter }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, y: -16, rotate: 1 }}
      transition={{ duration: 0.4 }}
      className="doc-card relative rounded-sm p-6"
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-widest text-ink-faded">
        <span>Документ</span>
        <span className="font-mono">{chapter.id}</span>
      </div>
      {chapter.quote ? (
        <>
          <p className="mt-4 font-display text-lg italic leading-snug text-ink">
            «{chapter.quote.text}»
          </p>
          <div className="mt-4 border-t border-dashed border-ink/30 pt-3 text-xs text-ink-faded">
            <p>{chapter.quote.source}</p>
            {chapter.quote.sourceId && (
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-faded/70">
                ref · {chapter.quote.sourceId}
              </p>
            )}
          </div>
        </>
      ) : (
        <p className="mt-4 font-display text-lg italic text-ink-faded">
          Документального свидетельства этого момента в собранных фондах не
          найдено — нарратив реконструирован по косвенным данным.
        </p>
      )}
      {chapter.marginNote && (
        <p className="mt-4 border-t border-dashed border-ink/30 pt-3 text-xs text-accent">
          ✶ {chapter.marginNote}
        </p>
      )}
    </motion.div>
  );
}
