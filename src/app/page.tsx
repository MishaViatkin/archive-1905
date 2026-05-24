import Link from "next/link";
import { mainNav } from "@/lib/navigation";
import { Stamp, StampCircle } from "@/components/ui/Stamp";
import { HomeMasthead } from "@/components/home/HomeMasthead";
import { StatGrid } from "@/components/home/StatGrid";
import { DocumentOfDay } from "@/components/home/DocumentOfDay";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/effects/AnimatedSection";
import { StampReveal } from "@/components/effects/StampReveal";
import { getEvents, getStats, getTermById } from "@/lib/content";
import { Term } from "@/components/effects/Term";

export default function HomePage() {
  const stats = getStats();
  const events = getEvents();
  const tCouncil = getTermById("sovet-rabochih")!;
  const tBloody = getTermById("krovavoe-voskresenye")!;
  const tWindow = getTermById("okno-legalnosti")!;
  const tManifest = getTermById("manifest-17-oktyabrya")!;
  const tVis = getTermById("vis")!;
  const tWar = getTermById("russko-yaponskaya-voyna")!;
  const tRehearsal = getTermById("generalnaya-repetitsiya")!;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <HomeMasthead />

      <AnimatedSection delay={0.1}>
        <article className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
          <div>
            <p className="font-display text-3xl leading-tight text-ink md:text-4xl">
              «Генеральная репетиция» — не метафора, а верифицируемый
              исторический вывод
            </p>
            <p className="mt-3 text-sm uppercase tracking-[0.25em] text-ink-faded">
              Передовица номера · Аналитическая работа УрФУ
            </p>

            <div className="newspaper-cols mt-6 text-[0.95rem] leading-relaxed text-ink/90">
              <p className="drop-cap">
                К 1905 году условия труда на металлургических предприятиях
                Урала оставались крайне тяжёлыми: 11–14-часовой рабочий день,
                штрафы вместо повышения, сверхурочные без отдельной оплаты.
                Промышленный кризис 1900–1903 годов сократил число рабочих на
                20–25%. <Term term={tWar} /> усилила интенсивность труда без
                роста заработка. <Term term={tBloody} /> 9 января 1905 года
                стало переломным: только в январе по всей России бастовали
                более 440 тысяч человек.
              </p>
              <p>
                1 мая в Екатеринбурге проходит первая открытая политическая
                демонстрация с красным знаменем. 7–14 мая —{" "}
                <Term term={tVis} /> останавливают семидневная стачка с пятью
                требованиями: 9-часовой день, +15–20% к расценкам, отмена
                штрафов, вежливое обращение, оплата простоя. Администрация
                отвергает основные требования.
              </p>
              <p>
                <Term term={tManifest} /> открывает <Term term={tWindow} /> —
                72 дня публичной свободы. За это время в городе проходит не
                менее 28 митингов с аудиториями до 700 человек, главное лицо —
                Яков Свердлов («товарищ Андрей»). 19 октября — погром на
                Кафедральной площади: двое погибших и не менее 18 раненых
                учащихся. 16 ноября в Верх-Исетском народном доме избран{" "}
                <Term term={tCouncil} /> — 32 человека от 6 предприятий,
                председатель Свердлов. 28 декабря — чрезвычайное положение,
                разгром.
              </p>
              <p>
                Двенадцать лет спустя Совет вернётся — почти в той же форме.
                По В.Л. Харитонову (1993), <Term term={tRehearsal} /> 1905
                года оказывается не идеологической фигурой, а верифицируемым
                выводом: отработаны все ключевые институты, воспроизведённые
                в 1917-м. Для Екатеринбурга преемственность подкреплена и
                персонально: Свердлов 1905-го стал Свердловым 1917-го —
                председателем ВЦИК.
              </p>
            </div>
          </div>

          <aside className="space-y-6 border-l-2 border-dotted border-ink/30 pl-6 print:hidden">
            <StampReveal className="relative">
              <div className="doc-card relative rounded-sm p-5">
                <Stamp
                  variant="classified"
                  rotate={-8}
                  className="absolute -top-4 -right-3"
                >
                  Цитата
                </Stamp>
                <p className="font-display text-xs uppercase tracking-widest text-ink-faded">
                  Из протокола 16 ноября 1905
                </p>
                <p className="mt-2 font-serif text-sm italic leading-relaxed text-ink">
                  «Председателем избран Я.М. Свердлов. Решения: солидарность
                  с Москвой и Петербургом, рабочая милиция при заводских
                  комитетах, требование помещений у управы, делегация к
                  губернатору об отмене военного положения.»
                </p>
                <p className="mt-3 text-xs text-ink-faded">
                  Большевики Среднего Урала (1956)
                </p>
              </div>
            </StampReveal>

            <AnimatedSection delay={0.15}>
              <div className="doc-card relative rounded-sm p-5">
                <StampCircle
                  topText="ТОЛЬКО"
                  centerText="9"
                  bottomText="ОПУБЛ."
                  className="absolute -top-3 -right-3"
                />
                <p className="font-display text-xs uppercase tracking-widest text-ink-faded">
                  Источниковая база
                </p>
                <ul className="mt-2 space-y-1 text-xs text-ink/85">
                  <li>· 3 документальных сборника</li>
                  <li>· 4 монографии</li>
                  <li>· 2 рецензируемые статьи</li>
                </ul>
                <Link
                  href="/source-base"
                  className="mt-3 inline-block text-xs uppercase tracking-widest text-accent hover:underline"
                >
                  Открыть декларацию →
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.25}>
              <div className="border border-ink/30 p-4">
                <p className="font-display text-xs uppercase tracking-widest text-ink-faded">
                  Прямой переход
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>
                    <Link href="/chronicle" className="hover:text-accent">
                      → Хроника (11 сцен)
                    </Link>
                  </li>
                  <li>
                    <Link href="/atlas" className="hover:text-accent">
                      → Атлас Екатеринбурга 1905
                    </Link>
                  </li>
                  <li>
                    <Link href="/network" className="hover:text-accent">
                      → Сеть 14 фигурантов
                    </Link>
                  </li>
                  <li>
                    <Link href="/legacy" className="hover:text-accent">
                      → 1905 → 1917 → 1991
                    </Link>
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </aside>
        </article>
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="mt-16">
        <div className="rule-thick-thin pt-3">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-faded">
            Сводная статистика
          </p>
          <h2 className="mt-1 font-display text-3xl text-ink">
            Цифры из опубликованных источников
          </h2>
        </div>
        <StatGrid stats={stats} />
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <DocumentOfDay events={events} />
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="mt-16">
        <div className="rule-thick-thin pt-3">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-faded">
            Войти в материал
          </p>
          <h2 className="mt-1 font-display text-3xl text-ink">Восемь разделов</h2>
        </div>

        <StaggerContainer className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {mainNav.map((item) => (
            <StaggerItem key={item.href}>
              <Link
                href={item.href as never}
                className="doc-card group relative block rounded-sm p-5 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="font-display text-5xl text-accent/30 group-hover:text-accent/60">
                  {item.number}
                </span>
                <h3 className="mt-1 font-display text-xl text-ink">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm leading-snug text-ink-faded">
                  {item.description}
                </p>
                <span className="mt-3 inline-block text-xs uppercase tracking-widest text-accent opacity-0 transition group-hover:opacity-100">
                  Открыть →
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="mt-16">
        <div className="archive-dark rounded-sm p-8">
          <p className="font-display text-xs uppercase tracking-[0.3em] opacity-60">
            Три ресурса 1905 года для 1917-го
          </p>
          <h2 className="mt-2 max-w-3xl font-display text-2xl leading-snug md:text-3xl">
            «Революция 1905 года создала в Екатеринбурге три ресурса,
            определившие события 1917 года: <em>кадровый</em>{" "}
            (революционеры, прошедшие практическую школу),{" "}
            <em>институциональный</em> (организационные формы Совета, дружин,
            комитетов) и <em>символический</em> (коллективная память,
            закреплённая в том числе топонимически).»
          </h2>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest opacity-60">
            Вывод аналитической работы
          </p>
        </div>
      </AnimatedSection>
    </div>
  );
}
