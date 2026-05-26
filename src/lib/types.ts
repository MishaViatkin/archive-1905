export type EventType =
  | "strike"
  | "demonstration"
  | "meeting"
  | "violence"
  | "institution"
  | "manifesto"
  | "repression"
  | "other";

export interface HistoryEvent {
  id: string;
  date: string;
  dateEnd?: string;
  title: string;
  location: string;
  placeId: string;
  type: EventType;
  summary: string;
  quote?: string;
  source: string;
  sourceId?: string;
  verified: boolean;
  year: number;
}

export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  role: string;
  summary: string;
  source?: string;
}

export type SourceType = "archive" | "collection" | "periodical" | "research";

export interface Source {
  id: string;
  type: SourceType;
  citation: string;
  author?: string;
  title?: string;
  year?: number;
  pages?: string;
  fund?: string;
}

export interface TableColumn {
  key: string;
  label: string;
}

export type TableCellValue = string | number | boolean | undefined;

export interface TableRow {
  [key: string]: TableCellValue;
}

export interface DataTableConfig {
  id: string;
  title: string;
  section: string;
  columns: TableColumn[];
  rows: TableRow[];
  source?: string;
}

export type PersonSide = "revolutionary" | "authority" | "victim" | "observer";

export interface Person {
  id: string;
  name: string;
  alias?: string;
  role: string;
  side: PersonSide;
  years?: string;
  bio: string;
  fate?: string;
  source?: string;
}

export type ConnectionType =
  | "allied"
  | "led"
  | "documented"
  | "opposed"
  | "killed";

export interface Connection {
  from: string;
  to: string;
  type: ConnectionType;
  label?: string;
}

export interface ChronicleChapter {
  id: string;
  date: string;
  dateLabel: string;
  title: string;
  lede: string;
  body: string;
  quote?: { text: string; source: string; sourceId?: string };
  marginNote?: string;
  placeId?: string;
  /** Главное лицо сцены — id из people.json. Ведёт на /network?focus=… */
  featurePersonId?: string;
  /** Главный термин сцены — id из glossary.json. Ведёт на /glossary#… */
  featureTermId?: string;
}

export interface Enterprise {
  id: string;
  name: string;
  shortName: string;
  workers: string;
  output: string;
  wage: string;
  owner: string;
  role: string;
  notes: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  source?: string;
}

export interface StatItem {
  value: number;
  label: string;
  context: string;
  source: string;
}

export type LegacyType =
  | "political"
  | "economic"
  | "symbolic"
  | "violent"
  | "religious"
  | "demographic";

export interface LegacyEvent {
  id: string;
  year: string;
  title: string;
  type: LegacyType;
  summary: string;
  source: string;
}

export interface ImpactDimension {
  id: string;
  title: string;
  section: string;
  leadFact: string;
  summary: string;
  keyPoint: string;
}

export type SearchItemKind =
  | "event"
  | "person"
  | "source"
  | "term"
  | "place"
  | "enterprise"
  | "legacy";

export interface SearchItem {
  id: string;
  kind: SearchItemKind;
  title: string;
  subtitle?: string;
  body?: string;
  href: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  /** zero-based index of the correct option */
  correct: number;
  fact: string;
  source: string;
}
