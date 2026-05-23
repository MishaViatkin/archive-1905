# Деплой «АРХИВ 1905»

Сайт собран на **Next.js 16 / App Router** + **Tailwind CSS 4** и работает как полностью статический предрендер (10 маршрутов). Подходит для любой платформы, поддерживающей Next.js. Ниже — две готовые опции.

> Требуется **Node.js 20** (зафиксировано в `.nvmrc` и `netlify.toml`).

## Опция 1 · Netlify (рекомендуется для MVP)

В корне репозитория уже есть:

- [`netlify.toml`](netlify.toml) — команда сборки, плагин Next.js, заголовки кеша и безопасности.
- [`.nvmrc`](.nvmrc) — версия Node.
- `@netlify/plugin-nextjs` в `devDependencies` — официальный runtime от Netlify.

### Шаги

1. Запушьте репозиторий на **GitHub / GitLab / Bitbucket**.
2. Откройте [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Выберите репозиторий. Параметры сборки Netlify подхватит сам из `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions: автоматически через `@netlify/plugin-nextjs`
4. **Environment variables** → добавьте:
   - `NEXT_PUBLIC_SITE_URL` = `https://your-site.netlify.app` (или ваш домен) — используется в `sitemap.xml`, `robots.txt` и OpenGraph.
5. Нажмите **Deploy**. Первая сборка ~1–2 минуты.
6. (Опционально) **Domain management** → подключите свой домен и включите HTTPS (Let's Encrypt — бесплатно, автоматически).

### CLI-вариант (быстрее всего)

```bash
npm i -g netlify-cli
netlify login
netlify init      # создаст связь с проектом
netlify deploy    # preview-деплой
netlify deploy --prod   # боевой
```

## Опция 2 · Vercel (нативная платформа Next.js)

В корне уже есть [`vercel.json`](vercel.json). Vercel автоматически распознаёт Next.js — конфиг минимальный.

### Шаги

1. Откройте [vercel.com/new](https://vercel.com/new) → Import Git Repository.
2. Framework Preset: **Next.js** (определится автоматически).
3. **Environment Variables** → `NEXT_PUBLIC_SITE_URL` = ваш домен.
4. Deploy. Каждый push в `main` будет создавать production-сборку, остальные ветки — preview.

### CLI

```bash
npm i -g vercel
vercel login
vercel              # preview
vercel --prod       # боевой
```

## Что проверяет сайт на production

- ✅ **SEO-готовность**: `/sitemap.xml`, `/robots.txt`, OpenGraph, Twitter Card, корректный `metadataBase`.
- ✅ **Security headers** (Netlify): `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- ✅ **Long-term cache** для `_next/static/*` (1 год, immutable).
- ✅ **Статическая генерация** 10 маршрутов (`○ (Static)`) — без серверного рендеринга в рантайме.
- ✅ **`prefers-color-scheme`** и `print` стили.

## Локальная проверка перед деплоем

```bash
npm ci                # чистая установка
npm run lint          # ESLint
npm run build         # production build
npm start             # запустить production-сервер на localhost:3000
```

Если `npm run build` падает или показывает ошибки — деплой тоже упадёт. Проверьте, нет ли:

- TypeScript-ошибок,
- лишних импортов,
- использования `localStorage` / `window` без проверки `typeof window`.

## Переменные окружения

| Переменная | Описание | Пример |
|-----------|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | Полный URL сайта без слэша в конце. Подставляется в sitemap, robots и OpenGraph. | `https://archive-1905.netlify.app` |

Файл-образец: [`.env.example`](.env.example).

## Структура сборки

```
.next/                 # production output (gitignored)
├─ static/             # immutable assets с хешами
├─ server/             # серверные модули (для SSR/Route Handlers)
└─ standalone/         # автономный сервер (если потребуется Docker)
```

Для **самостоятельного хостинга** (VPS, Docker) используйте `npm start` после `npm run build`. Все маршруты статические, поэтому достаточно даже простого HTTP-сервера, обслуживающего `.next/static/` и сгенерированные HTML — но проще пустить полноценный `next start`.
