# АРХИВ 1905 · Екатеринбург

Цифровое историческое расследование о революции 1905–1907 годов в Екатеринбурге и на территории современной Свердловской области. По аналитической работе УрФУ, кафедра отечественной истории.

## Стек

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS 4** + кастомная архивно-газетная тема
- **Framer Motion** + d3 (для атласа)
- Полностью статический предрендер (10 маршрутов)

## Запуск локально

```bash
npm install
npm run dev
# http://localhost:3000
```

## Production

```bash
npm run build
npm start
```

## Деплой

См. [DEPLOY.md](DEPLOY.md) — готовые инструкции для **Netlify** и **Vercel**.

## Структура

```
src/
├─ app/                 # 10 маршрутов
│  ├─ page.tsx          # главная (передовица + Документ дня)
│  ├─ chronicle/        # хроника событий
│  ├─ atlas/            # карта + временной диск
│  ├─ network/          # картотека фигурантов
│  ├─ dossier/          # досье предприятий
│  ├─ lacunae/          # 7 информационных лакун
│  ├─ legacy/           # наследие 1906–1991
│  ├─ glossary/         # словарь терминов
│  ├─ sources/          # картотека источников
│  ├─ sitemap.ts        # /sitemap.xml
│  ├─ robots.ts         # /robots.txt
│  └─ not-found.tsx     # 404
├─ components/
│  ├─ atlas/            # карта Пермской губернии
│  ├─ chronicle/        # sticky-сторителлинг
│  ├─ network/          # сеть-картотека
│  ├─ effects/          # CountUp, ScrollProgress, Term, ShareLink, ReadProgress
│  ├─ home/             # компоненты главной
│  ├─ layout/           # Header, Footer, MobileNav, Providers
│  ├─ search/           # ⌘K поиск
│  └─ ui/               # Stamp
├─ content/data/        # JSON-источники: события, люди, источники, лакуны и т.д.
└─ lib/                 # types, navigation, content
```

## Контент

Все цифры и цитаты — с архивными ссылками (ГАСО, ГАПК, ЦДООСО). 7 информационных лакун помечены отдельно (`/lacunae`). Косвенные сведения не цитируются как установленные факты.

## Лицензия

Образовательный проект — без публичной лицензии. Уточняйте у автора.
