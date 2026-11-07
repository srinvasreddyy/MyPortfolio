# Portfolio Layout Patterns — the menu

Pick a different combination each time so portfolios don't repeat. Two parts:
**(A) Home/index archetypes** — how you present the *list* of work — and
**(B) case-study patterns** — how you present *one* project. Mix one from each,
then vary canvas/type/motion (see the variation matrix at the end).

---

## A. Home / index archetypes

### A1. Numbered editorial index
Vertical list of project rows: `01 — Project Title — Client`. Media hidden until
**hover**, where a preview image/video reveals (inline or floating near the
cursor). Text-forward, fast to scan, very editorial.
- **Disposition:** full-width rows stacked; tiny media or none until hover.
- **Best for:** many projects, word-driven brands, an "index/contents" feel.
- **Motion:** hover media reveal/clip; row underline; char-stagger titles.
- *(Cousin of editorial-web-design's heyhoncho index.)*

### A2. Full-bleed media grid
A grid (uniform or **masonry**) of project thumbnails — image/video — edge to
edge or with tight gutters. The work *is* the page.
- **Disposition:** 2–4 columns; cards can be mixed aspect ratios for rhythm.
- **Best for:** visual work (photo, film, 3D, product) where images sell.
- **Motion:** hover scale + video autoplay; staggered grid reveal on scroll.

### A3. Horizontal-scroll gallery
Projects laid left→right; vertical scroll is translated to **horizontal** movement
(or drag). Cinematic, gallery-like, unexpected.
- **Disposition:** a long horizontal track of large media panels.
- **Best for:** a curated handful of hero projects; directors, photographers.
- **Motion:** scroll-linked translateX, parallax depth, drag with inertia.

### A4. Scroll-jacked full-screen slides
**One project per viewport**; scroll snaps/scrubs between full-bleed slides, each
with big media + title + index.
- **Disposition:** 100vh sections, title overlaid or beside the media.
- **Best for:** a small number of flagship projects you want to dominate.
- **Motion:** snap or scrub transitions, crossfades, title kinetic reveal.

### A5. Asymmetric editorial collage
Projects placed **off-grid** at varied sizes/positions, like a magazine spread or
pinboard; scattered but balanced.
- **Disposition:** absolute/auto-placed items, different scales, intentional
  whitespace and overlap.
- **Best for:** a personality-forward studio/personal site; fewer items.
- **Motion:** parallax per item, reveal on enter, subtle float on hover.

### A6. Hover-reveal list with floating preview
Like A1 but the hovered row spawns a **media preview that follows the cursor**
(eases toward pointer). Minimal until you interact, then alive.
- **Disposition:** centered or left list; preview floats over empty space.
- **Best for:** minimal/refined studios; warm or mono canvases (e.g. Unseen vibe).
- **Motion:** lerped cursor-following preview, fade/scale in.

### A7. Split: sticky info + scrolling media
Two columns: one side **sticky** (project title/credits/description), the other
**scrolls** through that project's media; advancing swaps the sticky info.
- **Disposition:** ~40/60 split; sticky column pinned while media streams.
- **Best for:** work that needs context/credits alongside imagery.
- **Motion:** sticky pin, info crossfade synced to media (caption-to-media sync).

### A8. Marquee / showreel
A featured **reel** (autoplay video) up top + **auto-scrolling marquee rows** of
logos/projects beneath. High-energy, "always moving."
- **Disposition:** hero reel + 1–2 infinite marquee strips + a grid below.
- **Best for:** agencies with lots of brand logos / motion work.
- **Motion:** infinite marquee (transform loop), reel autoplay, hover pause.

### A9. Interactive / WebGL canvas
Projects as objects in a 2D/3D/physics space the user explores (drag, orbit,
hover-to-expand). Maximal, memorable, heavy.
- **Disposition:** a canvas stage; thumbnails as draggable/floating tiles.
- **Best for:** technical/creative-dev studios where the medium is the message
  (Lusion / Active Theory). Use only if it serves the work and stays 60fps.
- **Motion:** WebGL, physics, cursor-reactive distortion, on-click zoom-in.

### A10. Minimal one-at-a-time
Show a **single featured project** filling the screen; prev/next (or auto-rotate)
cycles through. Maximum focus per project.
- **Disposition:** one full-bleed project + minimal nav (counter, arrows).
- **Best for:** very small, high-end bodies of work; photographers.
- **Motion:** crossfade/slide between projects; counter; kinetic title.

---

## B. Case-study / project-page patterns

### B1. Title-card → media sequence → text interludes → next
Open on a centered **title card** (project name huge + a line of credits), then a
vertical **sequence of full-bleed media** with short text interludes between, and
a prominent **"next project"** at the end that transitions onward.
- **Best for:** most studio case studies (Obys / heyhoncho detail).
- **Motion:** shared-element transition into the title; reveals per media block.

### B2. Two-column sticky text + scrolling media
Sticky left column (overview, role, credits, year) while the right column scrolls
through the project's images/video.
- **Best for:** context-heavy work (product, UX, strategy).

### B3. Alternating long-form editorial
Full-width hero, then alternating **full-bleed** and **contained** media with
generous body copy and pull-quotes between — a long, paced read.
- **Best for:** narrative case studies, brand/identity work.

### B4. Horizontal case study
The project unfolds **horizontally** (scroll→sideways) as a sequence of panels.
- **Best for:** a signature flagship project you want to feel special.

---

## Cross-cutting signatures (apply to ANY layout)
Cinematic preloader (0→100 + kinetic logo/letters) · smooth/inertial scroll
(Lenis) · custom cursor (rotating label / magnetic dot) · hover media reveals ·
kinetic split-text intro · page/route transitions (View Transitions) · big
grotesque type · generous negative space. Implement all per
**awesome-react-animations**, reduced-motion-aware.

---

## Variation matrix — how to make 10 portfolios feel different
Hold the *constants*, vary the *axes*:

| Axis | Options |
|---|---|
| Home archetype | A1–A10 (don't reuse last) |
| Case-study pattern | B1–B4 |
| Canvas | dark · white · warm/cream · mono · one bold color |
| Type voice | neutral grotesque · expressive display · grotesque + serif accent |
| Motion intensity | subtle reveals → scroll-jack → full WebGL |
| Cursor / intro | magnetic dot · rotating label · counter preloader · kinetic letters |

Rule of thumb: **change the home archetype + at least 3 other axes** between
projects and they will not read as the same template — even with the same
underlying craft.
