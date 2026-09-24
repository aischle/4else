# CLAUDE.md — 4else
## Persistent project instructions for Claude Code

Read this before changing code. It records what has already been decided.
If something is not covered here, ask before inventing.

**Before you touch git, read §8.** Commits to `main` are pre-authorised;
pushing and branching are not.

---

## 1. What this project is

**4else** (fourelse ag, Hüntwangen) is a Swiss event platform: organisers
design an event page, take registrations and collect payment in one flow.
**4else.com** organises (event pages, registration, participants);
**4else.one** takes the money (TWINT, card, invoice, PayPal, via Payrexx).

This repository is the public website. It starts with the start page, built
from the design `4else Startseite 02 - (standalone).html`
(`Z:\GoogleDrive\projects\4else\`). The design system sheet lives in the same
folder (`4else Design System Sheet.dc.html`).

---

## 2. Stack (mirrors temu.swiss)

The tech stack deliberately matches temu.swiss
(`D:\CloudStation\www\www-local\temu_SWISS`). When in doubt about a pattern,
look at how temu.swiss does it.

- **Framework:** Next.js 14 (App Router), React 18.3, TypeScript 5.5 (strict)
- **i18n:** next-intl v4, all routes under `app/[locale]/`
- **Styling:** CSS Modules on a token layer (`styles/tokens.css`); no CSS framework
- **Hosting:** Vercel, with `@vercel/analytics` and `@vercel/speed-insights`
- **Lint:** `next/core-web-vitals`
- **Installed but not wired yet** (same as temu.swiss, ready when needed):
  `@sanity/client`, `@sanity/image-url`, `@portabletext/react`,
  `@supabase/supabase-js`, `next-themes`, `lucide-react`

Scripts:

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on **port 3007** |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run check:i18n` | Message-file integrity (§4) |
| `npm run build` | Production build |

**Build safety:** never run `npm run build` while `npm run dev` is running —
both write to `.next/` and corrupt it. Use `npm run typecheck` to verify
instead, or stop the dev server first and restart it afterwards.

---

## 3. Design system

- **Typeface: Instrument Sans**, weights 400/500/600/700, loaded with
  `next/font/google` in `app/[locale]/layout.tsx` (self-hosted at build time,
  no runtime request to Google). Exposed as `--font`.
- **Tokens:** every colour, radius, shadow and layout width is a custom
  property in `styles/tokens.css`. Do not hardcode hex values in component CSS.

### Colour: the client's palette (September 2026)

The first block of `styles/tokens.css` holds her values under her own names
(`--brand-*`); the semantic tokens point at them. Her brief: keep the existing
colour world, sharpen and extend it.

| Her name | Value | Token | Used for |
|---|---|---|---|
| Primär | `#41425E` | `--brand` | the dark brand base: solid pills, CTA blocks, active chip |
| Sekundär | `#55556F` | `--brand-hover`, `--text-muted` | hover of the navy, eyebrows, numbers |
| Überschriften | `#393951` | `--ink` | headings, ink text, ink borders |
| Fliesstext | `#374151` | `--text-body` | running text |
| digital accent | `#5B5BD6` | `--accent` | large headlines, links, interactions |
| Akzent Lemon | `#B7C733` | `--lemon` | the paid state, status dots |
| Akzent Orange | `#C04E18` | `--orange` | **defined, not yet placed** |
| Eisviolett / Eis-Lemon / Eis-Orange | `#F0EEFF` `#F5F8DC` `#FBE9E1` | `--ice-violet` / `--ice-lemon` / `--ice-orange` | card grounds (the three contact boxes, the three service cards) |
| Eisblau | `#E9F3F7` | `--ice-blue` | **defined, not yet placed** |

- **`#41425E` and `#5B5BD6` never stand in for each other.** The navy is the
  base; the violet is the brighter digital accent on top of it.
- **Page ground:** `--page` `#F7F7FA`, a near-white with a trace of her violet,
  and cooled greys for lines and soft fills, so the ground sits with her cool
  ice colours and blue-grey text.
- **The hero is the exception.** Its violet-black ground has to match the
  background baked into Else's video, or the feathered edges show a box; its
  two violets (`--accent-violet` `#7C5CF0`, `--accent-bright` `#A78BFA`) are
  `#5B5BD6` lifted for legibility on near-black. Changing the ground means
  re-rendering the video.
- Every text/ground pairing was checked against WCAG AA; the tightest is the
  accent on Eisviolett at 4.7:1.
- **Buttons:** pills from `components/ui/Button.module.css` — `solid` (navy),
  `outline`, `violet` (hero), and `inverse` / `ghostOnInk` for the navy CTA
  band.
- **Light only.** The design has no dark mode; `next-themes` is installed but
  not used.

---

## 4. Language and copy

- **All visible copy lives in `messages/*.json`** and is read with next-intl
  (`useTranslations` / `t.rich`). No UI string is hardcoded in JSX — that
  includes `alt`, `aria-label` and `placeholder`.
- **German is the default and the only authored language.** `lib/i18n.ts`
  declares `de`, `en`, `fr`, `it`; routes for the last three resolve but fall
  back to German until their message files exist. Add a language by creating
  its message file and adding it to `enabledLocales`.
- **URLs:** `localePrefix: 'as-needed'` — German is served bare (`/`), other
  locales get a prefix (`/en`). `localeDetection` is **off**, so an English
  browser is not redirected to an untranslated `/en`.
- **Register: `du`.** The design addresses organisers informally
  ("Dein Event", "du brauchst"). Keep it consistent.
- **Swiss orthography:** `ss`, never `ß` (enforced by `npm run check:i18n`).
- **Emphasis lives in the messages:** `<accent>` (violet) and `<b>` tags,
  rendered by `t.rich()` in the page, so a translation can place emphasis
  differently.
- **Internal links** use the typed `Link` from `lib/navigation.ts`, never
  `next/link`. Same-page anchors (`#tun`, `#warum`, `#ablauf`) are plain `<a>`.

`npm run check:i18n` treats `de.json` as the source: every other message file
must have the same keys, rich-text tags and ICU placeholders.

---

## 5. Start page

**Route structure.** `app/[locale]/layout.tsx` holds the html, the fonts and
the messages for everything. The nav and footer live one level down in the
**`(site)` route group** (`app/[locale]/(site)/layout.tsx`), which the real
pages sit inside — a route group adds nothing to the URL, so `/kontakt` is
still `/kontakt`. The 404 sits *outside* that group, which is how it renders
with the html, fonts and German but without nav or footer (§5c). Unknown URLs
reach it through the catch-all in `app/[locale]/[...rest]/page.tsx`; without
that they fall through to Next's own global 404, which renders outside the
locale layout entirely.

`app/[locale]/page.tsx`, sections in order: hero → statement → what we do
(three cards) → payment banner → why 4else → how it works → testimonials →
FAQ → dark CTA band → newsletter. Nav (`components/header`) and footer
(`components/footer`) come from the locale layout.

Things to know:

- **The figure is called Else** — not "das Maskottchen". Use the name in copy
  and alt text (`hero.mascotAlt`, `notFound.imageAlt`).
- **The hero is the mascot redesign** (handoff:
  `Z:\GoogleDrive\projects\4else\design_handoff_4else_homepage\`). A dark
  ground (`--hero-ground`) with two radial glows, the living mascot left, and
  right the badge, headline, lead, two buttons and a glass sample ticket
  (`components/home/TicketCard.tsx`). The ticket shows the design's fictional
  event (Reitkurs, Anna Müller, CHF 45.–) — sample data, like the
  testimonials.
- **Else is a silent video loop** (`components/home/MascotVideo.tsx`),
  generated in Adobe Firefly (16:9) with
  `Z:\GoogleDrive\projects\4else\video-keyframe\mascot-keyframe-16x9.png`
  as both first and last frame. Files: `public/videos/home/mascot-loop.webm`
  + `.mp4` (square, 1080px), poster `public/images/home/mascot-poster.webp`
  (the loop's first frame, so the page looks the same before the video
  loads). The component starts playback itself: not for reduced motion
  (poster only, no download), paused while off-screen or in a hidden tab.
  Its edges are feathered by a CSS mask so no square shows against the hero
  ground; from 1000px it reaches into the hero's left margin to keep her at
  design size.
  **To replace the clip**, run the new Firefly export through the same
  pipeline (ffmpeg): smooth the loop point by crossfading its last half
  second into its first (`trim` 0.5s→end, `xfade` fade 0.5s against
  0→0.5s), crop a square around the creature and its icon orbits (for a
  1920×1080 export: `crop=1080:1080:440:0`), encode without audio — H.264
  `-crf 26 -movflags +faststart` and VP9 `-crf 36 -b:v 0` — and take the
  poster from frame 0 of the result.
- **The dark ground fades back to the page ground across the statement
  section** — one CSS gradient, no scroll JS. The hero is pulled up under the
  sticky nav (`margin-top: calc(var(--nav-h) * -1)`) so the dark ground runs
  behind the bar.
- **The nav mirrors the ground it is over.** `components/header/Header.tsx` is
  a client component. It watches three marks the statement section places down
  the fade (`components/header/navTheme.ts`, `.fadeStart/.fadeText/.fadeEnd` in
  `page.module.css`) and has three looks: dark glass over the hero, **no tint
  at all through the fade** — the blur alone reproduces the gradient, so there
  is nothing to mismatch — and the site's light glass once the fade is done.
  Its text switches from light to ink at the middle mark (31%), the only swap
  that shows; move that percentage if it reads early or late. A page without
  the marks, like the 404, keeps the light bar.
- **Placeholder destinations** point at `#` and open the dialog described in
  §5d instead of navigating. The footer e-mail and phone are real
  `mailto:`/`tel:` links.
- **Newsletter form is UI only** (`components/home/NewsletterForm.tsx`):
  submitting does nothing. Connect it to a list provider before launch.
- **Testimonials are the design's sample quotes.** Replace them with real,
  approved customer statements before going live.
- **FAQ** (`faq` namespace, `f1`–`f11`). Eleven pairs taken from the live site
  4else.events, verbatim apart from the `du` casing (§4) and one title
  rephrased as a question. The section follows temu.swiss: native
  `<details>`/`<summary>`, never a client-side accordion, so every answer sits
  in the server-rendered HTML whether the item is open or closed. The items
  share `name="faq"`, which makes them an exclusive group in the browser
  itself: the first opens with the page, and opening another closes it. No
  script involved; a browser without `name` support (pre-2024) simply lets
  several stay open.
  Each question carries its number, `(01)`…, derived from its position by
  `lib/faq.ts` — not stored in the messages, so removing a pair renumbers the
  rest by itself. The contact page's FAQ uses the same helper.
  `components/seo/FaqJsonLd.tsx` emits the `FAQPage` schema from the same
  message keys, so copy and structured data cannot drift. **To add or remove a
  pair, edit `FAQ_IDS` there and the `fNQuestion`/`fNAnswer` keys** — never
  hand-write the schema text. Note the transaction fee (4,8 % + CHF 0.20) and
  the payment methods are now stated both here and on 4else.events; keep them
  in step.
- **No mobile menu.** Like the design, the nav's section links hide below
  1000px; only the wordmark, Login and Demo remain.
- **Images** live in `public/images/home/` and render through `next/image`
  (the mascot poster excepted — a `<video poster>` cannot use it).
  `participant.png` is 1.4 MB at source; `next/image` serves it resized.

---

## 5b. Contact page

`app/[locale]/kontakt/page.tsx` (+ `page.module.css`), route registered in
`lib/routing.ts` — `app/sitemap.ts` reads `routing.pathnames`, so the page
lists itself. Design handoff:
`Z:\GoogleDrive\projects\4else\design_handoff_4else_kontakt\` (its
`reference/index.html` is a self-unpacking bundle; the markup sits in the
JSON-escaped string near the end of the file).

Sections: hero → form + three pastel cards → FAQ → dark CTA band. Copy in the
`kontakt` namespace, page title/description in `meta.kontakt*`.

- **No dark hero, no mascot** — those stay exclusive to the start page. Hero
  and form share one white block that is pulled up under the sticky nav
  (`.white`, the same `margin-top: calc(var(--nav-h) * -1)` trick the start
  page's hero uses), so the glass bar reads as white here.
- **The form has no backend** (`components/contact/ContactForm.tsx`). Submitting
  shows a notice saying so — deliberately *not* the design's success state,
  whose copy promises an answer within 24 hours and a copy in the sender's
  inbox. **When a handler exists**: POST the fields plus the chosen topic in
  `onSubmit` (Support → support@4else.com, everything else → info@4else.com),
  then swap the notice for the success state in the handoff's README §2.
- **FAQ**: four pairs (`k1`–`k4`), same native `<details name>` pattern as the
  start page. **No `FaqJsonLd` here on purpose** — all four are re-phrasings of
  start-page questions, and the same Q&A on two URLs competes with itself.
- **The nav** gained Kontakt, the one item with a real route; it marks itself
  with `aria-current="page"` and `.linkActive`. Away from the start page the
  section links carry the route in front of the hash (`/#tun`), so they lead
  home and scroll there.
- **The footer is the same everywhere.** `components/footer/Footer.tsx` is
  rendered once by the locale layout, so every route carries it in full,
  closing wordmark included. The contact handoff drops the wordmark away from
  the start page; Robin asked for one footer instead, so that variant is gone.
- **Still open:** "Antwort innert 24 h" is the handoff's assumption, not a
  confirmed promise. Datenschutz, Zum Login and both CTA buttons point at `#`.

---

## 5c. 404 page

`app/[locale]/not-found.tsx` (+ `not-found.module.css`), from the handoff
`Z:\GoogleDrive\projects\4else\design_handoff_4else_404\`. The **0 of "404" is a
porthole Else peeks through**, then the headline, one sentence and four ways
back. Copy in the `notFound` namespace.

- **It stands alone:** no nav and no footer, because it is outside the
  `(site)` group. White ground, `min-height: 100svh`, content centred both
  ways.
- **The porthole** is sized in `em` (`0.843em` of the numerals), so it stays a
  circle in the same proportion at every width. Its ring is three stacked
  box-shadows ending in `--shadow-porthole`.
- **The image** is `public/images/404/else-porthole.webp`, cut from
  `public/images/home/mascot-poster.webp` (the video's first frame, the
  sharpest source there is) with `crop=268:268:498:227`, scaled to 536px. The
  handoff ships an 800px PNG of the same framing, but it is an upscale of that
  same 268px region — the fresh cut is visibly sharper. **To re-cut it**, run
  that crop again; for anything bigger, Else's face has to be rendered anew in
  Firefly, not upscaled.
- **She drifts** ±4px over 6s, off under `prefers-reduced-motion`.
- **The numerals are a `<p>`**, not a heading — the page's heading is the
  sentence below. "Fehler 404" is announced by a visually hidden span (the
  global `srOnly` class); `aria-label` on a `<p>` has no role to hang on.
- **Title and noindex** come from `generateMetadata` in the catch-all, and
  Next keeps them even though that segment throws `notFound()` (verified:
  "Seite nicht gefunden — 4else", `noindex, follow`). The 404 status is what
  actually keeps it out of search indexes.

---

## 5d. Unfinished features — the "wip" dialog

The client bought the website design, not the application behind it. Every
control that would need something unbuilt keeps `href="#"` and opens
`components/ui/WipDialog.tsx`, which explains why nothing happens.

- **It is mounted once**, in `app/[locale]/layout.tsx`, so it also covers the
  404, which sits outside the `(site)` group.
- **It catches clicks centrally**: one document listener picks up every
  `a[href="#"]`. **A new placeholder needs no wiring** — give it `href="#"`
  and it is covered.
- **Two explanations**, chosen by a data attribute on the link:

  | Link | Says |
  |---|---|
  | `data-wip="backend"` | *Dafür fehlt noch das Backend.* — Login, Demo, Registrieren, Jetzt Event erstellen, Zum Login |
  | no attribute | *Diese Seite ist noch nicht gestaltet.* — Preise, Über uns, the card links, Impressum, AGB, Datenschutz |

- Copy lives in the `wip` namespace. Native `<dialog>`, so the backdrop,
  Escape, the focus trap and the focus return come from the browser; a click
  on the backdrop closes it too.
- **When a feature lands**, give the link its real destination and the dialog
  stops applying to it by itself.
- **Still unhandled on purpose:** the three social links (LinkedIn, Instagram,
  Telegram) also point at `#` and so claim to be "not designed yet". They need
  real profile URLs — ask Robin.

---

## 6. SEO

- Title and description come from `messages/*.json` (`meta` namespace) in the
  layout's `generateMetadata`.
- **Favicon:** `app/icon.png` (512px), `app/apple-icon.png` (180px) and
  `app/favicon.ico` (32px). Next.js picks these up by filename and emits the
  link tags itself — no `<head>` markup anywhere. The source is the mark from
  4else.events (`cropped-4e_violett.png`, white "4e" on violet). Its violet is
  `#60608B`, which is **not** the site's `--accent` (#5B5BD6); the apple icon
  is flattened onto that same violet because iOS renders transparency black.
- `app/robots.ts` and `app/sitemap.ts` build absolute URLs from
  `NEXT_PUBLIC_SITE_URL` (see `.env.example`), falling back to
  `http://localhost:3007`. **Set it in Vercel** once the production domain is
  chosen. The sitemap lists every route in `lib/routing.ts` automatically.

---

## 7. Environment

Copy `.env.example` to `.env.local`. Never commit `.env.local`.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, robots and sitemap |

---

## 8. Git — committing, pushing, branching

**Commit to `main` freely. Never push, and never branch, without Robin's
explicit order.**

- **Commit** — pre-authorised. Commit whenever the work warrants it.
- **Push** — gated. Stop after the commit and say what is waiting. Once
  Vercel is connected, a push to `main` deploys.
- **Branch** — gated. Work on `main` unless asked otherwise.

Remote: `https://github.com/aischle/4else.git`.
