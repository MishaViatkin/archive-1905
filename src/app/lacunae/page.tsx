import { getLacunae } from "@/lib/content";
import { Stamp } from "@/components/ui/Stamp";

export default function LacunaePage() {
  const lacunae = getLacunae();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="rule-thick-thin pt-3">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-faded">
          Раздел V · Белые пятна
        </p>
        <h1 className="mt-1 font-display text-5xl text-ink md:text-6xl">
          Лакуны
        </h1>
        <p className="mt-3 max-w-2xl text-ink-faded">
          Семь точек, в которых работа фиксирует отсутствие верифицированных
          данных. Это не пробелы аналитики — это адресный запрос к архивам
          ГАСО, ГАПК, ЦДООСО. Косвенные сведения приведены только для
          ориентира и не должны цитироваться как факт.
        </p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {lacunae.map((l, i) => (
          <article
            key={l.id}
            id={l.id}
            className="doc-card relative scroll-mt-24 rounded-sm p-6"
            style={{ transform: i % 2 === 0 ? "rotate(-0.5deg)" : "rotate(0.3deg)" }}
          >
            <header className="flex items-start justify-between gap-3 border-b border-dashed border-ink/30 pb-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
                  Формуляр № {String(i + 1).padStart(2, "0")} · {l.section}
                </p>
                <p className="mt-1 font-display text-lg text-ink">
                  Запрос в архив
                </p>
              </div>
              <Stamp variant="lacuna" rotate={6}>
                ВЫЯСНИТЬ
              </Stamp>
            </header>

            <div className="mt-4 space-y-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
                  Содержание запроса
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink">
                  {l.question}
                </p>
              </div>

              <div className="rounded-sm border border-dashed border-stamp/50 bg-stamp/5 p-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-stamp">
                  Архивный адрес
                </p>
                <p className="mt-1 font-mono text-sm text-stamp">
                  {l.archiveHint}
                </p>
              </div>

              {l.indirectData && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
                    Косвенные сведения · не для цитирования
                  </p>
                  <p className="mt-1 text-xs italic text-ink/70">
                    {l.indirectData}
                  </p>
                </div>
              )}
            </div>

            <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-ink-faded">
              id · {l.id}
            </p>
          </article>
        ))}
      </div>

      <section className="archive-dark mt-16 rounded-sm p-8">
        <p className="font-display text-xs uppercase tracking-[0.3em] opacity-60">
          Методологическое замечание
        </p>
        <h2 className="mt-2 max-w-3xl font-display text-2xl">
          Каждая лакуна — это не пустота, а архивный адрес. Работа фиксирует
          места, где советский нарратив 1956 года не довёл цифры до первичных
          материалов.
        </h2>
        <p className="mt-4 max-w-3xl text-sm opacity-80">
          Все семь лакун требуют физической работы с фондами ГАСО (ф. 11, ф.
          185), ГАПК (ф. 65) и ЦДООСО (ф. 41). До такой работы — никакие цифры
          из косвенных сведений не должны воспроизводиться как
          верифицированный факт.
        </p>
      </section>
    </div>
  );
}
