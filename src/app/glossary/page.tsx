import { getGlossary } from "@/lib/content";
import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { GlossaryGrid } from "@/components/glossary/GlossaryGrid";

export default function GlossaryPage() {
  const terms = getGlossary();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <AnimatedSection>
        <header className="rule-thick-thin pt-3">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-faded">
            Раздел VII
          </p>
          <h1 className="mt-1 font-display text-5xl text-ink md:text-6xl">
            Словарь
          </h1>
          <p className="mt-3 max-w-3xl text-ink-faded">
            {terms.length} терминов — от РСДРП и «горнозаводских крестьян» до
            ВЦИК и «генеральной репетиции». Каждое определение взято из текста
            аналитической работы или её источников. Используйте поиск (⌘K),
            чтобы найти термин быстрее.
          </p>
        </header>
      </AnimatedSection>

      <AnimatedSection className="mt-10">
        <GlossaryGrid terms={terms} />
      </AnimatedSection>
    </div>
  );
}
