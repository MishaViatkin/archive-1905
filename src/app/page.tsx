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
  const tGuberniya = getTermById("permskaya-guberniya")!;
  const tCouncil = getTermById("sovet-rabochih")!;
  const tBloody = getTermById("krovavoe-voskresenye")!;
  const tWindow = getTermById("okno-legalnosti")!;
  const tManifest = getTermById("manifest-17-oktyabrya")!;
  const tVis = getTermById("vis")!;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <HomeMasthead />

      <AnimatedSection delay={0.1}>
        <article className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
          <div>
            <p className="font-display text-3xl leading-tight text-ink md:text-4xl">
              Революция 1905 на Урале — самостоятельный процесс, а не отражение
              столичных событий
            </p>
            <p className="mt-3 text-sm uppercase tracking-[0.25em] text-ink-faded">
              Передовица номера · Аналитическая работа УрФУ, 2025
            </p>

            <div className="newspaper-cols mt-6 text-[0.95rem] leading-relaxed text-ink/90">
              <p className="drop-cap">
                Екатеринбург — ведущий торговый и горнозаводской центр{" "}
                <Term term={tGuberniya} /> — прошёл через все стадии
                революционных потрясений: от подпольных листовок до первого в
                регионе <Term term={tCouncil} />. К декабрю 1904 года жандармский
                ротмистр Гуляев фиксирует структуру, охватившую Нижний Тагил,
                Алапаевск и Сысерть. К ноябрю 1905-го — 32 депутата от шести
                предприятий избирают Совет.
              </p>
              <p>
                <Term term={tBloody} /> 9 января служит точкой перехода
                уральского подполья от латентной к открытой фазе. 1 мая —
                первая открытая демонстрация днём, с красным флагом. 7–14 мая —
                стачка <Term term={tVis} />: требование «вежливого обращения»
                рядом с экономическими — это и достоинственное измерение
                протеста. Полицмейстер не справляется сам: 8–10 мая в город
                вводят два батальона пехоты и сотню казаков.
              </p>
              <p>
                <Term term={tManifest} /> открывает <Term term={tWindow} /> — 72
                дня, не менее 28 открытых митингов. 19 октября — погром на
                Кафедральной площади: убиты подросток Иванов и репортёр
                Соловьёв. 16 ноября — в Верх-Исетском народном доме избран
                Совет. 28 декабря — чрезвычайное положение, 47 арестованных.
                Свердлов уходит в ссылку — но через двенадцать лет институт
                Совета вернётся уже как полноценный орган власти.
              </p>
              <p>
                Эта работа фиксирует <strong>7 информационных лакун</strong> —
                мест, где советская историография не довела цифры до
                верификации. Каждая лакуна сопровождается архивным адресом —
                фондом, сохранившим первичные материалы.
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
                  СЕКРЕТНО
                </Stamp>
                <p className="font-display text-xs uppercase tracking-widest text-ink-faded">
                  Из жандармского рапорта
                </p>
                <p className="mt-2 font-serif text-sm italic leading-relaxed text-ink">
                  «Распространение нелегальных изданий ведётся систематически —
                  экземпляры обнаруживаются ежемесячно в количестве от 30 до
                  150 штук за одну ночь.»
                </p>
                <p className="mt-3 text-xs text-ink-faded">
                  Ротмистр Гуляев · декабрь 1904
                  <br />
                  ГАПК. Ф. 65. Оп. 3. Д. 812
                </p>
              </div>
            </StampReveal>

            <AnimatedSection delay={0.15}>
              <div className="doc-card relative rounded-sm p-5">
                <StampCircle
                  topText="ВЫЯСНИТЬ"
                  centerText="7"
                  bottomText="ЛАКУН"
                  className="absolute -top-3 -right-3"
                />
                <p className="font-display text-xs uppercase tracking-widest text-ink-faded">
                  Архивные адреса
                </p>
                <ul className="mt-2 space-y-1 font-mono text-xs text-ink/80">
                  <li>ГАСО · ф. 11, ф. 185</li>
                  <li>ГАПК · ф. 65</li>
                  <li>ЦДООСО · ф. 41</li>
                </ul>
                <Link
                  href="/lacunae"
                  className="mt-3 inline-block text-xs uppercase tracking-widest text-accent hover:underline"
                >
                  Открыть формуляры →
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
                      → Хроника (13 сцен)
                    </Link>
                  </li>
                  <li>
                    <Link href="/atlas" className="hover:text-accent">
                      → Атлас и временной диск
                    </Link>
                  </li>
                  <li>
                    <Link href="/network" className="hover:text-accent">
                      → Сеть 15 фигурантов
                    </Link>
                  </li>
                  <li>
                    <Link href="/legacy" className="hover:text-accent">
                      → Наследие 1906→1991
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
            Цифры, верифицированные по фондам
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
            Ключевой тезис
          </p>
          <h2 className="mt-2 max-w-3xl font-display text-2xl leading-snug md:text-3xl">
            «Революция 1905–1907 годов на Урале не была периферийным отражением
            столичных событий — она стала самостоятельным общественным
            процессом, породившим организационные структуры, политических
            лидеров и символический капитал, определявшие жизнь региона на
            протяжении следующего столетия.»
          </h2>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest opacity-60">
            Аннотация работы · УрФУ, 2025
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="mt-16">
        <div className="rule-thick-thin pt-3">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-faded">
            Что нового в этом издании
          </p>
          <h2 className="mt-1 font-display text-3xl text-ink">
            Не учебник, а исследовательский инструмент
          </h2>
        </div>
        <StaggerContainer className="mt-6 grid gap-4 md:grid-cols-3">
          <StaggerItem className="doc-card rounded-sm p-5">
            <p className="font-display text-2xl text-accent">⌘ K</p>
            <p className="mt-2 font-display text-lg text-ink">
              Поиск по всему архиву
            </p>
            <p className="mt-1 text-sm text-ink-faded">
              События, фигуранты, лакуны, термины, источники — всё в одной
              палитре.
            </p>
          </StaggerItem>
          <StaggerItem className="doc-card rounded-sm p-5">
            <p className="font-display text-2xl text-accent">⊙</p>
            <p className="mt-2 font-display text-lg text-ink">
              Временной диск атласа
            </p>
            <p className="mt-1 text-sm text-ink-faded">
              Перематывайте от декабря 1904 до декабря 1907 — очаги загораются и
              гаснут.
            </p>
          </StaggerItem>
          <StaggerItem className="doc-card rounded-sm p-5">
            <p className="font-display text-2xl text-accent">⇌</p>
            <p className="mt-2 font-display text-lg text-ink">
              Граф связей подполья
            </p>
            <p className="mt-1 text-sm text-ink-faded">
              15 фигурантов, союзы, противодействие, документирование, жертвы —
              всё интерактивно.
            </p>
          </StaggerItem>
        </StaggerContainer>
      </AnimatedSection>
    </div>
  );
}
