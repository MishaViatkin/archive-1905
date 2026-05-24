"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { HistoryEvent, Place } from "@/lib/types";

// Map event ids to chronicle chapter ids so the atlas can link
// straight to the right scene (#anchor) in /chronicle.
const EVENT_TO_CHAPTER: Record<string, string> = {
  "bloody-sunday": "bloody-sunday",
  "may-day": "may-day",
  "viz-strike": "viz-strike",
  "october-manifesto": "october-manifesto",
  pogrom: "pogrom",
  council: "council",
  repression: "repression",
};

interface TimeAtlasProps {
  places: Place[];
  events: HistoryEvent[];
}

const MONTHS = [
  "Янв",
  "Фев",
  "Мар",
  "Апр",
  "Май",
  "Июн",
  "Июл",
  "Авг",
  "Сен",
  "Окт",
  "Ноя",
  "Дек",
];

const MONTHS_FULL = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const TIMELINE_START = { year: 1904, month: 11 };
const TIMELINE_END = { year: 1907, month: 11 };

function toIndex(year: number, monthZeroBased: number) {
  return (
    (year - TIMELINE_START.year) * 12 +
    (monthZeroBased - TIMELINE_START.month)
  );
}

function fromIndex(idx: number) {
  const total = TIMELINE_START.year * 12 + TIMELINE_START.month + idx;
  return { year: Math.floor(total / 12), month: total % 12 };
}

const TOTAL_STEPS = toIndex(TIMELINE_END.year, TIMELINE_END.month);

// Tight bounding box around historical Yekaterinburg centre (1905 layout)
const BBOX = { latMin: 56.815, latMax: 56.865, lngMin: 60.540, lngMax: 60.640 };
const SVG_W = 800;
const SVG_H = 540;

function projectLat(lat: number) {
  return ((BBOX.latMax - lat) / (BBOX.latMax - BBOX.latMin)) * SVG_H;
}
function projectLng(lng: number) {
  return ((lng - BBOX.lngMin) / (BBOX.lngMax - BBOX.lngMin)) * SVG_W;
}

// Per-place label offsets to avoid overlap in dense clusters.
type AnchorType = "start" | "end" | "middle";
const LABEL_OFFSETS: Record<
  string,
  { dx: number; dy: number; anchor: AnchorType }
> = {
  viz: { dx: -12, dy: -10, anchor: "end" },
  "viz-narodny-dom": { dx: 12, dy: 10, anchor: "start" },
  kafedralnaya: { dx: -12, dy: 4, anchor: "end" },
  "music-school": { dx: 12, dy: 4, anchor: "start" },
  theater: { dx: 12, dy: 4, anchor: "start" },
  makarov: { dx: 12, dy: 4, anchor: "start" },
  yates: { dx: 12, dy: 4, anchor: "start" },
  loginov: { dx: -12, dy: 4, anchor: "end" },
};

