# Design

## Context

`index.html` is one static page: inline CSS, the Firebase compat SDK, and one IIFE that renders by building HTML strings. `fix-bugs-and-harden-rules` put the data layer in good shape: normalized cells, admin transactions, a scoped listener, a 30-second tick, and a Manage redraw hook. This change replaces the presentation only.

The design source is the Claude Design canvas (Main/LateSet/Admin/Phone boards). Those boards are fixed-size mockups (1440 px and 390 px) with inline styles. They are a visual reference, not code to paste in: they use the canvas's own component runtime.

## Goals / Non-Goals

**Goals:**
- Match the boards' look at desktop (1280–1440) and phone (360–430) widths, and lay out sensibly in between.
- One stylesheet serving both themes, switched by a single attribute.

**Non-Goals:**
- The design's "Club wall" and "Poster" background variants, and its glass and blur tuning controls. Only the default "Close-up" art and the default glass values ship.
- Notifying visitors of accepted or declined requests. That is change 2; this change only shows Requested while pending.
- Any data, rules or security change.

## Decisions

### 1. Theme tokens as CSS custom properties, keyed by `data-theme` on `<html>`
The light and dark boards share identical markup, and their colors map one to one. The mapping was extracted by pairing the colors of both boards position by position: 751 colors, about 35 distinct pairs. These become role tokens: `--ink`, `--ink-2`, `--muted`, `--paper`, `--glass-rgb`, `--line`, `--brass`, `--teal`, `--brick`, `--accent`, `--bar-off` and so on.
- `:root` holds the light set. `:root[data-theme="dark"]` holds the dark set.
- A tiny inline script in `<head>` resolves the stored choice (`light`/`dark`/`auto`), plus `matchMedia('(prefers-color-scheme: dark)')` for auto, and sets `data-theme` before first paint. That prevents a flash of the wrong theme.
- A `change` listener on the media query updates the page live when the choice is auto.

*Alternative:* two stylesheets swapped at runtime. Rejected: flash risk, and double the maintenance.

### 2. Theme control: a 3-way segmented control in the header
It shows Light / Dark / Auto with sun, moon and half-circle icons, as real `<button aria-pressed>` elements. On phones it collapses to a single icon button that cycles through the three. The choice is stored in `localStorage['pr-theme']`, with every read and write wrapped in try/catch. Switching only flips the attribute; nothing re-renders, so open modals and typed input survive.

### 3. Background art as static files
*Changed after the owner's review:* the art is now pre-rendered from the design's SVGs to WebP images: 3 styles × light/dark desktop at 1800 px wide, and phone at 780 px. Phone-dark versions are centre crops of the dark art, because the design only drew light phone versions. Detailed vector art was slow to repaint while scrolling on phones. The WebP files are 70–500 KB, and only the active style/theme pair is downloaded. The art sits on the page's own background (`html`), so it **scrolls with the content**: `cover` on desktop so it spans the whole page, and on phones full width with a gradient fade into `--bg`. The fixed full-screen layer was dropped because it lagged behind fast scrolling on phones. Phones also drop `backdrop-filter` and use a more opaque glass tint instead. A `data-art` attribute (closeup/club/poster), set before first paint from `localStorage['pr-art']`, selects the image tokens.

### 4. Rendering stays string-template based, split per region
The existing render approach is kept, since it's proven and the handlers are already wired: `render()` builds `#app` from `renderNav()`, `renderHero()`, `renderSchedule()` and `renderRules()`. `renderSetlist()` emits the desktop grid (`188px repeat(3, 1fr)`) and, beside it, the phone day tabs and a single-day list. CSS shows one or the other at 900 px. Both come from one `cellParts()` helper, so every cell state is defined once. *Changed during build:* hiding grid columns with CSS couldn't give the phone design's merged card (code, name and state in one row), so the phone list is rendered separately. The selected phone day is kept in a module variable, and today is the default.

### 5. Visitor "Requested" state
`localStorage['pr-requests']` maps `cellKey` to a request id. It is written after a successful `applyToCell`. On render, a cell is Requested if the stored id is in that cell's `pending` ids. Stale entries (the id no longer pending, or the date no longer visible) are pruned on each snapshot. This needs no rules or data change.

### 6. Now playing
This is derived in render from today's cells and the clock. It shows the open, in-progress period with confirmed count, minutes left and elapsed percentage. Otherwise it shows the next open period today, labelled "Up next". It is re-rendered by the existing 30-second tick.

### 7. Admin Manage window
*Changed during build:* the Admin board draws Manage as a centred 660 px window, not a drawer, so it follows the board. It becomes a bottom sheet on phones. It keeps the existing `activeManage` refresh hook and `ensureDetails` loading. The supervisor `<select>` calls a new `setSupervisor(ds, pid, name)`, which is a `mutateCell` transaction that changes only `supervisor`. It reuses the "Me" display-name logic from `openPeriodModal`, factored into a shared helper.

### 8. Fonts
One Google Fonts `css2` link with `display=swap` loads Fraunces (opsz, 500/600, italic), Instrument Sans (400–700) and Bebas Neue, with `preconnect`. The stacks fall back to Georgia and system-ui so layout holds while the fonts load.

### 9. Responsiveness of admin actions
*Added after the owner's review:* `mutateCell` chains transactions per period, so back-to-back clicks don't collide and retry. The Manage window dims the affected row instantly. `render()` and the nav only write to the DOM when their markup actually changed.

## Risks / Trade-offs

- **[Backdrop blur cost on low-end phones]** → Blur is limited to the few large panels (nav, hero tag, tabs), not all 27 cells. Cells use the solid glass color with a subtle shadow. Blur is dropped under `prefers-reduced-transparency`.
- **[Contrast of glass over busy art]** → Glass opacity defaults are 0.74 for cells and 0.88 for strong panels, per the design. Text colors are checked against the flattened panel color in both themes during the build.
- **[Page weight]** → 12 WebP files, 2.7 MB total, but a visitor downloads only one: 70–200 KB on phones and 130–500 KB on desktop. The style picker's thumbnails load the phone images only when the menu is opened.
- **[localStorage "Requested" is per device]** → A visitor on another device won't see Requested. This is acceptable, and matches the proposal (change 2 adds lookup by code).

## Migration Plan

No data migration. Ship as a normal PR: check the Vercel preview in both themes at desktop and phone widths, then merge. Rollback is reverting the merge commit.
