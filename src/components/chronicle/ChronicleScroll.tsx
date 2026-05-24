"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import type { ChronicleChapter, Person, Place } from "@/lib/types";

interface Props {
  chapters: ChronicleChapter[];
  places?: Place[];
  people?: Person[];
}

export function ChronicleScroll({
  chapters,
  places = [],
  people = [],
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const placeMap = useMemo(() => {
    const m = new Map<string, Place>();
    for (const p of places) m.set(p.id, p);
    return m;
  }, [places]);

  const personMap = useMemo(() => {
    const m = new Map<string, Person>();
    for (const p of people) m.set(p.id, p);
    return m;
  }, [people]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.35,
  });

  const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = Number((visible.target as HTMLElement).dataset.idx);
          if (!Number.isNaN(idx)) {
            setActive(idx);
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    const els = containerRef.current?.querySelectorAll("[data-idx]") ?? [];
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToChapter = (idx: number) => {
    const el = containerRef.current?.querySelector(`[data-idx="${idx}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goPrev = () => scrollToChapter(Math.max(0, active - 1));
  const goNext = () => scrollToChapter(Math.min(chapters.length - 1, active + 1));

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-10">
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
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => scrollToChapter(0)}
            className="rounded border border-ink/30 px-3 py-1.5 hover:border-accent hover:text-accent"
          >
            ⇤ Начало
          </button>
          <button
            type="button"
            onClick={goPrev}
            className="rounded border border-ink/30 px-3 py-1.5 hover:border-accent hover:text-accent"
          >
            ← Назад
          </button>
          <button
            type="button"
            onClick={goNext}
            className="rounded border border-ink/30 px-3 py-1.5 hover:border-accent hover:text-accent"
          >
            Вперёд →
          </button>
          <button
            type="button"
            onClick={() => scrollToChapter(chapters.length - 1)}
            className="rounded border border-ink/30 px-3 py-1.5 hover:border-accent hover:text-accent"
          >
            Конец ⇥
          </button>
          <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-ink-faded">
            Сцена {String(active + 1).padStart(2, "0")} / {chapters.length}
          </span>
        </div>
      </header>

      <div
        ref={containerRef}
        className="relative mt-12 grid gap-10 lg:grid-cols-[210px_minmax(0,1fr)_320px] lg:gap-12"
      >
        {/* Left: timeline ladder */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 self-start">
            <div className="relative max-h-[calc(100vh-7rem)] overflow-y-auto pl-4 pr-2">
              <div className="absolute inset-y-0 left-2 w-px bg-ink/15" />
              <motion.div
                className="absolute left-2 top-0 w-px bg-accent"
                style={{ height: progressHeight }}
              />
              <ul className="space-y-3 py-1">
                {chapters.map((c, i) => (
                  <li key={c.id} className="relative pl-7">
                    <button
                      type="button"
                      onClick={() => scrollToChapter(i)}
                      className="block w-full text-left"
                    >
                      <span
                        aria-hidden
                        className={`absolute left-[-0.5rem] top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 transition-colors ${
                          i <= active
                            ? "border-accent bg-accent"
                            : "border-ink/40 bg-paper"
                        }`}
                      />
                      <p
                        className={`font-mono text-[10px] uppercase tracking-wider transition-colors ${
                          i === active ? "text-accent" : "text-ink-faded"
                        }`}
                      >
                        {c.dateLabel}
                      </p>
                      <p
                        className={`mt-0.5 font-display text-sm leading-tight transition-colors ${
                          i === active ? "text-ink" : "text-ink/55"
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

        {/* Center: scenes — no opacity animation so reverse scroll doesn't dim text */}
        <div className="space-y-24">
          {chapters.map((c, i) => (
            <section
              key={c.id}
              data-idx={i}
              id={c.id}
              className="scroll-mt-24"
            >
              <div className="flex items-baseline gap-3">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                  {c.dateLabel}
                </p>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
                  · сцена {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
                {c.title}
              </h2>
              <p className="mt-4 font-display text-xl italic leading-snug text-ink/80">
                {c.lede}
              </p>
              <p className="mt-6 text-[0.95rem] leading-relaxed text-ink/90">
                {c.body}
              </p>
              {c.marginNote && (
                <p className="mt-6 border-l-2 border-accent/60 pl-4 font-display text-sm italic text-accent">
                  {c.marginNote}
                </p>
              )}
              {/* Mobile-only quote */}
              {c.quote && (
                <blockquote className="mt-6 doc-card rounded-sm p-4 lg:hidden">
                  <p className="font-display text-sm italic leading-snug text-ink">
                    «{c.quote.text}»
                  </p>
                  <p className="mt-2 text-[11px] text-ink-faded">
                    — {c.quote.source}
                  </p>
                </blockquote>
              )}
              <ChapterLinks
                chapter={c}
                placeMap={placeMap}
                personMap={personMap}
              />
            </section>
          ))}
        </div>

        {/* Right: sticky quote pane — desktop only */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <AnimatePresence mode="wait" initial={false}>
              <ChroniclePane
                key={chapters[active].id}
                chapter={chapters[active]}
              />
            </AnimatePresence>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ChapterLinks({
  chapter,
  placeMap,
  personMap,
}: {
  chapter: ChronicleChapter;
  placeMap: Map<string, Place>;
  personMap: Map<string, Person>;
}) {
  const place = chapter.placeId ? placeMap.get(chapter.placeId) : null;
  const person = chapter.featurePersonId
    ? personMap.get(chapter.featurePersonId)
    : null;
  const mapHref = place
    ? `/atlas?focus=${place.id}&date=${chapter.date}`
    : "/atlas";
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest text-ink-faded">
      {place && (
        <Link
          href={mapHref as never}
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
      {person ? (
        <Link
          href={`/network?focus=${person.id}` as never}
          className="rounded-full border border-ink/30 px-3 py-1 hover:border-accent hover:text-accent"
        >
          👥 {person.name}
        </Link>
      ) : (
        <Link
          href={"/network" as never}
          className="rounded-full border border-ink/30 px-3 py-1 hover:border-accent hover:text-accent"
        >
          👥 фигуранты
        </Link>
      )}
      {chapter.featureTermId && (
        <Link
          href={`/glossary#${chapter.featureTermId}` as never}
          className="rounded-full border border-ink/30 px-3 py-1 hover:border-accent hover:text-accent"
        >
          🔍 термин
        </Link>
      )}
    </div>
  );
}

function ChroniclePane({ chapter }: { chapter: ChronicleChapter }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="doc-card relative rounded-sm p-5"
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-widest text-ink-faded">
        <span>{chapter.dateLabel}</span>
        <span className="font-mono text-[10px]">#{chapter.id}</span>
      </div>
      {chapter.quote ? (
        <>
          <p className="mt-4 font-display text-base italic leading-snug text-ink">
            «{chapter.quote.text}»
          </p>
          <div className="mt-4 border-t border-dashed border-ink/30 pt-3 text-xs text-ink-faded">
            <p>{chapter.quote.source}</p>
            {chapter.quote.sourceId && (
              <Link
                href={`/sources#${chapter.quote.sourceId}` as never}
                className="mt-1 inline-block font-mono text-[10px] uppercase tracking-widest text-accent hover:underline"
              >
                → в картотеке
              </Link>
            )}
          </div>
        </>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-ink/80">
          {chapter.lede}
        </p>
      )}
      {chapter.marginNote && (
        <p className="mt-4 border-t border-dashed border-ink/30 pt-3 text-xs italic text-accent">
          ✶ {chapter.marginNote}
        </p>
      )}
    </motion.div>
  );
}
