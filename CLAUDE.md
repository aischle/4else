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

## 2. Stack

The project started on the temu.swiss stack
(`D:\CloudStation\www\www-local\temu_SWISS`), and many patterns still come
from there; when in doubt about a pattern, look at how temu.swiss does it.
**Versions are this project's own:** 4else does not follow temu.swiss's
Next or React versions (Robin, September 2026). Keep it on current releases.

- **Framework:** Next.js 16 (App Router, Turbopack), React 19.3, TypeScript 5.5 (strict).
  Upgraded from Next 14 / React 18 in September 2026 for Sanity's visual
  editing (`next-sanity` 12+ needs Next 16). What the upgrade changed:
  - `params` is a Promise. Async pages and layouts `await` it; the
    synchronous ones that call `useTranslations` unwrap it with React's
    `use()` instead, since hooks cannot run in an async component.
  - The next-intl middleware is `proxy.ts` (Next 16's name for it).
  - **Every layout and page calls `setRequestLocale`**, the `(site)` layout
    included. Next 16 renders layouts and pages in parallel; a layout
    without it lets its server components read the locale from the
    request headers, which silently turns every page dynamic. After
    changing a layout, check that `npm run build` still lists the routes
    as ● (prerendered), not ƒ.
  - `images.qualities` is `[75, 90]` in `next.config.mjs`; Next 16 coerces
    any other `quality` to 75. Add a value there before using it.
  - `<html data-scroll-behavior="smooth">`: Next 16 no longer turns off
    `globals.css`'s smooth scrolling on its own during route changes.
- **i18n:** next-intl v4, all routes under `app/[locale]/`
- **Styling:** CSS Modules on a token layer (`styles/tokens.css`); no CSS framework
- **Hosting:** Vercel, with `@vercel/analytics` and `@vercel/speed-insights`
- **Lint:** ESLint 9 with a flat config (`eslint.config.mjs`) on
  `eslint-config-next/core-web-vitals`; Next 16 removed `next lint`.
  ESLint 10 waits for the React, import and a11y plugins Next bundles,
  which do not support it yet. The two `react-hooks/set-state-in-effect`
  exceptions (header marks, mobile menu on route change) sync state with
  the DOM on purpose; each carries its reason.
- **Sanity** (`@sanity/client`, `@sanity/image-url`, `@portabletext/react`)
  feeds the blog Inspirationen, see §5f. The Studio is a separate package
  in `studio/`.
- **Installed but not wired yet** (ready when needed):
  `@supabase/supabase-js`, `next-themes`, `lucide-react`

Scripts:

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on **port 3007** |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run check:i18n` | Message-file integrity (§4) |
| `npm run build` | Production build |

**Build and dev can run together** since Next 16: the dev server writes to
`.next/dev`, the build to `.next/` (tested September 2026: a build with the
dev server up left it serving normally). The old rule against it was a
Next 14 limitation.

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
  hand-write the schema text.
  **Else sits under the heading** with pencil and notepad
  (`public/images/home/else-notizen.webp`, a transparent 600×661 cut-out,
  exported like the contact page's Else; alt `faq.elseImageAlt`),
  **centred under the heading's text**, not its column: the heading block
  shrinks to its widest word beside the list (`min-content`) or its one
  line above it (`fit-content`), and Else hangs from its middle without
  widening it (`.faqHead`, `.faqElseRow`). 170–225px wide beside the list
  (`15.6vw`), 112–165px above it (≤1000px); Robin had her 25% smaller
  than the first 300px. Note the transaction fee (4,8 % + CHF 0.20) and
  the payment methods are now stated both here and on 4else.events; keep them
  in step.
- **Mobile menu** (mockup option A, chosen by Robin, September 2026;
  `components/header/MobileMenu.tsx`). Below 1000px the section links,
  Login and Demo leave the bar, which keeps only the wordmark and a round
  menu button (44px); Demo sits in the menu (Robin's call: no duplicate).
  The button inverts its ground: on the light bar the menu's own
  violet-black (`--hero-ground`) with white bars, navy on hover; over the
  dark hero white with ink bars, Eisviolett on hover. It swaps with the
  bar's text at the fade's middle mark. The button opens a **full-screen menu** in the hero's
  violet-black with its two lights: the five links large and numbered
  (01)–(05) with the FAQ's helper, the current page in `--accent-bright`,
  Login (`ghostOnInk`) and Demo (`violet`), the e-mail and phone, and Else's
  face asking "Wohin soll's gehen?" (`nav.menu*` keys).
  - Desktop links and menu read **one list**, `components/header/navItems.ts`
    (built in `Header.tsx`), so they cannot drift apart.
  - Native `<dialog>` with `showModal()`, like the wip dialog: Escape, focus
    trap, inert page and focus return come from the browser. The page stops
    scrolling while it is open (`html:has(.menu[open])`), with
    `scrollbar-gutter: stable` so the vanished scrollbar doesn't shift the
    page sideways.
  - It closes on every link that leads somewhere, on a route change and when
    the window grows past 1000px. **"#" placeholders leave it open**: the wip
    dialog opens on top, and closing that returns to the menu.
  - `open` state is set in `close()` as well as in the dialog's close event,
    because browsers deliver that event with the next frame, which a hidden
    tab never gets.
  - With only two items, the bar fits any phone width; the narrow-phone
    rules for the Demo pill are gone.
- **Narrow phones (≤400px):** single long words set the page's minimum
  width, so type follows the screen there. Both hero headlines (start and
  contact) use `clamp(32px, 10.5vw, 42px)` below 400px, exactly 42px at
  400px, so there is no jump ("Massgeschneidert" and the nbsp-joined
  "Ganz persönlich." would otherwise be wider than the column). The
  footer's giant wordmark floor is 36px, not 56px, and the hero ticket
  gets a 72×96 thumbnail and 16px padding below 360px, so its nowrap date
  pill isn't clipped. `/` and `/kontakt` have no horizontal overflow from
  320px up. Keep it that way: no `overflow-x: hidden` on html or body.
- **Images** live in `public/images/home/` and render through `next/image`
  (the mascot poster excepted — a `<video poster>` cannot use it).
  `participant.png` is 1.4 MB at source; `next/image` serves it resized.
- **The payment banner's ticket** ("Keine offenen Rechnungen mehr.") is
  `public/images/home/ticket-passion.png`: a real 4else ticket with sample
  data (PASSION Pferdewelt 2026, "Max Muster"), from Robin (September 2026),
  cropped to the ticket and above its tear-off line (644×472). It is wider
  than the panel is tall, so it sits whole as a white card on Eisviolett
  (`.ticketImage`, `--shadow-card`), never cropped; `quality={90}` keeps
  its small print legible. It replaced the portrait `ticket.jpg`.

---

## 5b. Contact page

`app/[locale]/kontakt/page.tsx` (+ `page.module.css`), route registered in
`lib/routing.ts` — `app/sitemap.ts` reads `routing.pathnames`, so the page
lists itself. Design handoff:
`Z:\GoogleDrive\projects\4else\design_handoff_4else_kontakt\` (its
`reference/index.html` is a self-unpacking bundle; the markup sits in the
JSON-escaped string near the end of the file). The v4 update
(`design_handoff_4else_kontakt_v4\`) added the Beatrice band; v5
(`design_handoff_4else_kontakt_v5\`) put Else in the hero and swapped the
portrait. The v5 reference still shows older nav, badge and Beatrice copy —
only its hero and portrait were taken over.

Sections: hero → Beatrice band → form + two pastel cards → FAQ → dark CTA
band. Copy in the `kontakt` namespace, page title/description in
`meta.kontakt*`.

- **No dark hero, no video** — those stay exclusive to the start page. Hero,
  Beatrice band and form share one white block that is pulled up under the sticky nav
  (`.white`, the same `margin-top: calc(var(--nav-h) * -1)` trick the start
  page's hero uses), so the glass bar reads as white here.
- **Else in the hero** (v5, image swapped September 2026): Else as concierge,
  with bow tie and service bell, sits right of the lead on the Beatrice
  panel's top edge, under a navy speech bubble (`elseBubble`; alt
  `elseImageAlt`). The image is `public/images/kontakt/else-concierge.webp`, a
  **transparent** cut-out (600×619) that simply fills the 260×268 `.else`
  box: no crop, no blend mode. It is the client's third version (26
  September 2026): seated, one arm open, the bell held out, felt-textured;
  the box took the previous, slimmer figure's height. Export: zero the
  alpha ≤ 4 noise that otherwise reaches the canvas edges, trim to what
  remains plus 8px, scale to 600px wide. The 404 keeps its own
  `else-sucht.webp`. **On phones (≤560px)** she never wraps under the
  lead: she shrinks to `clamp(110px, 34vw, 190px)` wide (110px at 320,
  133px at 390, 190px at 560), the lead takes the rest of the row, and the
  bubble is capped at her width (13px type) so it cannot reach the lead,
  which there runs up beside her head. Her negative bottom margin is the
  hero's bottom padding + the band's top padding + 4px + 2px (the export's
  empty margin under her body, so the body itself meets the edge); change
  either padding and change it too. **From 1100px
  the lead and Else form one right-aligned group, 20px apart**, with the lead
  at 23ch (≈306px; Instrument Sans's `ch` is ~0.665em). The spare width
  opens between the headline and the lead, which Robin wants further from
  the headline than from Else. Below 1100px the lead keeps 36ch under the
  headline. `.else` is
  positioned, which paints her over the panel, whose background is not.
  Neither section may clip overflow.
- **The page speaks in the first person singular** ("Sprich mit mir", "Schreib
  mir"): the client's wording, September 2026. Keep new contact-page copy in
  the same voice; the FAQ and the start page keep "wir".
- **The Beatrice band** introduces the "mir": a photo of the founder beside a
  greeting and her direct contact (`beatrice*` keys; name, role, e-mail and
  phone reuse `c1Name`/`c1Role`/`c1Email`/`c1Phone`, which `ContactForm`
  also reads). It replaced the old "(01) Beratung & Demo" card, so the aside
  holds only (01) Support and (02) Besuch. Photo and text sit side by side
  from about 900px and stack below, photo first. The image is
  `public/images/kontakt/beatrice-hohl.webp` (1264×848, original size, WebP
  q85 from the v5 handoff's `assets/beatrice-kontakt-glamour.png`), cropped by
  `object-position: 47% 25%` to keep her face and hands in frame at every
  width. After replacing it, clear `.next/dev/cache/images` (the dev server's image cache since Next 16). **`beatriceBody` is design copy, since revised once on Beatrice's
  feedback (see below).**
- **The form has no backend** (`components/contact/ContactForm.tsx`). Six
  topic chips (`topic1`–`topic6`) share one message placeholder
  (`messagePlaceholder`). Submitting
  shows a notice saying so — deliberately *not* the design's success state,
  whose copy promises an answer within 24 hours and a copy in the sender's
  inbox. **When a handler exists**: POST the fields plus the chosen topic in
  `onSubmit` (Support, `topic3` → support@4else.com, everything else →
  info@4else.com), then swap the notice for the success state in the
  handoff's README §2.
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
- **No promises Beatrice cannot keep.** Her feedback, September 2026: the
  badge read "Antwort innert 24 h", a fixed deadline she cannot always meet,
  and `beatriceBody` ended "bis zum ersten ausverkauften Event", a result
  she cannot guarantee. They read "Persönliche Antwort" and "bis zum ersten
  Ticketverkauf" now. Keep new contact-page copy to what 4else controls: no
  response times, no sales outcomes.
- **Still open:** Datenschutz, Zum Login and both CTA buttons point at `#`.

---

## 5c. 404 page

`app/[locale]/not-found.tsx` (+ `not-found.module.css`), from the handoff
`Z:\GoogleDrive\projects\4else\design_handoff_4else_404_v2\` (variant 2b,
"Else rätselt über der 404"; it replaced the earlier porthole design).
**Else stands puzzled in front of a giant, very pale "404"**, then the eyebrow
"Fehler 404", the headline, one sentence and four ways back. Copy in the
`notFound` namespace.

- **It stands alone:** no nav and no footer, because it is outside the
  `(site)` group — deliberately, although the v2 handoff says to keep them.
  White ground, `min-height: 100svh`, content centred both ways.
- **The stage** is 760×380 at full size and scales at 2:1 below that. It is a
  size container, so the numerals are sized in `cqw` (`44.7cqw` = 340px) and
  always fill its width; Else is 100% of its height, feet on its bottom edge.
  The numerals' colour is `--ghost-numeral`, a step deeper than `--page`.
  **Not in the handoff:** the stage also shrinks with the viewport height
  (`(100svh - 420px) * 2`, floor 320px), so a 720px-high laptop screen shows
  the whole page centred instead of scrolling.
- **The image** is `public/images/404/else-sucht.webp`, 900px, exported from
  the handoff's 1254px `assets/else-sucht.png`. It is not transparent, so
  `mix-blend-mode: multiply` lets the numerals show through it. The
  handoff's own webp has an off-white ground (253/254), which still drew a
  faint square on white; **the export lifts the highlights** (240–251 →
  240–255, everything above to 255) so the ground is pure white. Repeat that
  on a re-export; with a transparent export, drop the blend mode instead.
  The image is centred with auto margins, not a transform. After replacing
  the file, clear `.next/dev/cache/images` (the dev server's image cache since Next 16), or the dev server keeps serving the
  old optimised copy.
- **The numerals are decoration** (`aria-hidden`); the visible eyebrow says
  "Fehler 404" in words, and the heading is the sentence below.
- **Title and noindex** come from `generateMetadata` in the catch-all. Since
  Next 16 they no longer sit in the server HTML, which carries the site's
  default title and Next's own `noindex`; the catch-all's values ("Seite
  nicht gefunden — 4else", `noindex, follow`) arrive with the page data and
  replace them once it loads (checked on the dev server, September 2026).
  The 404 status is what actually keeps it out of search indexes.

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
  | no attribute | *Diese Seite ist noch nicht gestaltet.* — Preise, Über uns, the card links, AGB, Datenschutz |

- Copy lives in the `wip` namespace. Native `<dialog>`, so the backdrop,
  Escape, the focus trap and the focus return come from the browser; a click
  on the backdrop closes it too.
- **When a feature lands**, give the link its real destination and the dialog
  stops applying to it by itself.
- **Still unhandled on purpose:** the three social links (LinkedIn, Instagram,
  Telegram) also point at `#` and so claim to be "not designed yet". They need
  real profile URLs — ask Robin.

---

## 5e. Scroll to top

`components/ui/ScrollToTop.tsx` (+ `.module.css`), mounted once by the
`(site)` layout, so every real page has it and the 404 does not. Robin chose
mockup option C (Else) with option B's progress ring, September 2026.

- **What it is:** Else's face in a white 52px disc inside a 3px violet ring
  that fills with the scroll (`--accent` on a `--hairline` track), a navy arrow
  badge at the top right, and on hover or focus the „Nach oben“ speech bubble
  (`--radius-bubble`, the contact hero's shape). 64px overall, 24px from the
  bottom-right corner, respecting safe-area insets. z-index 30, above the
  sticky nav (20); the wip dialog is in the top layer anyway.
- **Not on phones:** `display: none` below 640px, at Robin's request
  (September 2026). Tablets and desktops keep it.
- **When:** visible from 30% scroll depth, `scrollY ÷ (page height −
  viewport)`, hidden above it. `visibility: hidden` while hidden, which also
  keeps it out of the tab order and the accessibility tree.
- **Scroll handling:** measured directly in the scroll listener (browsers fire
  scroll at most once per frame). The ring's `stroke-dashoffset` is written to
  the DOM, the circle has `pathLength="100"`; React state changes only when
  the 30% line is crossed.
- **Click:** smooth scroll to the top, `'instant'` under reduced motion (not
  `'auto'`, which would inherit `html { scroll-behavior: smooth }`); focus
  moves to the wordmark so keyboard users continue from the top.
- **Image:** `public/images/ui/else-face.webp`, 192px, cut from the v5
  handoff's `else-sucht.png` (`crop 505,270,845,610`, highlights lifted to
  pure white like the 404 export). Label in `scrollTop.label`.
- **Testing note:** in a hidden or background tab browsers pause scroll events
  and smooth scrolling, so the button looks dead there. Test in a visible
  window, or jump with `scrollTo({ behavior: 'instant' })` and dispatch a
  `scroll` event yourself.

---

## 5f. Inspirationen (blog) and the Studio

The blog is **Inspirationen**, fed by Sanity project **`6e5n16nr`**,
dataset `production` (public). It is 4else's own project: **not** Mechane's
`lc29lnng`, which temu.swiss and Limen read. Beatrice writes and publishes
herself in a **dedicated Studio**.

**The Studio (`studio/`)** is its own npm package inside this repo: Sanity 6,
React 19, Node ≥ 22.12. It is kept out of the site's TypeScript and ESLint,
and git ignores its `node_modules`, `dist` and `.sanity`. Vercel never builds
it.
- **Hosted by Sanity** at `https://fourelse.sanity.studio` (`studioHost: 'fourelse'`
  in `sanity.cli.ts`, auto-updates on). The site's `/studio` and
  `/studio/*` redirect there (307, in `next.config.mjs`), so Beatrice has a
  4else address. Chosen over embedding it in the site: an embedded Studio
  would pin Sanity v3 (the last line for React 18), weigh down every site
  build, and only ship schema changes with a site deploy.
- **German only:** `@sanity/locale-de-de` plus
  `i18n.locales` filtered to `de-DE`, and German field titles and help texts.
  Sanity's own sign-in screen stays English; it is outside the Studio's
  language setting.
- **Structure:** "Inspirationen" → Alle Artikel, then three views by state:
  **Online** (published, date passed), **Geplant** (date in the future) and
  **Entwürfe** (drafts and unpublished changes), then Autor:innen. "Now" for
  those filters is taken when the Studio loads (`$now` param). The top bar
  holds Inhalte and **Vorschau** (§5h); the Vision (GROQ) tool and
  Vercel-Zugang show only for administrators.
- **Branding** mirrors the website:
  - `@sanity/themer` `buildTheme`, per colour scheme:
    - light: accent `#5B5BD6`, text `#393951`;
    - dark: accent `#7C5CF0`, the site's dark-ground violet.

    Version 0.7 takes `{light, dark}`, not the flat options in Sanity's docs.
    It needs React ≥ 19.3.
  - Logo: the navy "4e" mark (`components/StudioIcon.tsx`) in the top bar
    and on the login screen.
  - Favicons: the six files Sanity expects in `studio/static/`, derived from
    the site's `app/icon.png`, `app/apple-icon.png` and `app/favicon.ico`.
    `favicon.svg` wraps a PNG, as no vector of the mark exists.
- **Commands** (in `studio/`): `npm run dev` (localhost:3333; also the
  `studio` entry in `.claude/launch.json`), `npm run build`,
  `npm run deploy` (publishes the hosted Studio; this is outward-facing, so
  confirm first), `npm run schema:deploy`.
- **`@sanity/icons` 5** exports each icon from its own path:
  `import {UserIcon} from '@sanity/icons/User'`. The package root no longer
  exports the icons.
- **Schema** (`studio/schemaTypes/`):
  - `article`: `title`, `slug`, `excerpt` (Anriss, ≤ 200), `mainImage` (alt
    required), `publishedAt`, `author` → `author`, `body` (`blockContent`),
    `seo.metaTitle` / `seo.metaDescription`;
    **title lengths** (Robin, September 2026, after Beatrice found 90 too
    short): `title` warns from 70 characters and stops at 125;
    `seo.metaTitle` warns from 60 and stops at 100. A warning still lets
    her publish. Past ~70 the article heading runs to four lines and more
    on a phone, and Google cuts title links at ~60 (the site adds
    " — 4else"), so long titles want a shorter `metaTitle`;
  - `author`: `name`, `role`, `photo`;
  - `blockContent`: normal/H2/H3/quote, bullet/number lists, bold, italic,
    link (`href`, `blank`), image (`alt`, `caption`), **FAQ block** (`faq`);
  - `faq` (`faq.ts`): optional `title` (default "Häufige Fragen", shown as
    the FAQ's h2) and `items`, each `question` (≤ 160) + `answer` (paragraphs,
    bullet/number lists, bold, italic, links; the link annotation is shared
    with the body as `linkAnnotation` in `blockContent.ts`). Beatrice
    inserts it anywhere in the text, like an image.
  - `linkCard` (`linkCard.ts`): `label` (Kategorie, default "Tool-Tipp"),
    `name` (≤ 40), `title` (≤ 90), `text` (≤ 300), `url` (http/https) and an
    optional `image` (hotspot, `alt` required). For a tool, partner or site
    worth a click; first used for Limen in the Limen article (September
    2026, replacing the old site's promo box).
  - `callout` (`callout.ts`, "Hinweisbox"): `tone` (`wissen` Gut zu
    wissen / `wichtig` Wichtig / `tipp` Unser Tipp, default `wissen`),
    optional `title` (≤ 90) and `content` (paragraphs, bullet/number
    lists, bold, italic, links via `linkAnnotation`). **No subheadings
    inside** (Robin, September 2026): a box has one title, and long
    multi-section passages stay normal article text.
  **Adding a block type or style needs its renderer** in
  `components/inspirationen/ArticleBody.tsx`. After a schema change, run
  `npm run deploy` (or `schema:deploy`) so the hosted Studio has it. **Never
  delete an "unknown field" in the Studio**: it can be real data under a
  stale schema (it has already cost Mechane a field).
- **Access:** editors are members of project 6e5n16nr, invited by Robin in
  sanity.io/manage → Members. Beatrice gets the **Editor** role.

**The site:**
- `lib/sanity.ts` holds the read-only client (no token,
  `perspective: 'published'`), `urlFor`, and the queries `getArticles`,
  `getArticle` (wrapped in `cache()`) and `getArticleSlugs`. Every query
  requires `publishedAt <= now()`, so **a future date schedules a post**.
  The listing and the index fail soft (return `[]`).
- Routes (`lib/routing.ts`): `/inspirationen` (overview, with an empty state
  until the first article) and `/inspirationen/[slug]` (a 404 for unknown or
  future slugs). Both revalidate every 60s. Styles in
  `inspirationen.module.css` are a plain first version in the site's tokens,
  to be replaced when a design handoff exists. Copy is in the
  `inspirationen` and `meta.inspirationen*` namespaces.
- **Article column: 720px of text** with the **hero image at 992px** (Robin's
  choice after trying 664/760 text and an 840px image).
  - The side padding sits outside the text column:
    `calc(720px + 2 * var(--gutter))`. That gives ~70 characters a line at
    18px; don't go past ~800px of text.
  - The hero reaches halfway from the old 60px overhang to the page's content
    edge, the line the header's wordmark and Demo button sit on (1144px at
    desktop):
    - `--space` = room between the text and that edge, per side;
    - `--overhang` = `min(--space, (--space + 60px) / 2)`, measured against
      `.articleMain`, a size container;
    - result: 136px per side, a 992px image, 76px short of the header edge;
      it meets the edge on medium screens and matches the text on phones.
  - Body images stay in the text column (`sizes` 720px). The hero is sized
    for 992px (2000px source).
  - A body image is never shown larger than its own pixel width (inline
    `max-width` from the asset's dimensions, in `ArticleBody.tsx`): small
    pictures in older articles, like the 225px scans in the Copytrack post,
    stay sharp instead of being stretched to 720px.
- **Byline** (mockup option A, chosen by Robin): between the lead and the
  hero image, framed by two hairlines.
  - Left: the author's round photo (52px), name and role, from the
    `author` reference.
  - Right: the date and the reading time (`readingTime` message,
    `readingMinutes` computed in `getArticle` at ~200 words per minute).
  - Below 560px the date line drops under the author. Without an author,
    only the date line shows.
  - The avatar crops with the photo's **crop and hotspot** from the Studio.
    Without them it shows the whole landscape photo shrunk to a circle, so
    each author photo needs its crop set to head and shoulders.
- Images come from `cdn.sanity.io` (`images.remotePatterns`). Body images
  take their size from the asset ID (`image-<hash>-2000x1333-jpg`).
- **FAQ blocks** render as the start page's accordion, narrowed to the text
  column (`components/inspirationen/ArticleFaq.tsx` + `.module.css`, CSS
  ported from the start page's FAQ, both animation techniques):
  - numbered (01)…, drawn plus/minus, the first answer open;
  - native `<details>`, no script; all items of one block share
    `name="faq-<block _key>"`, so opening one closes the others and two FAQ
    blocks in one article stay independent;
  - answers go through the article's own Portable Text components (passed
    in by `ArticleBody`), so lists and links look like the text.
  The article page also emits a schema.org **FAQPage** from all its FAQ
  blocks (`FaqPageJsonLd` in `components/seo/FaqJsonLd.tsx`, answers as
  plain text via `toPlainText`; nothing without an FAQ). FAQ text counts
  towards the reading time (`faqItems` / `readingMinutes` in
  `lib/sanity.ts`). First used by "Event-Tools im Vergleich", whose
  imported FAQ was converted into a block (September 2026).
- **Link cards** (`components/inspirationen/LinkCard.tsx`, mockup option A,
  chosen by Robin): a white card, image left (on top ≤ 620px), then
  "Kategorie · Name", title, description clipped at three lines, and a
  footer with the name's initial, the domain and "Entdecken →".
  - **The card is not one big link**, because the image is its own button.
    The title's link stretches over the text column (`::after`), always
    opens in a new tab, and hovering it lifts the card.
  - **The image enlarges** (`ZoomImage.tsx`, a client component):
    - a magnifier shows on hover and focus, or small and permanent on
      touch screens;
    - a click opens a native `<dialog>` at the image's own width, at most
      the screen minus 24px all round. The width is set inline so the box
      has its size before the file loads; the file is fetched only on open,
      with a small preview behind it;
    - any click in the dialog, beside the image or on it, closes it, and so
      does Escape. The page stops scrolling meanwhile, with
      `scrollbar-gutter: stable` so it doesn't jump sideways when the
      scrollbar disappears (Robin noticed a jump on close);
    - the image grows out of the card and shrinks back into it (FLIP, Web
      Animations API, 280ms), or only fades under reduced motion;
    - running animations are cancelled before measuring, and `open` is
      also set directly, as in the mobile menu.
  - Card title and text count towards the reading time. `assetSize()` in
    `lib/sanity.ts` reads an asset's size from its id (also used by body
    images).
- The sitemap adds one entry per article, with `_updatedAt`.
- **Callouts** (`components/inspirationen/Callout.tsx` + `.module.css`),
  replacing the old site's flat grey boxes. Robin reviewed four mockups
  (https://claude.ai/artifact/Pf57h9R9CJVZHaHWVHLAkQ) and chose a mix
  (September 2026):
  - **Gut zu wissen** (option B): Eisblau, a navy info icon left of the
    uppercase label;
  - **Wichtig** (option C's third tone): Eis-Orange, an orange "!" in the
    same place. It is Akzent Orange's first use on the site, and only as
    a graphic: orange text on Eis-Orange fails contrast;
  - **Unser Tipp** (option D): Eisviolett, Else's face
    (`public/images/ui/else-face.webp`, 56px, `alt=""`) on the top edge
    beside a navy speech bubble.
  - The labels are the site's copy (`inspirationen.callout*`), not
    Sanity's; the Studio only picks the tone. **The tone is
    `stegaClean`ed** before it is compared (in the Vorschau it carries
    stega, §5h), and anything unknown falls back to Gut zu wissen.
  - An `<aside>` named by its label and title. The text goes through the
    article's own Portable Text components, a size down (17px). Title and
    text count towards the reading time.
  - The two grey boxes of "Kurs absagen" were converted by Claude as a
    draft (September 2026): the first as Gut zu wissen, the second
    ("Unsere Empfehlung") as Unser Tipp.
- **Instant updates:** `app/api/revalidate` (POST, header
  `x-webhook-secret` = `SANITY_REVALIDATE_SECRET`). Once the production
  domain exists, create the webhook in sanity.io/manage → API → Webhooks:
  URL `https://<domain>/api/revalidate`, filter `_type == "article"`, and set
  the same secret in Vercel. Without the webhook, new articles appear within
  60 seconds.
- The header and footer links to Inspirationen are real routes now. The
  header marks the link on the overview and on every article.

---

## 5g. Impressum

`app/[locale]/(site)/impressum/page.tsx` (+ `page.module.css`), route
`/impressum` in `lib/routing.ts` (so it is in the sitemap); the footer's
"Impressum" link points at it, so the wip dialog no longer applies there.
Copy in the `impressum` and `meta.impressum*` namespaces.

- **Source:** the old site's Impressum (4else.events/impressum), brought up
  to date with Robin (September 2026):
  - e-mail `info@4else.com`, not the old `info@fourelse.com`;
  - Swiss terms: "UID (Unternehmens-Identifikationsnummer)", not "USt-ID";
    "Verantwortlich für den Inhalt", not "Journalistisch-redaktionelle
    Angebote"; ss throughout;
  - "du", like the rest of the site, also in the legal notices;
  - the 4my.horse social media list dropped; the two old product
    paragraphs replaced by one note on 4else.com and 4else.one.
- **One source for company data:** name, street, city, e-mail and phone are
  the footer's `footer.*` keys, so footer and Impressum cannot disagree.
- **AGB** links to the old site's AGB for now
  (`4else.events/allgemeine-geschaeftsbedingungen/`); point it at the new
  AGB page once there is one.
- No generator attribution: the old page's "Erstellt mit dem kostenlosen
  Datenschutz-Generator.de …" line was removed at Robin's request.
- **Look:** the Inspirationen overview's header, then the sections as rows
  on hairlines, title left (290px, wide enough for
  "Berufshaftpflichtversicherung") and content right from 800px, stacked
  below.
- Not legal advice: the wording is the old page's, adapted; have it
  checked if the company data or the legal notices change.

## 5h. Vorschau — Sanity visual editing

Beatrice checks an article before publishing it in the Studio's
**Vorschau** tool (Sanity's Presentation tool): the real website on the
left, the editing form on the right. It shows drafts and future-dated
articles; every text on the page is clickable and opens its field; the
page refreshes as she types. Built September 2026 on `next-sanity` 13.
Visitors see nothing of it.

**How it works:**
1. The Studio loads the site in an iframe and calls
   `/api/draft-mode/enable` with a one-time secret. The route checks it
   against Sanity with the read token and turns on Next's draft mode for
   that browser only. No valid secret, no draft mode (401); no token, a
   503 that says so.
2. In draft mode, `sanityFetch` in `lib/sanity.ts` runs the same queries
   with the token, uncached, in the perspective the Studio chose
   (Entwürfe by default, stored in a cookie), and with `$preview`, which
   drops the `publishedAt <= now()` filter. The texts come back with
   **stega**, invisible characters recording each text's document and field.
3. The locale layout mounts `components/preview/Preview` only in draft
   mode. It lazily loads the overlays (`PreviewOverlays`, next-sanity's
   `<VisualEditing>`), which read the stega and draw the click targets,
   and the exit bar (`ExitPreview`).

**Things to keep:**
- **Visitors are untouched.** Draft mode is off for them, so pages stay
  prerendered (the build lists them as ●) and get no stega. The preview's
  JavaScript is behind `next/dynamic` in `Preview.tsx`: imported directly
  into the layout, ~590 KB of it reached every visitor. Keep any new
  preview-only client code behind that stub, and after changes check that
  no chunk of a prerendered page contains `visual-editing` or `xstate`.
- **Stega stays out of non-visible text.** Sanity's client already skips
  dates, slugs, URLs, `href`/`url` fields and everything under `seo`. What
  it does encode is cleaned with `stegaClean` wherever text leaves the
  page: the article's `generateMetadata` and its FAQ structured data. Do
  the same for any new metadata, JSON-LD or string comparison on content.
- **Edits refresh the page through our handler.** Without the Live Content
  API (not used here: it would change how visitors' pages are cached),
  next-sanity refreshes only on Studio actions, not on edits.
  `PreviewOverlays` passes a `refresh` handler that calls
  `router.refresh()`. It also passes next-sanity's
  `perspectiveChangeAction`, which is marked internal, so **`next-sanity` is
  pinned to an exact version**: re-check `PreviewOverlays` when upgrading.
- **`@sanity/client` stays on the major that next-sanity depends on** (7),
  or two client copies clash in the types.
- **The Studio installs into the site.** next-sanity lists `sanity` as a
  required peer, so npm puts the Studio package (~145 MB with its
  dependencies) into the site's `node_modules`. Nothing imports it; it
  never reaches a page. The `npm audit` warnings from its CLI come from
  there.
- `generateStaticParams` and the sitemap use `getArticleSlugs`, which
  never reads draft mode: they run outside a request.

**Studio side** (`studio/presentation.ts`): `mainDocuments` opens the
article for `/inspirationen/:slug`; `locations` shows "Verwendet auf" in
the form. The site it previews is `SANITY_STUDIO_PREVIEW_URL`:
`studio/.env.development` points `npm run dev` at localhost:3007, and the
hosted Studio defaults to `https://4else.vercel.app`. **When the
production domain exists**, change `SITE` and `allowOrigins` there and
deploy the Studio.

**Vercel Deployment Protection** covers 4else.vercel.app, which would show
Vercel's login inside the Vorschau. The Studio's **Vercel-Zugang** tool
(`@sanity/vercel-protection-bypass`, administrators only) stores Vercel's
"Protection Bypass for Automation" secret in the dataset, and the
Presentation tool then passes it with every preview request. Visitors stay
locked out. If the protection is ever switched off, the tool can go.

**Exit bar:** opened outside the Studio (its "open in new tab"), the page
shows a navy "Vorschau mit Entwürfen · Vorschau beenden" capsule bottom
left (`preview` messages), which ends draft mode through
`/api/draft-mode/disable` and returns to the same page. Inside the Studio
it stays hidden.

## 6. SEO

- Title and description come from `messages/*.json` (`meta` namespace) in the
  layout's `generateMetadata`.
- **Favicon:** `app/icon.png` (512px), `app/apple-icon.png` (180px) and
  `app/favicon.ico` (32px). Next.js picks these up by filename and emits the
  link tags itself — no `<head>` markup anywhere. The mark is the "4e" from
  4else.events (white on a leaf-shaped tile), **redrawn in the client's
  Primär `#41425E`** (it was the old violet `#60608B`). The recolour kept the
  artwork's own antialiasing: each pixel was placed at the same point between
  navy and white as it sat between violet and white, so the edges stay soft
  and the glyph stays pure white. The apple icon is the 512px icon composited
  onto a navy square and scaled — iOS renders transparency black, and
  compositing (rather than the old flattened file) leaves no seam along the
  leaf's outline.
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
| `SANITY_API_READ_TOKEN` | Viewer token for the Vorschau (§5h); server only. In `.env.local` and in Vercel (Production and Preview) |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Optional; where preview overlays link outside the Studio (default `https://fourelse.sanity.studio`) |
| `SANITY_REVALIDATE_SECRET` | Webhook secret for `/api/revalidate` (§5f) |

---

## 8. Git — committing, pushing, branching

**Commit to `main` freely. Never push, and never branch, without Robin's
explicit order.**

- **Commit** — pre-authorised. Commit whenever the work warrants it.
- **Push** — gated. Stop after the commit and say what is waiting. Once
  Vercel is connected, a push to `main` deploys.
- **Branch** — gated. Work on `main` unless asked otherwise.

Remote: `https://github.com/aischle/4else.git`.
