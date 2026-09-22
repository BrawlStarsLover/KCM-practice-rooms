# Tasks

## 1. Setup

- [x] 1.1 Create branch `theme-layouts-and-copy` from `main` in the repo; verify `git status` shows the new branch and a clean `index.html`
- [x] 1.2 Port the localhost-only `?demo` sample data from `alt.html` into `index.html`, covering these states: full, not open, ended, running now, requested, in; verify `http://localhost:5173/?demo` shows every state and that the demo code is skipped when the hostname isn't localhost

## 2. Shared schedule structure

- [x] 2.1 Extend `cellParts` with `reason`, `n`, `bookable` and `now` (progress), using the order ended → not open → full; verify with `?demo` that each sample period shows the correct reason
- [x] 2.2 Replace the desktop grid and the phone list with one day-list render (`.day` sections, `.slot` rows, always-rendered `.day-tabs`), keeping the Apply, Open and Manage buttons wired through `attachHandlers`; verify with `?demo` and the emulator admin login that Apply, Open and Manage still open the right pop-up for the right day and period
- [x] 2.3 Add the 10-dot seat meter with the screen-reader text "N of 10 places taken", replacing the text count; verify in the accessibility tree (read_page) on a 6-person demo period
- [x] 2.4 Add the "Earlier today (N)" fold for today's finished periods, keeping its open state across re-renders; verify that it shows the right N, expands and collapses, and stays open after a forced `render()`
- [x] 2.5 Highlight the current period with a progress bar; verify with a demo period that is running now that the bar width matches the share of time passed
- [x] 2.6 Add open counts to the day tabs ("Wed · 3 open" / "none open"; open periods for the admin); verify the counts against the demo data by hand
- [x] 2.7 Add the container query for the columns layout (three days side by side when the schedule is at least 880px wide, otherwise tabs); verify that 1280px shows columns and 375px shows tabs

## 3. Copy and fonts

- [x] 3.1 Replace the headlines with one line per theme, the `HOUSE_RULES` wording, the rule numbering (I–III in Classical, 1–3 elsewhere) and the "OK, show me the rooms" button; verify the text in all three themes and in the rules pop-up (clear `pr-rules-seen` to see it)
- [x] 3.2 Update `GENRE_FONTS` and `--body` per theme (DM Sans, EB Garamond, Archivo); verify in the network log that only the active theme's families load, and that computed `font-family` on body text matches
- [x] 3.3 Replace the brand tile with the "KCM Rooms" wordmark in each theme's heading face; verify it in all themes at 375px and 1280px

- [x] 3.4 Add per-theme Light/Dark (own storage key per theme, defaults Jazz = device, Classical = Light, Rock = Dark, switch shown in all themes); verify the "Choices are per theme" scenario by hand and that a saved `pr-theme` still applies to Jazz

## 4. Jazz (checkpoint: show the owner before continuing)

- [x] 4.1 Move the Jazz tokens to oklch, with hex fallbacks, in an oxblood and brass palette for Light and Dark; verify 4.5:1 contrast on body text and 3:1 on large text in both looks, computed in the browser
- [x] 4.2 Build the Jazz setlist rows (no boxes, dotted leader, large Bebas times, spotlight only on the current period), keeping glass for Jazz only; verify by screenshots in Light and Dark at 375px and 1280px
- [x] 4.3 Share the Jazz screenshots with the owner and confirm the direction before starting groups 5 and 6 (owner asked to apply the whole spec in one go; screenshots of every theme are shared at the end instead)

## 5. Classical

- [x] 5.1 Build the Classical programme: a centred narrow column at every width, double rules between periods, small-caps Roman period labels, right-aligned italic times, no radius anywhere, and "Tuesday · Wednesday · Thursday" tabs; verify by screenshots in Light and Dark at 375px and 1280px, and check that no element in the schedule has a non-zero `border-radius`
- [x] 5.2 Convert the Classical tokens to oklch without changing the Light colours, add Classical Dark (wine and gold), and remove glass; verify contrast in both looks and that no `backdrop-filter` is computed in Classical

## 6. Rock

- [x] 6.1 Build the Rock poster: solid surfaces, square corners, 2–3px outlines, a -0.5° tilt in the columns layout only, torn-tape stamps with the reason in capitals ("SOLD OUT" / "ENDED" / "NOT OPEN YET") and a ticket-stub Apply button with perforations; verify by screenshots in Light and Dark at 375px and 1280px, and check that no `backdrop-filter` is computed in Rock
- [x] 6.2 Convert the Rock tokens to oklch without changing the Dark colours, and add Rock Light (white surfaces, red for actions); verify contrast in both looks, including text on the stamps

## 7. Motion

- [x] 7.1 Add `withTransition` and use it for theme, Light/Dark and day switching; verify in Chrome that `document.startViewTransition` is called, and that with it stubbed out the switch still works
- [x] 7.2 Add the scroll-driven row fade-in and the sticky shrinking header under `@supports`, plus `scroll-margin-top` on `#rules`; verify that the header is compact after scrolling 200px, the Room rules link lands with its heading visible, and rows are fully opaque when not scrolling
- [x] 7.3 Add the button press animation and the check-mark on a successful send; verify on the emulator (`?emulator`) that sending a request shows the check-mark and then the period shows as requested
- [x] 7.4 Gate all motion behind reduced motion; verify, with reduced motion emulated, that theme switching and scrolling have no animation

## 8. Final check and ship

- [x] 8.1 Run a full pass on the emulator, as a visitor and as the admin, in all six looks at 375px and 1280px: apply, request state, accept, decline, open and close a period, and check the console for errors; verify there are no console errors and every action still works
- [x] 8.2 Run the Firestore rules tests (`tests/rules`) to confirm nothing in the data path changed; verify they pass
- [ ] 8.3 Open a PR with screenshots of each theme; verify the Vercel preview deployment renders
