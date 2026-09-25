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
  with bow tie and service bell, rests right of the lead with her tail on the
  Beatrice panel's top edge, under a navy speech bubble (`elseBubble`; alt
  `elseImageAlt`). The image is `public/images/kontakt/else-concierge.webp`, a
  **transparent** cut-out (469×600, trimmed to her outermost glow) that simply
  fills the 200×256 `.else` box: no crop, no blend mode. The 404 keeps its
  own `else-sucht.webp`. Below about 700px she wraps under the lead,
  right-aligned. Her negative bottom margin is the hero's bottom padding + the
  band's top padding + 4px + 15px (the glow under her tail, so the tail itself
  meets the edge); change either padding and change it too. `.else` is
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
  width. After replacing it, clear `.next/cache/images`. **`beatriceBody` is design copy, since revised once on Beatrice's
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
  the file, clear `.next/cache/images`, or the dev server keeps serving the
  old optimised copy.
- **The numerals are decoration** (`aria-hidden`); the visible eyebrow says
  "Fehler 404" in words, and the heading is the sentence below.
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
  | no attribute | *Diese Seite ist noch nicht gestaltet.* — Preise, Über uns, Inspirationen (the future blog), the card links, Impressum, AGB, Datenschutz |

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

---

## 8. Git — committing, pushing, branching

**Commit to `main` freely. Never push, and never branch, without Robin's
explicit order.**

- **Commit** — pre-authorised. Commit whenever the work warrants it.
- **Push** — gated. Stop after the commit and say what is waiting. Once
  Vercel is connected, a push to `main` deploys.
- **Branch** — gated. Work on `main` unless asked otherwise.

Remote: `https://github.com/aischle/4else.git`.
