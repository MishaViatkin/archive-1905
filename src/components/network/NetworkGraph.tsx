"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  Connection,
  ConnectionType,
  Person,
  PersonSide,
} from "@/lib/types";

const SIDE_COLOR: Record<PersonSide, string> = {
  revolutionary: "#a4271c",
  authority: "#1f2a44",
  victim: "#4a4a4a",
  observer: "#6b5326",
};

const SIDE_LABEL: Record<PersonSide, string> = {
  revolutionary: "революционеры",
  authority: "власть",
  victim: "жертвы",
  observer: "наблюдатели",
};

const SIDE_ORDER: PersonSide[] = [
  "revolutionary",
  "authority",
  "observer",
  "victim",
];

const TYPE_STYLE: Record<
  ConnectionType,
  { color: string; label: string }
> = {
  allied: { color: "#a4271c", label: "союз" },
  led: { color: "#a4271c", label: "руководство" },
  documented: { color: "#1f2a44", label: "документировал" },
  opposed: { color: "#7a1e15", label: "противодействие" },
  killed: { color: "#2b231b", label: "убит при погроме" },
};

interface NetworkProps {
  people: Person[];
  connections: Connection[];
}

export function NetworkGraph({ people, connections }: NetworkProps) {
  const [activeId, setActiveId] = useState<string>("sverdlov");
  const [query, setQuery] = useState("");
  const [activeSides, setActiveSides] = useState<Set<PersonSide>>(
    () => new Set(SIDE_ORDER),
  );

  const filteredPeople = useMemo(() => {
    const q = query.trim().toLowerCase();
    return people
      .filter((p) => activeSides.has(p.side))
      .filter((p) => {
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q) ||
          (p.alias?.toLowerCase().includes(q) ?? false) ||
          p.bio.toLowerCase().includes(q)
        );
      });
  }, [people, activeSides, query]);

  const grouped = useMemo(() => {
    const map: Record<PersonSide, Person[]> = {
      revolutionary: [],
      authority: [],
      observer: [],
      victim: [],
    };
    for (const p of filteredPeople) map[p.side].push(p);
    return map;
  }, [filteredPeople]);

  const activePerson = people.find((p) => p.id === activeId);
  const activeLinks = useMemo(
    () =>
      connections.filter((c) => c.from === activeId || c.to === activeId),
    [connections, activeId],
  );

  const sideCounts = useMemo(() => {
    const counts: Record<PersonSide, number> = {
      revolutionary: 0,
      authority: 0,
      observer: 0,
      victim: 0,
    };
    for (const p of people) counts[p.side]++;
    return counts;
  }, [people]);

  const connectionStats = useMemo(() => {
    const counts: Record<ConnectionType, number> = {
      allied: 0,
      led: 0,
      documented: 0,
      opposed: 0,
      killed: 0,
    };
    for (const c of connections) counts[c.type]++;
    return counts;
  }, [connections]);

  const toggleSide = (side: PersonSide) => {
    setActiveSides((prev) => {
      const next = new Set(prev);
      if (next.has(side)) next.delete(side);
      else next.add(side);
      if (next.size === 0) next.add(side);
      return next;
    });
  };

  return (
    <div className="mt-8 space-y-8">
      {/* Stats strip */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SIDE_ORDER.map((side) => (
          <div
            key={side}
            className="doc-card rounded-sm p-4"
            style={{ borderTopColor: SIDE_COLOR[side], borderTopWidth: 3 }}
          >
            <p className="font-display text-xs uppercase tracking-widest text-ink-faded">
              {SIDE_LABEL[side]}
            </p>
            <p
              className="mt-1 font-display text-3xl font-bold"
              style={{ color: SIDE_COLOR[side] }}
            >
              {sideCounts[side]}
            </p>
            <p className="mt-1 text-xs text-ink-faded">
              {sideDescription(side)}
            </p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по фигурантам…"
          className="min-w-[200px] flex-1 rounded border border-ink/30 bg-paper/80 px-3 py-2 text-sm outline-none placeholder:text-ink-faded/60 focus:border-accent"
        />
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {SIDE_ORDER.map((side) => {
            const on = activeSides.has(side);
            return (
              <button
                key={side}
                type="button"
                onClick={() => toggleSide(side)}
                className={`rounded-full border px-3 py-1 transition ${
                  on
                    ? "border-current"
                    : "border-ink/30 text-ink-faded opacity-60"
                }`}
                style={
                  on
                    ? { color: SIDE_COLOR[side], borderColor: SIDE_COLOR[side] }
                    : {}
                }
              >
                <span
                  className="mr-1 inline-block h-2 w-2 rounded-full"
                  style={{ background: SIDE_COLOR[side] }}
                />
                {SIDE_LABEL[side]} · {grouped[side].length}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Columns of cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SIDE_ORDER.map((side) => (
            <section key={side} className="flex flex-col gap-3">
              <header
                className="flex items-center gap-2 border-b-2 pb-1 text-xs uppercase tracking-[0.2em]"
                style={{
                  borderColor: SIDE_COLOR[side],
                  color: SIDE_COLOR[side],
                }}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: SIDE_COLOR[side] }}
                />
                {SIDE_LABEL[side]}
                <span className="ml-auto font-mono opacity-60">
                  {grouped[side].length}
                </span>
              </header>

              {grouped[side].length === 0 ? (
                <p className="text-xs italic text-ink-faded">
                  Нет в текущем фильтре.
                </p>
              ) : (
                grouped[side].map((p, i) => (
                  <PersonCard
                    key={p.id}
                    person={p}
                    active={activeId === p.id}
                    index={i}
                    linkCount={
                      connections.filter(
                        (c) => c.from === p.id || c.to === p.id,
                      ).length
                    }
                    onSelect={setActiveId}
                  />
                ))
              )}
            </section>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <AnimatePresence mode="wait" initial={false}>
            {activePerson && (
              <motion.div
                key={activePerson.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="doc-card relative rounded-sm p-5"
              >
                <span
                  className="absolute -top-2 -right-2 rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-widest"
                  style={{
                    background: SIDE_COLOR[activePerson.side],
                    color: "#f4ecd8",
                  }}
                >
                  {SIDE_LABEL[activePerson.side]}
                </span>
                <p className="font-display text-xs uppercase tracking-widest text-ink-faded">
                  Подробная карточка
                </p>
                <h2 className="mt-1 font-display text-xl text-ink">
                  {activePerson.name}
                </h2>
                {activePerson.alias && (
                  <p className="text-xs italic text-ink-faded">
                    «{activePerson.alias}»
                  </p>
                )}
                {activePerson.years && (
                  <p className="mt-1 font-mono text-xs text-ink-faded">
                    {activePerson.years}
                  </p>
                )}
                <p className="mt-2 text-sm font-medium text-ink">
                  {activePerson.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink/85">
                  {activePerson.bio}
                </p>
                {activePerson.fate && (
                  <p className="mt-2 text-sm leading-relaxed text-accent/90">
                    <span className="uppercase tracking-widest text-[10px]">
                      Судьба ·{" "}
                    </span>
                    {activePerson.fate}
                  </p>
                )}
                {activePerson.source && (
                  <p className="mt-3 border-t border-dashed border-ink/30 pt-2 text-[11px] text-ink-faded">
                    {activePerson.source}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="doc-card rounded-sm p-4">
            <p className="font-display text-xs uppercase tracking-widest text-ink-faded">
              Связи фигуранта · {activeLinks.length}
            </p>
            <ul className="mt-2 space-y-2 text-xs">
              {activeLinks.map((c, i) => {
                const otherId = c.from === activeId ? c.to : c.from;
                const other = people.find((p) => p.id === otherId);
                if (!other) return null;
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-2"
                  >
                    <span
                      className="mt-1 inline-block h-2 w-2 rounded-full"
                      style={{ background: TYPE_STYLE[c.type].color }}
                    />
                    <span>
                      <button
                        type="button"
                        className="font-display text-ink hover:text-accent"
                        onClick={() => setActiveId(other.id)}
                      >
                        {other.name}
                      </button>
                      <span className="ml-1 text-ink-faded">
                        · {c.label ?? TYPE_STYLE[c.type].label}
                      </span>
                    </span>
                  </motion.li>
                );
              })}
              {activeLinks.length === 0 && (
                <li className="text-ink-faded">
                  У этого фигуранта нет зафиксированных связей.
                </li>
              )}
            </ul>
          </div>

          <div className="doc-card rounded-sm p-4">
            <p className="font-display text-xs uppercase tracking-widest text-ink-faded">
              Связи в архиве · {connections.length}
            </p>
            <ul className="mt-2 space-y-1 text-xs">
              {(Object.entries(connectionStats) as [
                ConnectionType,
                number,
              ][]).map(([type, count]) => (
                <li key={type} className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: TYPE_STYLE[type].color }}
                  />
                  <span className="text-ink">{TYPE_STYLE[type].label}</span>
                  <span className="ml-auto font-mono text-ink-faded">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PersonCard({
  person,
  active,
  index,
  linkCount,
  onSelect,
}: {
  person: Person;
  active: boolean;
  index: number;
  linkCount: number;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      onClick={() => onSelect(person.id)}
      className={`doc-card relative w-full rounded-sm p-4 text-left transition ${
        active ? "ring-2 ring-offset-2 ring-offset-paper" : ""
      }`}
      style={{
        boxShadow: active
          ? `inset 0 0 0 1px ${SIDE_COLOR[person.side]}`
          : undefined,
        ...(active
          ? ({
              "--tw-ring-color": SIDE_COLOR[person.side],
            } as React.CSSProperties)
          : {}),
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-bold"
          style={{
            borderColor: SIDE_COLOR[person.side],
            color: SIDE_COLOR[person.side],
            background: "#f4ecd8",
          }}
        >
          {initials(person.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold leading-tight text-ink">
            {person.name}
          </p>
          {person.alias && (
            <p className="truncate text-[11px] italic text-ink-faded">
              «{person.alias}»
            </p>
          )}
          {person.years && (
            <p className="font-mono text-[10px] text-ink-faded">
              {person.years}
            </p>
          )}
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-xs text-ink/80">{person.role}</p>
      <div className="mt-3 flex items-center justify-between border-t border-dashed border-ink/20 pt-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
          связей · {linkCount}
        </span>
        <span
          className="text-[10px] uppercase tracking-widest"
          style={{ color: SIDE_COLOR[person.side] }}
        >
          Открыть →
        </span>
      </div>
    </motion.button>
  );
}

function sideDescription(side: PersonSide): string {
  switch (side) {
    case "revolutionary":
      return "Подполье, Совет, дружины";
    case "authority":
      return "Жандармы, полиция, корона";
    case "observer":
      return "Инспекторы, купечество, пресса";
    case "victim":
      return "Жертвы погрома 19 октября 1905";
  }
}

function initials(name: string) {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
