import { getImpact, getLegacy } from "@/lib/content";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/effects/AnimatedSection";
import type { LegacyType } from "@/lib/types";

const TYPE_LABEL: Record<LegacyType, string> = {
  political: "Политика",
  economic: "Экономика",
  symbolic: "Символика",
  violent: "Насилие",
  religious: "Религия",
  demographic: "Демография",
};

const TYPE_COLOR: Record<LegacyType, string> = {
  political: "#a4271c",
  economic: "#3a4a3a",
  symbolic: "#6b5326",
  violent: "#7a1e15",
  religious: "#4a2b1a",
  demographic: "#1f2a44",
};

export default function LegacyPage() {
  const legacy = getLegacy();
  const impact = getImpact();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <AnimatedSection>
        <header className="rule-thick-thin pt-3">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-faded">
            Раздел VI · Наследие
          </p>
          <h1 className="mt-1 font-display text-5xl text-ink md:text-6xl">
            1906 → 1991
          </h1>
          <p className="mt-3 max-w-3xl text-ink-faded">
            Революция 1905–1907 — не точка, а волна, разошедшаяся на восемьдесят
            с лишним лет. От «тихих» уступок 1906–1907 годов до решения 1991
            года не переименовывать Площадь 1905 года. Шесть измерений
            долгосрочного влияния и девять конкретных событий.
          </p>
        </header>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <h2 className="font-display text-3xl text-ink">
          Шесть измерений влияния
        </h2>
        <StaggerContainer className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {impact.map((dim) => (
            <StaggerItem
              key={dim.id}
              className="doc-card rounded-sm p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
                {dim.section}
              </p>
              <h3 className="mt-1 font-display text-xl text-ink">{dim.title}</h3>
              <p className="mt-2 text-sm font-medium text-accent">
                {dim.leadFact}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink/85">
                {dim.summary}
              </p>
              <p className="mt-3 border-t border-dashed border-ink/30 pt-2 text-xs italic text-ink/75">
                {dim.keyPoint}
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </AnimatedSection>

      <AnimatedSection className="mt-16">
        <h2 className="font-display text-3xl text-ink">
          Хронология долгого эха
        </h2>
        <p className="mt-2 text-sm text-ink-faded">
          От уступок 1906 года до возвращения Екатеринбургу его имени в 1991.
        </p>

        <ol className="mt-8 relative border-l-2 border-ink/30 pl-8">
          {legacy.map((l, i) => (
            <AnimatedSection
              key={l.id}
              delay={i * 0.06}
              y={20}
              className="relative mb-8"
            >
              <span className="absolute -left-[2.4rem] top-1 h-4 w-4 rounded-full border-2 border-accent bg-paper" />
              <p
                className="font-display text-sm uppercase tracking-[0.2em]"
                style={{ color: TYPE_COLOR[l.type] }}
              >
                {l.year}
              </p>
              <h3 className="mt-1 font-display text-2xl text-ink">{l.title}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink/85">
                {l.summary}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest text-ink-faded">
                <span
                  className="rounded-sm px-1.5 py-0.5 text-paper"
                  style={{ background: TYPE_COLOR[l.type] }}
                >
                  {TYPE_LABEL[l.type]}
                </span>
                <span>·</span>
                <span>{l.source}</span>
              </div>
            </AnimatedSection>
          ))}
        </ol>
      </AnimatedSection>

      <AnimatedSection className="mt-16">
        <div className="archive-dark rounded-sm p-8">
          <p className="font-display text-xs uppercase tracking-[0.3em] opacity-60">
            Финальный вывод работы
          </p>
          <h2 className="mt-2 max-w-3xl font-display text-2xl leading-snug md:text-3xl">
            Площадь 1905 года в сердце Екатеринбурга — живое напоминание о том,
            что события столетней давности остаются частью городской
            идентичности, а не только советской пропаганды.
          </h2>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest opacity-60">
            §7. Заключение · Долгосрочное значение для Свердловской области
          </p>
        </div>
      </AnimatedSection>
    </div>
  );
}
