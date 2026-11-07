# Portfolio Case Studies (measured + observed)

Four creative-studio portfolios the user selected, captured live (Firecrawl
tokens + screenshots, Chrome scroll/motion). They share the constants (cinematic
intro, smooth scroll, custom cursor, big type, work-first) but pick different
canvases and layouts — exactly the point of the layout menu.

## Lusion — `lusion.co` · `lusion.png`
- Tokens: content fonts **Aeonik** (clean geometric grotesque), `radius: 15px`,
  H1 ~48px; canvas runs **dark/WebGL** in the hero, lighter content sections.
- Observed: opens on a **long cinematic preloader** — black screen, a 0→100
  **counter** bottom-left rendered as big kinetic (mirrored/morphing) numerals,
  loading bar. The site is an **interactive/WebGL canvas** (archetype A9):
  award-winning 3D, cursor-reactive, projects explored as objects.
- Steal: the heavy preloader + WebGL stage when the work is technical/3D. Only if
  it stays 60fps. *(Print caught the preloader — that intro IS the signature.)*

## Obys — `obys.agency/work/the-ways-we-work-miro` · `obys-miro.png`
- Tokens: bg **#000**, accent **red #FF0000**, custom **"Obys"** display font,
  `radius: 0`, H1 tiny (~14px tracked).
- Observed: a **case-study page** (archetype B1). Opens on a preloader — black,
  a morphing **"O" logo** center + a 0→100 counter bottom-right. The project then
  unfolds as a title-card → full-bleed media sequence → text interludes → next.
- Steal: the dark+red case-study treatment; the morphing-logo preloader; the
  title-card-then-media-sequence project page.

## Cuberto — `cuberto.com` · `cuberto.png`
- Tokens: bg **#fff**, text **#000**, accent **red #EB4242**, font **Suisse Int'l**,
  `radius: 20px`, **H1 ~90px** (huge).
- Observed (live): clean **white** canvas, enormous bold grotesque hero ("Digital
  design & development agency"), then scroll reveals a **two-column editorial text
  block** with a **circular custom cursor** ("contact"/"What we do" rotating
  label). Big type + generous space + custom cursor; work shown in a grid below.
- Steal: white-canvas big-type agency layout, rotating-label custom cursor,
  scroll-revealed two-column copy.

## Unseen — `unseen.co` · `unseen.png`
- Tokens: bg warm **beige #EFDED9**, text **#212121**, font **Neue Montreal**,
  `radius: 0`, H1 ~38px.
- Observed (live): warm beige canvas, a **kinetic letter-by-letter intro**
  assembling the wordmark (U-N-S-E-E-N) centered, with a centered tagline. Minimal,
  refined, motion-led; work revealed on scroll (hover-reveal list / minimal —
  archetypes A6/A10).
- Steal: warm non-white canvas; centered kinetic-letters intro; minimal,
  refined, hover-reveal presentation.

## The cross-cutting pattern (all four)
**Cinematic preloader (counter 0→100 + kinetic logo/letters) → reveal → smooth
scroll with custom cursor and choreographed media reveals.** Canvas and layout
vary; the *motion grammar* is constant. That's why portfolio is a layout+motion
lens, not a color one — see `layout-patterns.md` to pick a distinct combination
each time, and implement the motion via **awesome-react-animations**.

> Capture note: Lusion and the Obys case study have long WebGL/cinematic
> preloaders that don't finish in an automated browser, so their bundled prints
> show the *intro* state (itself a defining signature). Cuberto and Unseen were
> captured with content visible.
