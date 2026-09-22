# Design

## Context

`index.html` is one file: CSS tokens per `data-genre` / `data-theme`, and a render loop that rebuilds the nav and `#app` from template strings every 30 s, or whenever Firestore changes (see proposal.md, Why). The schedule is rendered twice today: as a desktop `.grid` (period rows × day columns) and as a phone `.day-tabs` + `.plist`, switched by a `max-width: 899px` media query. A single `cellParts(ds, period)` returns `{cls, body, action}` and is used by both. The booking code (`applyToCell`, `mutateCell`, modals and admin) must stay untouched. `alt.html` has a localhost-only `?demo` switch that fills `cells` with sample data. `index.html` doesn't.

## Goals / Non-Goals

**Goals:**
- One schedule markup that all three themes restyle with CSS, so each layout is a CSS block rather than a separate render path.
- Keep `cellParts` as the one source of each period's state. Only extend what it returns.
- Every new browser feature is an enhancement. Without it, the page still works and reads correctly.

**Non-Goals:**
- No change to modals beyond wording and the send check-mark, and no change to the admin sidebar or the theme picker menu.
- No new images. The photo backgrounds stay.
- No build step, framework or new JS dependency.

## Decisions

### 1. Replace the grid + phone list with one "day list" component
Render `days.map(dayList)`, where each day is a `<section class="day">` with a header, an optional `<details class="earlier">` fold, and a list of `.slot` rows. A `.day-tabs` bar is always rendered. CSS decides whether tabs are shown and the non-selected days hidden (the tabs layout), or all three days shown side by side (the columns layout). The wide layout uses `container-type: inline-size` on the schedule and `@container (min-width: 880px)`, scoped to Jazz and Rock. Classical always uses tabs (the programme is a single column, per spec).
- *Why:* the old grid depends on every day having the same rows. Folding finished periods only in today breaks that alignment, while independent columns handle it naturally. It also removes the duplicated desktop and phone markup.
- *Alternative:* keep the grid and add the fold only on phones. Rejected, because the fold would then behave differently by device and there would still be two render paths.
- `phoneDay` is renamed `activeDay` in meaning (same variable). It controls which day tabs mode shows.

### 2. Extend `cellParts` rather than re-deriving state
Add `reason` ('ended' | 'full' | 'notopen' | null), `n`, `bookable` (bool) and `now` (progress 0–100 or null) to its return value. The row template, the tab counts (`bookable` per day; for the admin, open periods) and the Rock stamp text all read from these. Reason order: ended first, then closed → "Not open yet", then full → "Full (10/10)". This matches the spec's rule that "Ended" wins regardless of status. Admin keeps its Open/Manage action but also shows the reason text.

### 3. One slot row, three looks
Row markup: `.slot[data-state]` > `.slot-name` (name, plus a small-caps Roman label in Classical via a `data-roman` attribute that the CSS swaps in with `content`), `.slot-lead` (dotted leader, visible only in Jazz), `.slot-time`, `.slot-status` (text reason, seat dots, own-request state), and `.slot-action`.
- **Jazz:** grid row with a flexible dotted leader (`border-bottom: 2px dotted`); `.slot-time` in `--numeral` at about 28px. The spotlight is a `radial-gradient` on `.slot.is-now` in brass/amber. Glass (`backdrop-filter`) is kept only for `:root[data-genre="jazz"]` surfaces.
- **Classical:** `.schedule` gets `max-width: 680px; margin-inline: auto`, and rows are separated by `border-bottom: 3px double`. `font-variant: small-caps` for names, italic `--display` for times with `text-align: end`, `border-radius: 0` everywhere. Tabs are joined by a `::before` "·" ornament (a fleuron, ❦, between groups is optional).
- **Rock:** `--r-*: 0`, `border: 2.5px solid`, and a solid `--surface` instead of `rgba` glass. `.schedule` gets `transform: rotate(-0.5deg)` only in the columns layout and when motion is allowed, so text isn't rotated on phones. The stamp is `.slot-status .stamp` with `clip-path` jagged ends, rotated a few degrees, in uppercase Anton. The ticket stub is `.btn.apply` with a `radial-gradient` mask making perforation notches down its left edge.
- *Alternative:* separate render templates per theme. Rejected, because it would triple the markup and risk behaviour drifting apart.

### 4. Tokens move to `oklch()`
Rewrite the colour tokens in `oklch()`. Classical and Rock keep their current colours (converted), and Jazz gets new values: oxblood surfaces around `oklch(0.28 0.08 20)` in Dark and a warm cream with oxblood ink in Light, with brass `oklch(0.74 0.12 80)` as the accent. Translucent variants use `oklch(from var(--x) l c h / a)` only where a fallback is supplied first. For the existing `--glass-rgb` tuples, Jazz keeps an rgb triple because glass stays there. Contrast is checked by computing it in the browser, per task.

