# Tasks

## 1. Assets and theme foundation

- [x] 1.1 Copy the three background SVGs from the design into `img/bg-light.svg`, `img/bg-dark.svg` and `img/bg-phone.svg`; verify each has no `<script>`, event handlers or external `href`, and loads at `http://localhost:5173/img/...`
- [x] 1.2 Replace the `<style>` block with token-based CSS: light tokens on `:root` and dark tokens on `:root[data-theme="dark"]` from the extracted color mapping; swap the fonts link to Fraunces, Instrument Sans and Bebas Neue; verify `grep -iE '#4338ca|#8b85f4|indigo|Space Grotesk'` finds nothing
- [x] 1.3 Add the pre-paint theme script in `<head>` and the header Light/Dark/Auto control (single cycling button under 900 px), with try/catch storage and a live media-query listener; verify that switching keeps an open Apply form's typed text, that reload keeps the choice, and that Auto follows an emulated `prefers-color-scheme` change

## 2. Visitor layout

- [x] 2.1 Rebuild the nav (brand, visitor/admin status, Room rules, Become a supervisor, theme control) and remove the FAB; verify against Main.dc.html at 1440 px in both themes
- [x] 2.2 Hero: date-range tag, headline, intro line, and the Now playing / Up next strip driven by today's cells and the clock; verify with a faked clock at 10:43 and an open Period 2 holding 8 confirmed (expect "37 min left")
- [x] 2.3 Setlist grid: period rows, day headers with a Today tag, the legend, and the Closed, Ended, Full, Open (10-segment bar, count and supervisor, Apply) and Requested cell states; verify every state renders in the emulator at 1280 px with no horizontal scroll
- [x] 2.4 Phone layout under 900 px: day tabs with the selected state and a single-day list using the phone background; verify at 390 px and 360 px (no horizontal scroll, targets at least 44 px, tab switching works)
- [x] 2.5 House-rules strip, Room rules scroll target, and the first-visit-only rules pop-up (`pr-rules-seen`); verify the pop-up shows once, then not after a reload
- [x] 2.6 Restyle the Apply window (with the privacy note), the supervisor application, admin sign-in, rename and toast in the new style; verify each opens, validates and submits against the emulator in both themes

## 3. Own requests

- [x] 3.1 Store `cellKey → requestId` in `localStorage['pr-requests']` after a successful apply, show Requested while the id is pending, and prune stale entries on each snapshot; verify: apply, reload (still Requested), check another browser context sees Open, then admin accepts and the visitor's cell leaves Requested within a few seconds

## 4. Admin workspace

- [x] 4.1 Admin header counters and compact admin cells (N/10 in, pending, supervisor, Manage/Open, Full, Ended), plus the Admin panel badge; verify the counts against seeded emulator data
- [x] 4.2 Manage side panel (drawer; full-screen on phone) keeping the live refresh and details loading, with the waiting list, the in-the-room list, and the "accepting one fills the room" warning; verify accept, decline, remove, close and live arrival in the emulator
- [x] 4.3 Supervisor selector in the panel using a new `setSupervisor` transaction and the shared "Me" name helper; verify the visitor view updates and that the pending, confirmed and declinedIds lists are unchanged
- [x] 4.4 Restyle the admin sidebar (statistics, supervisor applications, approved supervisors) with the tokens; verify it in both themes

## 6. Follow-ups from the owner's review

- [x] 6.1 Pre-render all 9 design SVGs to WebP, add phone-dark centre crops, and replace `img/bg-*.svg`; verify every file is served with `image/webp` and the total a visitor downloads is under 500 KB
- [x] 6.2 Make the background scroll with the page (desktop `cover` over the full page; phone full width plus a fade) and drop `backdrop-filter` on phones; verify there is no plain band at the bottom at 1280 px and that 0 elements use a backdrop blur at 390 px
- [x] 6.3 Add the background style picker (Close-up / Club wall / Poster) with thumbnails, `pr-art` persistence and pre-paint `data-art`; verify picking Poster, switching to dark and reloading keeps poster-dark, and that the menu closes with Escape or an outside click and returns focus
- [x] 6.4 Fix the pre-paint theme read (the stored JSON value was compared raw), queue admin transactions per period, dim rows instantly, and skip unchanged DOM writes; verify two back-to-back removals both apply (about 250 ms locally) with instant feedback

## 5. Quality and ship

- [x] 5.1 Accessibility pass: keyboard through the nav, grid, drawer and modals with visible focus; `aria-label` on icon buttons; contrast of body and caption text against glass in both themes of at least 4.5:1 (spot-check with computed colors); no console errors
- [ ] 5.2 Re-run the rules tests (`tests/rules/emulate.sh`) to confirm nothing regressed, commit, push, open a PR, and verify the Vercel preview in both themes at desktop and phone widths
- [ ] 5.3 With the user's go-ahead, merge, and verify the live site loads with no console errors in both themes
