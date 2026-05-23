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
          Атлас очагов
        </h1>
        <p className="mt-3 max-w-2xl text-ink-faded">
          Схематическая карта горнозаводских очагов на территории современной
          Свердловской области. Двигайте временной диск — очаги загораются,
          когда есть документированная активность.
        </p>
      </header>

      <TimeAtlas places={places} events={events} />
    </div>
  );
}