### 5. Fonts
`GENRE_FONTS` becomes: Jazz = Bebas Neue + Fraunces + DM Sans; Classical = Cinzel + Cormorant Garamond + EB Garamond; Rock = Anton + Oswald + Archivo. `--body` changes per theme. The existing per-theme lazy loader stays as it is.

### 6. Wordmark
`.brand` becomes `<span class="wordmark">KCM Rooms</span>` in `--h1-font`, with no `.brand-mark` tile. The "KCM room schedule" subline is dropped.

### 7. Motion
- `withTransition(fn)`: calls `document.startViewTransition(fn)` when it exists, `prefers-reduced-motion` isn't set and the tab is visible, and plain `fn()` otherwise. The rejections from a skipped transition are caught. It is used in `setGenre`, `setTheme` and the day tab click. The render loop's 30 s refresh never uses it.
- Row fade-in: `@supports (animation-timeline: view())` wraps `.slot { animation: rowIn linear both; animation-timeline: view(); animation-range: entry 0% entry 60%; }`. The keyframes go from opacity 0.001 to 1, so rows that are already in view on load are shown fully.
- Sticky header: `nav.top { position: sticky; top: 0 }`, which gains a solid bar in the page colour as it shrinks. The shrink uses `animation-timeline: scroll()` over the first 120px. Stickiness lives inside the same `@supports` and no-preference block, because a transparent header can't stick over content without the animated bar; without support it scrolls away as it does today. On phones the header wraps to two rows, so the wordmark row folds away as you scroll, leaving one row of buttons.
- Press feedback: `.btn:active { transform: scale(.96) }` already exists. Add a 120 ms ease. The send check-mark comes after `applyToCell` resolves true: swap the button's content to `icon('check')` with a `pop` keyframe, then wait about 450 ms before `close()`.
- Everything is under `@media (prefers-reduced-motion: no-preference)`. The existing reduced-motion reset remains as a backstop.

### 8. Fold state survives re-render
`render()` replaces `#app.innerHTML` every tick, so the `<details>` open state would reset. Keep `let earlierOpen = false`, set it from the `toggle` event, and render `open` from it.

### 9. Copy lives in `GENRE_COPY` and `HOUSE_RULES`
Replace `h1a`/`h1b` with one `h1` per theme, and remove the `<br><em>` markup. Replace the `HOUSE_RULES` strings, and use `nums` for Classical as `I, II, III` and `1, 2, 3` for the others (instead of 01–03). `#discOk` gets its new label.

### 10. Local demo data
Port `alt.html`'s `DEMO` block: localhost only, `?demo`, applied in `subscribeCells`. Adjust it so the plan covers every state (full, not open, ended, running now and requested) for verification. `&time=HH:MM` (demo only) pretends it is that time today, and demo requests stay in the page instead of reaching Firestore. It's inert on the live domain because of the hostname check.

### 11. Per-theme Light/Dark
Port `alt.html`'s `themeKey(genre)` and `resolveTheme(genre)`. Jazz keeps the existing `pr-theme` key, so current visitors keep their choice; Classical and Rock use `pr-theme-classical` and `pr-theme-rock`. The look is resolved in the pre-paint script and again in `setGenre`, and the CSS rule that hides `.theme-seg` outside Jazz is removed. Classical Dark and Rock Light start from the `alt.html` palettes, with tokens written in oklch.

## Risks / Trade-offs

- [The columns layout makes rows on different days misalign] → Each day header shows the date clearly, and times are on every row. This is accepted in exchange for the fold.
- [`oklch()` isn't supported in older Safari (before 15.4)] → Define each token first as a hex fallback declaration, then the `oklch()` value, so old browsers ignore the second one.
- [The Rock tilt could make text look blurry] → The tilt applies only to the card container on wide screens, and only by 0.5°. Rows inside can counter-rotate if screenshots show blur.
- [The sticky header covers the `#rules` anchor target] → Add `scroll-margin-top` to the rules section, matching the compact header height.
- [Re-rendering every 30 s restarts the scroll-driven fades] → Scroll-driven animations are tied to scroll position, not time, so re-inserted rows that are in view resolve straight to their end state. This will be checked during verification.
- [A large single-file diff on the live site] → The work goes on a feature branch and a PR, like earlier changes. It is checked with `?demo` in all 6 looks (each theme in Light and Dark) at 375px and 1280px, and in admin view on the emulator, before merge.

## Migration Plan

Branch `theme-layouts-and-copy` → implement → verify locally with `?demo` and the emulators → PR → merge deploys to Vercel. Rollback is reverting the merge commit. There is no data migration, and localStorage keys (`pr-genre`, `pr-theme`, `pr-rules-seen`, `pr-requests`) are unchanged.

## Open Questions

- Whether Classical should get a small fleuron (❦) instead of "·" between day names. This is a visual detail to settle from screenshots during the Classical task.
