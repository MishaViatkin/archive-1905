import events from "@/content/data/events.json";
import places from "@/content/data/places.json";
import lacunae from "@/content/data/lacunae.json";
import sources from "@/content/data/sources.json";
import enterprises1904 from "@/content/data/enterprises-1904.json";
import strikes1900 from "@/content/data/strikes-1900-1904.json";
import meetingsOct1905 from "@/content/data/meetings-oct-1905.json";
import impactToponymy from "@/content/data/impact-toponymy.json";
import people from "@/content/data/people.json";
import connections from "@/content/data/connections.json";
import chronicle from "@/content/data/chronicle.json";
import enterprisesFull from "@/content/data/enterprises-full.json";
import glossary from "@/content/data/glossary.json";
import stats from "@/content/data/stats.json";
import legacy from "@/content/data/legacy.json";
import impact from "@/content/data/impact.json";
import type {
  ChronicleChapter,
  Connection,
  DataTableConfig,
  Enterprise,
  GlossaryTerm,
  HistoryEvent,
  ImpactDimension,
  Lacuna,
  LegacyEvent,
  Person,
  Place,
  SearchItem,
  Source,
  StatItem,
} from "./types";

export function getEvents(): HistoryEvent[] {
  return events as HistoryEvent[];
}

export function getPlaces(): Place[] {
  return places as Place[];
}

export function getLacunae(): Lacuna[] {
  return lacunae as Lacuna[];
}

export function getSources(): Source[] {
  return sources as Source[];
}

export function getSourceById(id: string): Source | undefined {
  return getSources().find((s) => s.id === id);
}

export function getLacunaById(id: string): Lacuna | undefined {
  return getLacunae().find((l) => l.id === id);
}

export function getTables(): DataTableConfig[] {
  return [
    enterprises1904,
    strikes1900,
    meetingsOct1905,
    impactToponymy,
  ] as DataTableConfig[];
}

export function getTableById(id: string): DataTableConfig | undefined {
  return getTables().find((t) => t.id === id);
}

export function getPeople(): Person[] {
  return people as Person[];
}

export function getConnections(): Connection[] {
  return connections as Connection[];
}

export function getChronicle(): ChronicleChapter[] {
  return (chronicle as ChronicleChapter[]).slice().sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

export function getEnterprises(): Enterprise[] {
  return enterprisesFull as Enterprise[];
}

export function getGlossary(): GlossaryTerm[] {
  return (glossary as GlossaryTerm[])
    .slice()
    .sort((a, b) => a.term.localeCompare(b.term, "ru"));
}

export function getTermById(id: string): GlossaryTerm | undefined {
  return getGlossary().find((t) => t.id === id);
}

export function getStats(): StatItem[] {
  return stats as StatItem[];
}

export function getLegacy(): LegacyEvent[] {
  return legacy as LegacyEvent[];
}

export function getImpact(): ImpactDimension[] {
  return impact as ImpactDimension[];
}

export function getSearchIndex(): SearchItem[] {
  const out: SearchItem[] = [];
  for (const e of getEvents()) {
    out.push({
      id: `event-${e.id}`,
      kind: "event",
      title: e.title,
      subtitle: e.date,
      body: `${e.location} · ${e.summary}`,
      href: "/chronicle",
    });
  }
  for (const p of getPeople()) {
    out.push({
      id: `person-${p.id}`,
      kind: "person",
      title: p.name,
      subtitle: p.role,
      body: p.bio,
      href: "/network",
    });
  }
  for (const l of getLacunae()) {
    out.push({
      id: `lacuna-${l.id}`,
      kind: "lacuna",
      title: `Лакуна · ${l.section}`,
      subtitle: l.archiveHint,
      body: l.question,
      href: `/lacunae#${l.id}`,
    });
  }
  for (const s of getSources()) {
    out.push({
      id: `source-${s.id}`,
      kind: "source",
      title: s.title ?? s.citation.slice(0, 80),
      subtitle: s.fund,
      body: s.citation,
      href: `/sources#${s.id}`,
    });
  }
  for (const t of getGlossary()) {
    out.push({
      id: `term-${t.id}`,
      kind: "term",
      title: t.term,
      body: t.definition,
      href: `/glossary#${t.id}`,
    });
  }
  for (const pl of getPlaces()) {
    out.push({
      id: `place-${pl.id}`,
      kind: "place",
      title: pl.name,
      subtitle: pl.role,
      body: pl.summary,
      href: "/atlas",
    });
  }
  for (const ent of getEnterprises()) {
    out.push({
      id: `enterprise-${ent.id}`,
      kind: "enterprise",
      title: ent.shortName,
      subtitle: ent.name,
      body: ent.notes,
      href: "/dossier",
    });
  }
  for (const lg of getLegacy()) {
    out.push({
      id: `legacy-${lg.id}`,
      kind: "legacy",
      title: `${lg.year} · ${lg.title}`,
      body: lg.summary,
      href: "/legacy",
    });
  }
  return out;
}
