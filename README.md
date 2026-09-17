# 4else

The public website of 4else — Swiss event pages, registration and payment in one flow.

Next.js 14 (App Router) · TypeScript · next-intl · CSS Modules · Vercel

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

The dev server runs on [http://localhost:3007](http://localhost:3007).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server (port 3007) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run check:i18n` | Check the message files |

## Project layout

```
app/[locale]/     pages (the start page is page.tsx)
components/       header, footer, brand, ui, home
lib/              i18n, routing, navigation, site constants
messages/         copy — de.json is the source
styles/tokens.css design tokens
public/images/    images
```

See [CLAUDE.md](CLAUDE.md) for the decisions behind the setup.
