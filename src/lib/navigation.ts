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
    description: "Sticky-сторителлинг: январь 1905 → декабрь 1907",
  },
  {
    href: "/atlas",
    label: "Атлас",
    number: "II",
    description: "Карта очагов: Екатеринбург, Тагил, Сысерть, Алапаевск",
  },
  {
    href: "/network",
    label: "Сеть",
    number: "III",
    description: "Граф персоналий — кто, с кем, против кого",
  },
  {
    href: "/dossier",
    label: "Досье",
    number: "IV",
    description: "Жандармские карточки предприятий",
  },
  {
    href: "/lacunae",
    label: "Лакуны",
    number: "V",
    description: "Белые пятна — то, что ещё предстоит выяснить",
  },
  {
    href: "/legacy",
    label: "Наследие",
    number: "VI",
    description: "1906 → 1991: от уступок к топонимии и идентичности",
  },
  {
    href: "/glossary",
    label: "Словарь",
    number: "VII",
    description: "20 терминов: РСДРП, кадеты, окно легальности и др.",
  },
  {
    href: "/sources",
    label: "Картотека",
    number: "VIII",
    description: "Архивы, сборники, периодика, исследования",
  },
];
