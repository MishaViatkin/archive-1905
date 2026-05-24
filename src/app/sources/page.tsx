import { getSources } from "@/lib/content";
import type { SourceType } from "@/lib/types";

const TYPE_LABEL: Record<SourceType, string> = {
  archive: "Архивный фонд",
  collection: "Документальный сборник",
  periodical: "Периодическая печать",
  research: "Исследование",
};

const TYPE_COLOR: Record<SourceType, string> = {
  archive: "#7a1e15",
  collection: "#1f2a44",
  periodical: "#6b5326",
  research: "#3a4a3a",
};

const ORDER: SourceType[] = ["archive", "collection", "periodical", "research"];

export default function SourcesPage() {
  const sources = getSources();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="rule-thick-thin pt-3">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-faded">
          Раздел VI
        </p>
        <h1 className="mt-1 font-display text-5xl text-ink md:text-6xl">
          Картотека
        </h1>
        <p className="mt-3 max-w-2xl text-ink-faded">
          {sources.length} источников: документальные сборники, монографии и
          рецензируемые научные статьи. Все — опубликованные и общедоступные;
          архивных шифров работа сознательно не приводит.
        </p>
      </header>

      <div className="mt-10 space-y-12">
        {ORDER.map((type) => {
          const group = sources.filter((s) => s.type === type);
          if (group.length === 0) return null;
          return (
            <section key={type}>
              <div className="mb-5 flex items-baseline gap-3">
                <span
                  className="inline-block h-3 w-3"
                  style={{ background: TYPE_COLOR[type] }}
                />
                <h2 className="font-display text-2xl text-ink">
                  {TYPE_LABEL[type]}
                </h2>
                <span className="font-mono text-xs uppercase tracking-widest text-ink-faded">
                  · {group.length} записей
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {group.map((s, i) => (
                  <article
                    key={s.id}
                    id={s.id}
                    className="doc-card group relative scroll-mt-24 rounded-sm p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className="rounded-sm px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest"
                        style={{
                          background: TYPE_COLOR[type],
                          color: "#f4ecd8",
                        }}
                      >
                        {TYPE_LABEL[type]}
                      </span>
                      <span className="font-mono text-[10px] text-ink-faded">
                        № {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-snug text-ink">
                      {s.citation}
                    </p>
                    {s.fund && (
                      <p className="mt-2 font-mono text-xs text-ink-faded">
                        {s.fund}
                      </p>
                    )}
                    <p className="mt-3 border-t border-dashed border-ink/30 pt-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-faded">
                      id · {s.id}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
