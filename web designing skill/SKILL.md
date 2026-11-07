---
name: portfolio-web-design
description: |
  The PORTFOLIO lens — work-first, motion-rich sites that showcase projects: studio/agency portfolios, personal designer/developer portfolios, photographer/director reels, case-study showcases. Use when the user wants this look or names it: "portfolio", "showcase my work", "studio/agency site", "case studies", "awwwards-style portfolio", "creative reel", or is building anything that presents a body of work. Ships a MENU of layout patterns (references/layout-patterns.md) so multiple portfolios don't look the same — pick a different home archetype + case-study pattern + motion intensity each time. A STYLE LENS: apply on top of awesome-frontend-design, implement motion with awesome-react-animations. Anchored in teardowns of lusion.co, obys.agency, cuberto.com, unseen.co. Core feel: big confident type, media-forward layout, generous space, cinematic intro, smooth scroll, custom cursor, choreographed reveals — palette-flexible (dark, light, or warm).
metadata:
  mcpmarket-version: 1.0.0
---
# Portfolio — the lens

A portfolio's only job is to make the *work* look inevitable and the maker look
in command of their craft. The best ones (Lusion, Obys, Cuberto, Unseen) are
**work-first, motion-rich, and spacious** — big type, big media, a cinematic
entrance, and buttery scroll — but they differ enormously in *layout*. That
difference is the point: if you build ten portfolios they must not feel like ten
copies of one template.

Apply on top of the `awesome-frontend-design` method. The most important file
here is **`references/layout-patterns.md`** — a menu of home and case-study
layouts to choose and combine. Real teardowns (tokens + prints) are in
`references/case-studies.md`.

## What every great portfolio shares (the constants)

- **Work is the hero.** Media (image/video reels) is large, well-cropped, and
  front-and-center; chrome is minimal. The grid serves the work, not vice versa.
- **Big confident type + generous space.** A strong grotesque set large for
  titles; lots of breathing room. Restraint around the work makes it feel curated.
- **A cinematic intro.** A short preloader — a 0→100 counter and/or a kinetic
  logo/letters assembling — buys asset-load time and earns a dramatic first
  reveal. (All four references open this way.)
- **Smooth, weighted scroll** + **a custom cursor** (often a rotating "view/drag"
  label or a magnetic dot) + **hover media reveals**. These three signal craft.
- **Choreographed reveals & page transitions.** Projects animate in as they enter;
  navigating into a case study is a continuous transition, not a hard cut.
- **Palette-flexible.** Portfolio is defined by *layout + motion*, not color. The
  references run dark/WebGL (Lusion), white (Cuberto), warm beige (Unseen), and
  black+red (Obys case study). Pick a canvas that flatters the work.

## The variable: choose a layout (so they don't repeat)

Don't default to "grid of cards" every time. Pick deliberately from
`references/layout-patterns.md`:

**Home / index archetypes** (presenting the *list* of work): numbered editorial
index · full-bleed media grid · horizontal-scroll gallery · scroll-jacked
full-screen slides · asymmetric editorial collage · hover-reveal list with
floating preview · split sticky-info + scrolling-media · marquee/showreel ·
interactive/WebGL canvas · minimal one-at-a-time.

**Case-study / project-page patterns** (presenting *one* project): title-card hero
→ full-bleed media sequence → text interludes → next-project · two-column sticky
text + scrolling media · alternating full-bleed/contained long-form · horizontal
case study.

**To keep 10 portfolios distinct, vary across these axes each time:**
1. Home archetype (list vs grid vs slides vs canvas…).
2. Case-study pattern.
3. Canvas (dark / light / warm / mono / one-bold-color).
4. Type personality (neutral grotesque vs expressive display vs serif accent).
5. Motion intensity (subtle reveals → full WebGL/scroll-jack).
6. Cursor/intro treatment.
Two portfolios that share an archetype but differ on 4–5 of these will read as
entirely different sites.

## Process (with this lens)

1. **Inventory the work** and let it choose the canvas (dark for moody film/3D,
   white for product/brand, warm for editorial/craft).
2. **Pick a home archetype + a case-study pattern** from the menu — ideally not
   the same combo you used last time.
3. **Set type + space**: one strong grotesque, large titles, generous margins.
4. **Choreograph the entrance and scroll**: preloader → reveal → per-project
   reveals → project transition. Add a custom cursor + hover media reveal.
5. **Implement smoothly** per `awesome-react-animations` (Lenis smooth scroll,
   split-text intro, `whileInView` reveals, reduced-motion fallback). For the
   work→case-study navigation, make the card **morph into the detail hero**
   (shared-element View Transition) so clicking "enters the card" and back reverses
   it — the single move that makes a portfolio feel awwwards-grade. WebGL only if
   the work warrants it.

## Do / Don't

**Do:** make media big; pick a distinct layout per project; commit to one strong
type voice; choreograph a cinematic intro + smooth scroll + custom cursor; keep
chrome minimal so the work dominates.
**Don't:** reuse the same card-grid template every time; bury work under UI; add a
generic fade-up to every block; let motion fight the work (or tank performance —
WebGL/scroll-jack must still hit 60fps and respect reduced motion).

## References
- `references/layout-patterns.md` — **the menu** of home + case-study layouts with
  when-to-use and how each disposes content. Start here.
- `references/case-studies.md` — lusion / obys / cuberto / unseen teardowns
  (measured tokens + observed layout & motion) with bundled prints.
- Overlaps with **editorial-web-design** (the numbered-index pattern + organic
  motion live there too). Pair with **awesome-frontend-design** (method) and
  **awesome-react-animations** (60fps motion: preloader, smooth scroll, reveals,
  and the **shared-element card→case-study morph** — see its
  `references/view-transitions.md`). For the interactive-WebGL-canvas archetype
  (A9 — glass/blob/particles, an immersive Lusion-style hero), use **awesome-webgl**.
