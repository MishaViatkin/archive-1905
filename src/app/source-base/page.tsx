import Link from "next/link";
import { Stamp } from "@/components/ui/Stamp";
import { AnimatedSection } from "@/components/effects/AnimatedSection";

export default function SourceBasePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <AnimatedSection>
        <header className="rule-thick-thin pt-3">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-faded">
            Раздел V · Декларация
          </p>
          <h1 className="mt-1 font-display text-5xl text-ink md:text-6xl">
            Источниковая база
          </h1>
          <p className="mt-3 max-w-3xl text-ink-faded">
            Предварительное замечание из аналитической работы. Без этой
            страницы любые цифры на сайте были бы вводящими в заблуждение.
          </p>
        </header>
      </AnimatedSection>

      <AnimatedSection className="mt-10">
        <div className="doc-card relative rounded-sm p-6 md:p-8">
          <Stamp
            variant="classified"
            rotate={-6}
            className="absolute -top-4 -right-4"
          >
            Декларация
          </Stamp>

          <h2 className="font-display text-2xl text-ink">
            Только опубликованные источники
          </h2>
          <p className="mt-4 leading-relaxed text-ink/85">
            Настоящая работа опирается{" "}
            <strong>исключительно на опубликованные и общедоступные источники</strong>:
            документальные сборники советского периода, рецензируемые научные
            статьи (доступные через КиберЛенинку и НЭБ), монографии в фондах
            Библиотеки УрФУ. Сноски к каждому утверждению содержат указание на
            конкретный источник с пояснением его содержания и места хранения.
          </p>

          <h2 className="mt-8 font-display text-2xl text-ink">
            Прямые ссылки на архивные фонды не приводятся
          </h2>
          <p className="mt-4 leading-relaxed text-ink/85">
            Прямые ссылки на архивные фонды (ГАСО, ГАПК, ЦДООСО) в тексте
            работы <strong>не приводятся</strong>, поскольку авторы не проводили
            самостоятельную работу в читальных залах указанных архивов. Все
            упоминания архивных материалов даны исключительно через
            опубликованные научные издания — монографии А.В. Чернова, статьи
            В.П. Микитюка, документальные сборники 1956 и 1981 годов, — в
            которых исследователи уже ввели эти документы в научный оборот.
          </p>
          <p className="mt-3 leading-relaxed text-accent">
            Такой подход обеспечивает академическую прозрачность и исключает
            имитацию первичного источниковедческого поиска.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <h2 className="font-display text-2xl text-ink">Откуда взяты данные</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card
            tag="Документальные сборники"
            count="3"
            list={[
              "Большевики Среднего Урала (1956)",
              "Рабочее движение на Урале (1981)",
              "Обзор Пермской губернии за 1904 г.",
            ]}
            tone="#a4271c"
          />
          <Card
            tag="Монографии"
            count="4"
            list={[
              "Городецкий Е.Н. (1971) — Свердлов",
              "Ганелин Р.Ш. (1991) — самодержавие",
              "Лаверычев В.Я. (1967) — буржуазия",
              "Чернов А.В. (2005) — подполье",
            ]}
            tone="#3a4a3a"
          />
          <Card
            tag="Научные статьи"
            count="2"
            list={[
              "Микитюк В.П. (2010) — буржуазия",
              "Харитонов В.Л. (1993) — 1905→1917",
            ]}
            tone="#6b5326"
          />
        </div>
        <p className="mt-6 text-sm text-ink-faded">
          Всего <strong>9 источников</strong>. Места хранения и шифры —
          см. <Link href="/sources" className="text-accent hover:underline">картотеку</Link>.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mt-12">
        <div className="archive-dark rounded-sm p-8">
          <p className="font-display text-xs uppercase tracking-[0.3em] opacity-60">
            Что осталось за рамками работы
          </p>
          <h2 className="mt-2 max-w-3xl font-display text-2xl leading-snug">
            Ряд вопросов по-прежнему требует архивного исследования, которое
            выходит за рамки настоящей учебной работы.
          </h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            <li className="text-sm opacity-90">
              · Конкретные тиражи нелегальной литературы Екатеринбургского
              комитета РСДРП.
            </li>
            <li className="text-sm opacity-90">
              · Пообъектная разбивка сокращения рабочих в Екатеринбурге за
              1900–1904 гг.
            </li>
            <li className="text-sm opacity-90">
              · Точные данные о судебном преследовании участников боевых
              дружин.
            </li>
            <li className="text-sm opacity-90">
              · Имена жертв погрома 19 октября 1905 г. в опубликованных
              источниках не приведены.
            </li>
            <li className="text-sm opacity-90">
              · Посещаемость митингов в Музыкальном училище — оценки нет.
            </li>
            <li className="text-sm opacity-90">
              · Число рабочих дней по конкретным предприятиям Екатеринбурга.
            </li>
          </ul>
        </div>
      </AnimatedSection>
    </div>
  );
}

function Card({
  tag,
  count,
  list,
  tone,
}: {
  tag: string;
  count: string;
  list: string[];
  tone: string;
}) {
  return (
    <article className="doc-card rounded-sm p-5" style={{ borderTopColor: tone, borderTopWidth: 3 }}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
        {tag}
      </p>
      <p
        className="mt-1 font-display text-4xl font-bold"
        style={{ color: tone }}
      >
        {count}
      </p>
      <ul className="mt-3 space-y-1 text-xs text-ink/85">
        {list.map((l) => (
          <li key={l}>· {l}</li>
        ))}
      </ul>
    </article>
  );
}
