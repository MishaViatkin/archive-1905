import { Suspense } from "react";
import { getEvents, getPlaces } from "@/lib/content";
import { TimeAtlas } from "@/components/atlas/TimeAtlas";

export default function AtlasPage() {
  const places = getPlaces();
  const events = getEvents();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="rule-thick-thin pt-3">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-faded">
          Раздел II
        </p>
        <h1 className="mt-1 font-display text-5xl text-ink md:text-6xl">
          Атлас Екатеринбурга 1905
        </h1>
        <p className="mt-3 max-w-2xl text-ink-faded">
          Городская схема: ВИЗ, Кафедральная площадь, Городской театр, народный
          дом, четыре главных предприятия. Двигайте временной диск — точки
          загораются, когда есть документированное событие. Переход по ссылке
          «📍 на карте» из любого раздела подсвечивает нужную точку и
          перематывает время.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="mt-10 doc-card rounded-sm p-12 text-center text-sm text-ink-faded">
            Загрузка карты…
          </div>
        }
      >
        <TimeAtlas places={places} events={events} />
      </Suspense>
    </div>
  );
}
