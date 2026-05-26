export interface NavSection {
  href: string;
  label: string;
  number: string;
  description: string;
}

export const mainNav: NavSection[] = [
  {
    href: "/chronicle",
    label: "Хроника",
    number: "I",
    description: "11 сцен: от условий труда 1900-х до Совета 1917-го",
  },
  {
    href: "/atlas",
    label: "Атлас",
    number: "II",
    description: "Городская схема Екатеринбурга 1905 с временным диском",
  },
  {
    href: "/network",
    label: "Сеть",
    number: "III",
    description: "Картотека 14 фигурантов + 4 историка-источника",
  },
  {
    href: "/dossier",
    label: "Досье",
    number: "IV",
    description: "Картотечные карточки 4 предприятий Екатеринбурга",
  },
  {
    href: "/source-base",
    label: "Источники",
    number: "V",
    description: "Декларация: только опубликованные источники",
  },
  {
    href: "/legacy",
    label: "Наследие",
    number: "VI",
    description: "1905 → 1917 → 1991: три ресурса и топонимика",
  },
  {
    href: "/glossary",
    label: "Словарь",
    number: "VII",
    description: "18 терминов: РСДРП, Манифест, Совет, ВЦИК и др.",
  },
  {
    href: "/sources",
    label: "Картотека",
    number: "VIII",
    description: "9 источников: сборники, монографии, статьи",
  },
  {
    href: "/quiz",
    label: "Квиз",
    number: "IX",
    description: "10 вопросов по работе со справками к ответам",
  },
];
