# Proposal

## Why

The three music themes on the live site (`index.html`) share one layout: the same rounded glass cards, recoloured and given new fonts. With the stock wording ("Find your groove, take the stage.", "Got it"), the page reads as generated rather than designed. The schedule also hides useful facts: closed periods don't say why, finished periods take up the top of the list, and the day tabs show nothing but a date. This change gives each theme its own layout, rewrites the copy in plain language, and makes the schedule show real information. The booking logic doesn't change.

## What Changes

- **A different layout for each theme, not just new colours:**
  - **Jazz, a club flyer or setlist.** Each period is a plain row with a dotted leader running to its time, which is set in large Bebas numerals. Rows have no boxes. Only the current period gets a warm spotlight. Jazz is the only theme that keeps frosted glass.
  - **Classical, a printed concert programme.** A centred narrow column with thin double rules between items, small-caps "Period I, Period II…", italic Cormorant times aligned right, and no cards or rounded corners. The day tabs read "Tuesday · Wednesday · Thursday", with a small ornament between them.
  - **Rock, a gig poster or backstage pass.** Square corners, no glass, and thick 2–3px outlines. The schedule card is tilted about -0.5°. Unavailable periods get a torn-tape stamp such as "SOLD OUT", and the Apply button is a ticket stub with a perforated edge.
- **Plain, specific copy:**
  - Each theme gets its own one-line headline, replacing the two-line slogans: Jazz "Rooms open this week", Classical "Book a practice room", Rock "GET IN THE ROOM".
  - The house rules are rewritten as a plain numbered list:
    1. Doors lock 5 min after the period starts.
    2. First requests get the rooms.
    3. Everyone inside has to be playing, singing or writing.
  - The rules pop-up button changes from "Got it" to "OK, show me the rooms".
  - An unavailable period says why: "Not open yet", "Full (10/10)" or "Ended", instead of a bare "Closed".
- **The schedule shows real information:**
  - The period running now is highlighted, with a thin bar showing how far through it we are.
  - Finished periods today fold into one "Earlier today (N)" line that can be expanded, so what's still to come sits at the top.
  - Each period shows a meter of 10 dots for its seats, instead of a text count.
  - Day tabs show how many periods can still be booked, e.g. "Wed · 3 open".
- **A different body font per theme:** DM Sans for Jazz, EB Garamond for Classical, Archivo for Rock. Onest, Instrument Sans and Space Grotesk are no longer used for body text.
- **Newer browser features, used as progressive enhancement:** View Transitions when switching theme, light/dark or day; scroll-driven fade-in for rows; a sticky header that shrinks as you scroll; colours defined in `oklch()`; a container query that lays Jazz and Rock out as Tue/Wed/Thu side by side on wide screens; a press animation on buttons and a quick check-mark when a request is sent. Browsers without these features get the page as it looks now, without the effects.
- **Less of the generic AI look:** Jazz moves from navy and gold to **oxblood and brass**, in both Light and Dark. The icon in a rounded tile becomes a "KCM Rooms" wordmark set in the theme's heading font. Spacing and corner radius vary by theme instead of being identical everywhere.
- **Light and Dark for every theme:** the Light/Dark switch shows in Classical and Rock too, and each theme remembers its own choice. With no saved choice, Jazz follows the device, Classical starts Light and Rock starts Dark. Classical Dark uses deep wine surfaces with gold; Rock Light uses white surfaces and keeps red for actions. Each layout keeps its identity in both looks.
- **Local demo data for checking the design:** as in `alt.html`, `localhost/?demo` shows sample bookings. It never runs on the live domain.
- **Not changed:** booking, requests, admin actions, Firestore data and rules, the 9 fixed periods, the 3-weekday window, the theme picker, the photo backgrounds, and `alt.html`.

## Capabilities

### New Capabilities
- `theme-layouts`: Each theme's own layout and surfaces (setlist, programme, poster): typefaces, palette, where glass is allowed, the wordmark, and the layout on wide screens.
- `schedule-display`: What each period shows: the reason it's unavailable, the seat-dot meter, the highlight and progress bar on the current period, today's folded finished periods, and the open count on each day tab.
- `site-copy`: Headlines, house rules and button wording.
- `page-motion`: View Transitions, scroll-driven effects, the shrinking header and button feedback, and how each falls back when the browser doesn't support it or the visitor has asked for reduced motion.

### Modified Capabilities
<!-- None in openspec/specs yet. Note: the unarchived genre-themes change's `music-themes` spec lists the old headlines and rule wording; this change supersedes those two rows of its table, its body-font choices, and its "Light and Dark only for Jazz" requirement. -->

## Impact

- `index.html` only: CSS (theme tokens, one layout block per theme, motion), the render functions for the hero, schedule, cells, day tabs, rules and nav brand, and the Google Fonts list per theme.
- New font families are loaded per theme, still only for the active theme: DM Sans, EB Garamond and Archivo.
- No data, Firestore rules or Firebase changes, and nothing to redeploy to Firebase. The site goes live on Vercel once the PR is merged.
