# Design

## Context

Follows `theme-layouts-and-copy` (merged). `index.html` paints the photo as `html { background: var(--bg) var(--art) center top / cover no-repeat }`, with a phone variant and a gradient fade tied to the phone image's aspect ratio. `#app` renders hero → schedule → rules as plain siblings. See proposal.md for why each item is being changed.

## Goals / Non-Goals

**Goals:**
- Treat the photo with CSS only, so no new files are downloaded.
- Keep the fixes small and local: one CSS block each for the header button and the rule numbers.

**Non-Goals:**
- No new photos, no image editing, and no change to the schedule's contents or wording.
- Not changing View Transitions, which already work.

## Decisions

### 1. Background treatment in two fixed layers
`body::before` (tint) and `body::after` (grain) are fixed, cover the window, are `pointer-events: none` and sit at `z-index: -1`, above the `html` photo and below `.wrap`.
- **Duotone:** the tint layer is a two-stop gradient between a dark and a light theme colour (`--duo-dark`, `--duo-light`) with `mix-blend-mode: color`, plus its own dimming via opacity. `color` blending keeps the photo's light and shade while replacing its hue, which is what makes it read as a duotone rather than a wash.
- **Grain:** a small inline SVG `feTurbulence` tile repeated at about 180px, at low opacity, with `mix-blend-mode: overlay`. It is one data URI, a few hundred bytes, and stays crisp at any size.
- **Crop:** a per-theme `--art-size` (about 130–150%) and `--art-pos`, replacing `cover`, so each photo is pushed in on its subject. Phones keep their own image and its existing gradient fade, with a smaller zoom so the fade still lines up.
- *Alternative:* `filter: sepia() hue-rotate()` on the html background. Rejected, because filters can't be applied to a background image without also filtering the content above it.
- *Fallback:* where `mix-blend-mode` is unsupported, the layers still dim the photo, so text stays readable.

### 2. The header button's open state
The phone rule `nav.top .panel { background: transparent }` (specificity 0,2,1) currently beats `.style-btn[aria-expanded="true"]` (0,2,0), so the open button loses its fill while its icon still flips to the light colour. Fix by scoping the open state to the nav as well (`nav.top .style-btn[aria-expanded="true"]`), rather than by adding `!important`. The same is checked for `.theme-seg button[aria-pressed="true"]`.

### 3. Rule numbers
`.rules li` keeps `align-items: baseline`, and the numbers drop to roughly the text's own size (about 26px in Rock, 22px elsewhere) with `line-height` matched to the text's first line. A number that is much larger than its text will always overhang the line it sits on, so the fix is size, not alignment alone.

### 4. Section order
`#app` becomes a flex column, and each theme sets `order` on `.schedule` and `.rules`, so Rock's rules move above the schedule without re-rendering. The Classical date line can't move with `order`, because it lives inside `.hero`; instead `renderHero` leaves it out for Classical and the page appends `<p class="when when-footer">` after the rules. It is rendered once either way, so screen readers hear it once.

### 5. Row fade-in fallback
Keep the scroll-driven version under `@supports (animation-timeline: view())`. Under `@supports not (animation-timeline: view())`, rows start at `opacity: 0` with a transition, and an `IntersectionObserver` adds `.in` as each row enters. Guards: the observer only runs when the browser lacks scroll timelines and reduced motion is off; rows are re-observed after each render; and if `IntersectionObserver` is missing, the CSS starting state is never applied, so rows stay visible.

## Risks / Trade-offs

- [`mix-blend-mode: color` over a fixed layer can be expensive on older phones] → Both layers are static (no animation, no repaint on scroll), and `background-attachment` stays default.
- [A heavier crop can cut the subject badly at some window shapes] → Each theme's `--art-pos` is chosen from screenshots at 375px and 1280px.
- [Rows hidden by a fallback that never fires] → The hidden starting state lives only inside `@supports not (...)`, and the observer is attached in the same render pass that creates the rows; a missing observer leaves rows visible.
- [Moving the rules above the schedule in Rock pushes the schedule down] → Accepted; it is the point of the change, and the schedule still starts above the fold on desktop.

## Migration Plan

Branch → implement → check all six looks at 375px and 1280px, plus contrast → PR → merge deploys to Vercel. Rollback is reverting the merge.
