import Link from "next/link";
import { getEnterprises } from "@/lib/content";
import { Stamp, StampCircle } from "@/components/ui/Stamp";

// Map enterprise id → relevant chronicle chapter + key person.
// Used by the chip links to deep-link instead of dumping the user
// at the top of /chronicle and /network.
const ENTERPRISE_LINKS: Record<
  string,
  { chapter?: string; person?: string; personName?: string }
> = {
  viz: { chapter: "viz-strike", person: "syromolotov", personName: "Сыромолотов" },
  makarov: { chapter: "council" },
  yates: { chapter: "council" },
  loginov: { chapter: "council" },
};

export default function DossierPage() {
  const enterprises = getEnterprises();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="rule-thick-thin pt-3">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-faded">
          Раздел IV
        </p>
        <h1 className="mt-1 font-display text-5xl text-ink md:text-6xl">
          Досье предприятий
        </h1>
        <p className="mt-3 max-w-2xl text-ink-faded">
          Картотечные карточки на четыре главные точки концентрации рабочих
          Екатеринбурга 1904 года. Из этих коллективов вышли депутаты Совета
          16 ноября 1905 года (плюс типографские рабочие и железнодорожные
          мастерские). Данные — Обзор Пермской губернии за 1904 г.
        </p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {enterprises.map((e, idx) => (
          <article
            key={e.id}
            className="doc-card relative rounded-sm p-6"
            style={{ transform: idx % 2 === 0 ? "rotate(-0.3deg)" : "rotate(0.4deg)" }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-dashed border-ink/40 pb-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
                  Картотечная карточка № {String(idx + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-1 font-display text-2xl text-ink">
                  {e.shortName}
                </h2>
                <p className="text-sm italic text-ink-faded">{e.name}</p>
              </div>
              <StampCircle
                topText={e.id === "viz" ? "ОСНОВНОЙ" : "НА КОНТРОЛЕ"}
                centerText={e.id === "viz" ? "I" : "II"}
                bottomText="1905"
              />
            </header>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <DossierRow label="Рабочих" value={e.workers} />
              <DossierRow label="Зарплата" value={e.wage} />
              <DossierRow label="Продукция" value={e.output} />
              <DossierRow label="Владелец" value={e.owner} />
            </dl>

            <p className="mt-4 font-display text-sm text-accent">{e.role}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/85">
              {e.notes}
            </p>

            {e.id === "viz" && (
              <Stamp
                variant="default"
                rotate={-8}
                className="absolute bottom-4 right-4"
              >
                Очаг стачки
              </Stamp>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-dashed border-ink/20 pt-3 text-[10px] uppercase tracking-widest text-ink-faded">
              <Link
                href={`/atlas?focus=${e.id}` as never}
                className="rounded-full border border-ink/30 px-2.5 py-0.5 hover:border-accent hover:text-accent"
              >
                📍 показать на карте
              </Link>
              {(() => {
                const links = ENTERPRISE_LINKS[e.id];
                const chronicleHref = links?.chapter
                  ? `/chronicle#${links.chapter}`
                  : "/chronicle";
                const chronicleLabel =
                  e.id === "viz"
                    ? "🕰 стачка 7–14 мая"
                    : links?.chapter
                      ? "🕰 совет 16 ноября"
                      : "🕰 в хронике";
                const personHref = links?.person
                  ? `/network?focus=${links.person}`
                  : "/network";
                const personLabel = links?.personName
                  ? `👥 ${links.personName}`
                  : "👥 фигуранты";
                return (
                  <>
                    <Link
                      href={chronicleHref as never}
                      className="rounded-full border border-ink/30 px-2.5 py-0.5 hover:border-accent hover:text-accent"
                    >
                      {chronicleLabel}
                    </Link>
                    <Link
                      href={personHref as never}
                      className="rounded-full border border-ink/30 px-2.5 py-0.5 hover:border-accent hover:text-accent"
                    >
                      {personLabel}
                    </Link>
                  </>
                );
              })()}
            </div>
          </article>
        ))}
      </div>

      <section className="mt-12 doc-card rounded-sm p-6">
        <h2 className="font-display text-2xl text-ink">
          Распределение депутатов в Совете 16 ноября 1905
        </h2>
        <p className="mt-1 text-sm text-ink-faded">
          Всего 32 человека · 6 предприятий
        </p>
        <DeputyBars
          rows={[
            { name: "ВИЗ", count: 12 },
            { name: "Фабрика Макаровых", count: 5 },
            { name: "Завод Ятеса", count: 4 },
            { name: "Фабрика Логинова", count: 3 },
            { name: "Типографские рабочие", count: 4 },
            { name: "Железнодорожные мастерские", count: 4 },
          ]}
        />
      </section>
    </div>
  );
}

function DossierRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
        {label}
      </dt>
      <dd className="font-display text-base text-ink">{value}</dd>
    </>
  );
}

function DeputyBars({ rows }: { rows: { name: string; count: number }[] }) {
  const max = Math.max(...rows.map((r) => r.count));
  return (
    <ul className="mt-4 space-y-2">
      {rows.map((r) => (
        <li key={r.name} className="flex items-center gap-3 text-sm">
          <span className="w-56 truncate text-ink">{r.name}</span>
          <span
            className="h-5 bg-accent/80"
            style={{ width: `${(r.count / max) * 100}%`, minWidth: 8 }}
          />
          <span className="font-mono text-xs text-ink-faded">{r.count}</span>
        </li>
      ))}
    </ul>
  );
}
