import { getConnections, getPeople } from "@/lib/content";
import { NetworkGraph } from "@/components/network/NetworkGraph";

export default function NetworkPage() {
  const people = getPeople();
  const connections = getConnections();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="rule-thick-thin pt-3">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-faded">
          Раздел III
        </p>
        <h1 className="mt-1 font-display text-5xl text-ink md:text-6xl">
          Картотека фигурантов
        </h1>
        <p className="mt-3 max-w-2xl text-ink-faded">
          14 фигурантов революции 1905 года в Екатеринбурге: подпольщики,
          власть, наблюдатели, жертвы — плюс четыре историка, чьи труды легли
          в основу работы. Кликните по карточке — откроется биография и связи.
        </p>
      </header>

      <NetworkGraph people={people} connections={connections} />
    </div>
  );
}