export function TimeAtlas({ places, events }: TimeAtlasProps) {
  const searchParams = useSearchParams();
  const focusId = searchParams?.get("focus") ?? null;
  const focusDate = searchParams?.get("date") ?? null;

  const initialSelected =
    focusId && places.some((p) => p.id === focusId)
      ? focusId
      : places[0]?.id ?? null;

  const initialStep = useMemo(() => {
    // If a date is provided as YYYY-MM-DD, jump to its month.
    if (focusDate) {
      const d = new Date(focusDate);
      if (!Number.isNaN(d.getTime())) {
        return toIndex(d.getFullYear(), d.getMonth());
      }
    }
    // If only focus is given, jump to the FIRST event of that place
    // (so the user immediately sees the place "active").
    if (focusId) {
      const e = events
        .filter((ev) => ev.placeId === focusId)
        .sort((a, b) => a.date.localeCompare(b.date))[0];
      if (e) {
        const d = new Date(e.date);
        return toIndex(d.getFullYear(), d.getMonth());
      }
    }
    return toIndex(1905, 10);
  }, [focusDate, focusId, events]);

  const [step, setStep] = useState(initialStep);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelected);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(500);

  const mapRef = useRef<HTMLDivElement>(null);

  // When the URL focus changes (e.g., user re-navigates), update state.
  useEffect(() => {
    if (focusId && places.some((p) => p.id === focusId)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedId(focusId);
      const e = events
        .filter((ev) => ev.placeId === focusId)
        .sort((a, b) => a.date.localeCompare(b.date))[0];
      if (e) {
        const d = new Date(e.date);
        setStep(toIndex(d.getFullYear(), d.getMonth()));
      }
      const t = setTimeout(() => {
        mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return () => clearTimeout(t);
    }
  }, [focusId, events, places]);

  const cur = fromIndex(step);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= TOTAL_STEPS) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [playing, speed]);

  const activity = useMemo(() => {
    const map = new Map<string, HistoryEvent[]>();
    for (const place of places) map.set(place.id, []);
    for (const e of events) {
      const start = new Date(e.date);
      const end = e.dateEnd ? new Date(e.dateEnd) : start;
      const cursor = new Date(cur.year, cur.month, 1);
      const next = new Date(cur.year, cur.month + 1, 1);
      if (end >= cursor && start < next) {
        map.get(e.placeId)?.push(e);
      }
    }
    return map;
  }, [events, places, cur.year, cur.month]);

  const totalActiveEvents = useMemo(() => {
    let total = 0;
    for (const arr of activity.values()) total += arr.length;
    return total;
  }, [activity]);

  const activeOccasionCount = useMemo(() => {
    let count = 0;
    for (const arr of activity.values()) if (arr.length > 0) count++;
    return count;
  }, [activity]);

  const selectedPlace = places.find((p) => p.id === selectedId);
  const selectedEvents = selectedId ? activity.get(selectedId) ?? [] : [];
  const totalEventsForPlace = useMemo(() => {
    if (!selectedId) return 0;
    return events.filter((e) => e.placeId === selectedId).length;
  }, [events, selectedId]);

  return (
    <div
      ref={mapRef}
      className="mt-10 grid items-start gap-8 scroll-mt-24 lg:grid-cols-[minmax(0,1fr)_320px]"
    >
      <div className="doc-card relative overflow-hidden rounded-sm">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="paper" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M0 6L6 0" stroke="#c4a875" strokeOpacity="0.12" strokeWidth="0.4" />
            </pattern>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a4271c" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#a4271c" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width={SVG_W} height={SVG_H} fill="url(#paper)" />

          {/* City pond — северо-западная часть города, рядом с ВИЗом */}
          <path
            d="M 40 40 Q 130 60 200 110 Q 260 160 280 220 Q 270 280 220 290 Q 160 280 110 240 Q 70 180 40 100 Z"
            fill="rgba(120, 150, 180, 0.22)"
            stroke="#5a7a9a"
            strokeOpacity="0.5"
            strokeWidth="1.2"
          />

          {/* Iset river — впадает в пруд с севера и вытекает на юго-восток */}
          <path
            d="M 80 0 Q 90 20 70 50"
            fill="none"
            stroke="#5a7a9a"
            strokeOpacity="0.6"
            strokeWidth="1.5"
          />
          <path
            d="M 280 220 Q 360 280 460 320 Q 580 380 720 470"
            fill="none"
            stroke="#5a7a9a"
            strokeOpacity="0.6"
            strokeWidth="1.5"
          />

          {/* Главный проспект (восток-запад через центр) */}
          <line
            x1={20}
            y1={280}
            x2={SVG_W - 20}
            y2={280}
            stroke="#5a4a3a"
            strokeOpacity="0.32"
            strokeWidth="1.4"
          />
          <text
            x={SVG_W - 30}
            y={273}
            fontFamily="serif"
            fontSize="9"
            fontStyle="italic"
            fill="#5a4a3a"
            opacity={0.7}
            textAnchor="end"
          >
            Главный проспект
          </text>

          {/* Сетка кварталов */}
          {Array.from({ length: 4 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1={20}
              y1={150 + i * 90}
              x2={SVG_W - 20}
              y2={150 + i * 90}
              stroke="#5a4a3a"
              strokeOpacity="0.1"
              strokeWidth="0.6"
              strokeDasharray="2 5"
            />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={170 + i * 130}
              y1={20}
              x2={170 + i * 130}
              y2={SVG_H - 20}
              stroke="#5a4a3a"
              strokeOpacity="0.1"
              strokeWidth="0.6"
              strokeDasharray="2 5"
            />
          ))}

          {/* Compass */}
          <g transform="translate(740, 60)">
            <circle r="22" fill="none" stroke="#5a4a3a" strokeOpacity="0.4" strokeWidth="0.8" />
            <text x="0" y="-26" textAnchor="middle" fontFamily="serif" fontSize="11" fill="#5a4a3a">N</text>
            <text x="0" y="36" textAnchor="middle" fontFamily="serif" fontSize="11" fill="#5a4a3a">S</text>
            <text x="-30" y="4" textAnchor="middle" fontFamily="serif" fontSize="11" fill="#5a4a3a">W</text>
            <text x="30" y="4" textAnchor="middle" fontFamily="serif" fontSize="11" fill="#5a4a3a">E</text>
            <path d="M 0 -18 L 4 0 L 0 18 L -4 0 Z" fill="#a4271c" opacity={0.7} />
          </g>

          <text x="20" y="30" fontFamily="serif" fontSize="11" fill="#5a4a3a" letterSpacing="2">
            ЕКАТЕРИНБУРГЪ · СХЕМА 1905
          </text>
          <text x="130" y="170" fontFamily="serif" fontSize="9" fontStyle="italic" fill="#5a7a9a">
            Городской пруд
          </text>
          <text x="600" y="450" fontFamily="serif" fontSize="9" fontStyle="italic" fill="#5a7a9a">
            р. Исеть
          </text>
          <text x="20" y={SVG_H - 16} fontFamily="monospace" fontSize="10" fill="#5a4a3a">
            {MONTHS[cur.month]} {cur.year}
          </text>
          <text
            x={SVG_W - 20}
            y={SVG_H - 16}
            fontFamily="monospace"
            fontSize="10"
            fill="#5a4a3a"
            textAnchor="end"
          >
            {totalActiveEvents} соб. · {activeOccasionCount} очаг. · масштаб условный
          </text>

          {places.map((p) => {
            const cx = projectLng(p.lng);
            const cy = projectLat(p.lat);
            const evs = activity.get(p.id) ?? [];
            const active = evs.length > 0;
            const intensity = Math.min(evs.length, 3);
            const isSelected = selectedId === p.id;
            const isFocus = focusId === p.id;
            const baseR = active ? 6 + intensity : 5;
            // Custom label offsets so close clusters (ВИЗ + народный дом,
            // Кафедральная + Музучилище) don't overlap.
            const labelOffset =
              LABEL_OFFSETS[p.id] ?? { dx: 12, dy: 4, anchor: "start" };

            return (
              <g
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                style={{ cursor: "pointer" }}
                aria-label={p.name}
              >
                {/* Big hit area for easier click */}
                <circle cx={cx} cy={cy} r={26} fill="transparent" />

                {/* Focus highlight — when navigated from /dossier?focus=… */}
                {isFocus && (
                  <>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={42}
                      fill="none"
                      stroke="#a4271c"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      opacity={0.6}
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={60}
                      fill="none"
                      stroke="#a4271c"
                      strokeWidth="0.8"
                      opacity={0.5}
                      className="atlas-ring"
                    />
                  </>
                )}

                {active && (
                  <>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={26 + intensity * 4}
                      fill="url(#glow)"
                      className="atlas-glow"
                    />
                    {intensity >= 2 && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={32}
                        fill="none"
                        stroke="#a4271c"
                        strokeWidth="0.8"
                        opacity={0.6}
                        className="atlas-ring"
                      />
                    )}
                  </>
                )}

                <circle
                  cx={cx}
                  cy={cy}
                  r={isFocus ? baseR + 5 : isSelected ? baseR + 3 : baseR}
                  fill={active ? "#a4271c" : "#5a4a3a"}
                  stroke={isFocus || isSelected ? "#2b231b" : "#f4ecd8"}
                  strokeWidth={isFocus ? 3 : isSelected ? 2.5 : 2}
                  className={`atlas-marker ${
                    isFocus || isSelected ? "is-hover" : ""
                  }`}
                />

                <text
                  x={cx + labelOffset.dx}
                  y={cy + labelOffset.dy}
                  fontFamily="serif"
                  fontSize={isFocus || isSelected ? 14 : 13}
                  fill="#2b231b"
                  fontWeight={active || isSelected || isFocus ? 700 : 400}
                  textAnchor={labelOffset.anchor}
                >
                  {p.name}
                </text>
                {active && (
                  <text
                    x={cx + labelOffset.dx}
                    y={cy + labelOffset.dy + 14}
                    fontFamily="monospace"
                    fontSize="10"
                    fill="#a4271c"
                    textAnchor={labelOffset.anchor}
                  >
                    {evs.length} соб.
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <aside className="space-y-4">
        <motion.div
          key={`${cur.year}-${cur.month}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="doc-card rounded-sm p-5"
        >
          <p className="font-display text-xs uppercase tracking-widest text-ink-faded">
            Дата наблюдения
          </p>
          <p className="mt-1 font-display text-3xl text-ink">
            {MONTHS_FULL[cur.month]} {cur.year}
          </p>
          <p className="mt-1 text-xs text-ink-faded">
            активных очагов:{" "}
            <span className="font-bold text-accent">{activeOccasionCount}</span>
            {" из "}
            {places.length}
            {" · событий в этом месяце: "}
            <span className="font-bold text-accent">{totalActiveEvents}</span>
          </p>
        </motion.div>

        <AnimatePresence mode="wait" initial={false}>
          {selectedPlace ? (
            <motion.div
              key={selectedPlace.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
              className="doc-card min-h-[260px] rounded-sm p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-xs uppercase tracking-widest text-ink-faded">
                    Очаг
                  </p>
                  <h3 className="mt-1 font-display text-xl text-ink">
                    {selectedPlace.name}
                  </h3>
                </div>
                <span className="rounded-sm bg-ink/5 px-2 py-0.5 text-[10px] uppercase tracking-widest text-ink-faded">
                  всего {totalEventsForPlace} соб.
                </span>
              </div>
              <p className="mt-2 text-sm text-ink/80">{selectedPlace.role}</p>
              <p className="mt-2 text-xs text-ink/70 leading-relaxed">
                {selectedPlace.summary}
              </p>
              {selectedEvents.length > 0 ? (
                <>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-accent">
                    В {MONTHS_FULL[cur.month].toLowerCase()} {cur.year}
                  </p>
                  <ul className="mt-1 space-y-2 text-xs">
                    {selectedEvents.map((e, i) => {
                      const chapterId = EVENT_TO_CHAPTER[e.id];
                      return (
                        <motion.li
                          key={e.id}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-l-2 border-accent/60 pl-2"
                        >
                          {chapterId ? (
                            <Link
                              href={`/chronicle#${chapterId}` as never}
                              className="block hover:text-accent"
                            >
                              <p className="font-display text-ink hover:text-accent">
                                {e.title} →
                              </p>
                              <p className="text-ink-faded">{e.summary}</p>
                            </Link>
                          ) : (
                            <>
                              <p className="font-display text-ink">{e.title}</p>
                              <p className="text-ink-faded">{e.summary}</p>
                            </>
                          )}
                        </motion.li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <p className="mt-3 rounded-sm bg-ink/5 px-3 py-2 text-xs text-ink-faded">
                  В этом месяце документированной активности по фондам нет.
                  Передвиньте диск времени, чтобы найти моменты, когда этот
                  очаг был активен.
                </p>
              )}
              {selectedPlace.source && (
                <p className="mt-3 border-t border-dashed border-ink/30 pt-2 text-[10px] text-ink-faded">
                  {selectedPlace.source}
                </p>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="rounded-sm border border-ink/30 p-3 text-xs text-ink-faded">
          Клик / наведение по очагу — открыть карточку. ▶ — автопроигрывание
          времени. Метки на оси — даты документированных событий.
        </div>

        <div className="doc-card rounded-sm p-4">
          <p className="font-display text-xs uppercase tracking-widest text-ink-faded">
            Все события на карте · {events.length}
          </p>
          <ul className="mt-2 max-h-64 space-y-1 overflow-y-auto pr-1 text-xs">
            {events
              .slice()
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((e) => {
                const d = new Date(e.date);
                const isCurrent =
                  d.getFullYear() === cur.year && d.getMonth() === cur.month;
                const chapterId = EVENT_TO_CHAPTER[e.id];
                return (
                  <li key={e.id} className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(toIndex(d.getFullYear(), d.getMonth()));
                        setSelectedId(e.placeId);
                      }}
                      className={`block flex-1 rounded px-2 py-1.5 text-left transition ${
                        isCurrent
                          ? "bg-accent/10 text-accent"
                          : "text-ink/80 hover:bg-ink/5"
                      }`}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">
                        {d.toLocaleDateString("ru-RU", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        })}
                      </span>
                      <br />
                      <span className="font-display">{e.title}</span>
                    </button>
                    {chapterId && (
                      <Link
                        href={`/chronicle#${chapterId}` as never}
                        className="flex items-center px-1.5 text-[10px] text-ink-faded hover:text-accent"
                        title="К сцене в хронике"
                      >
                        →
                      </Link>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      </aside>

      <div className="lg:col-span-2">
        <TimeDial
          step={step}
          totalSteps={TOTAL_STEPS}
          onChange={setStep}
          events={events}
          playing={playing}
          onPlay={() => {
            if (step >= TOTAL_STEPS) setStep(0);
            setPlaying((p) => !p);
          }}
          speed={speed}
          onSpeedChange={setSpeed}
        />
      </div>
    </div>
  );
}

interface TimeDialProps {
  step: number;
  totalSteps: number;
  onChange: (n: number) => void;
  events: HistoryEvent[];
  playing: boolean;
  onPlay: () => void;
  speed: number;
  onSpeedChange: (n: number) => void;
}

function TimeDial({
  step,
  totalSteps,
  onChange,
  events,
  playing,
  onPlay,
  speed,
  onSpeedChange,
}: TimeDialProps) {
  const eventOffsets = useMemo(() => {
    return events
      .map((e) => {
        const d = new Date(e.date);
        return {
          offset: toIndex(d.getFullYear(), d.getMonth()),
          title: e.title,
        };
      })
      .filter((n) => n.offset >= 0 && n.offset <= totalSteps);
  }, [events, totalSteps]);

  const labels = useMemo(() => {
    const out: { idx: number; label: string }[] = [];
    for (let i = 0; i <= totalSteps; i += 3) {
      const { year, month } = fromIndex(i);
      out.push({ idx: i, label: `${MONTHS[month]} ${String(year).slice(2)}` });
    }
    return out;
  }, [totalSteps]);

  return (
    <div className="doc-card relative mt-6 rounded-sm p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="font-display text-xs uppercase tracking-widest text-ink-faded">
          Временной диск · декабрь 1904 → декабрь 1907
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPlay}
            className="rounded border border-accent bg-accent px-3 py-1 text-xs text-paper hover:bg-accent/85"
          >
            {playing ? "❚❚ Пауза" : step >= totalSteps ? "↺ Снова" : "▶ Запустить"}
          </button>
          <button
            type="button"
            onClick={() => onChange(Math.max(0, step - 1))}
            className="rounded border border-ink/30 px-2 py-1 text-xs hover:bg-ink/5"
            aria-label="Назад на месяц"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => onChange(Math.min(totalSteps, step + 1))}
            className="rounded border border-ink/30 px-2 py-1 text-xs hover:bg-ink/5"
            aria-label="Вперёд на месяц"
          >
            →
          </button>
          <button
            type="button"
            onClick={() => onChange(toIndex(1905, 10))}
            className="rounded border border-ink/30 px-2 py-1 text-xs hover:bg-ink/5"
            title="Ноябрь 1905"
          >
            ↺
          </button>
          <select
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="rounded border border-ink/30 bg-paper px-2 py-1 text-xs"
            aria-label="Скорость"
          >
            <option value="1000">×1</option>
            <option value="500">×2</option>
            <option value="250">×4</option>
            <option value="120">×8</option>
          </select>
        </div>
      </div>

      <div className="relative mt-6 h-20">
        <div className="absolute inset-x-0 top-7 h-px bg-ink/30" />
        {eventOffsets.map((e, i) => (
          <span
            key={i}
            className="absolute top-4 h-7 w-px bg-accent/70"
            style={{ left: `${(e.offset / totalSteps) * 100}%` }}
            title={e.title}
          />
        ))}
        {labels.map(({ idx, label }) => (
          <span
            key={idx}
            className="absolute top-12 -translate-x-1/2 text-[10px] font-mono uppercase tracking-wider text-ink-faded"
            style={{ left: `${(idx / totalSteps) * 100}%` }}
          >
            {label}
          </span>
        ))}
        <span
          className="pointer-events-none absolute top-2 h-11 w-[3px] bg-accent shadow-md transition-[left] duration-200"
          style={{ left: `${(step / totalSteps) * 100}%` }}
        />
        <input
          type="range"
          min={0}
          max={totalSteps}
          value={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-x-0 top-4 z-10 w-full appearance-none bg-transparent accent-accent"
          aria-label="Временной диск"
        />
      </div>
    </div>
  );
}
