# Proposal

## Why

The owner commissioned a redesign in Claude Design (canvas "Practice Rooms Redesign": light "Matinee", dark "Late set", admin, phone). The current page still has the generic indigo/purple look they asked to replace. They also want visitors to be able to switch between the light and dark themes on the live site, instead of being locked to their device setting.

## What Changes

- **Visual rebuild of `index.html`** to match the design:
  - fonts: Fraunces (display), Instrument Sans (body), Bebas Neue (numerals and day names)
  - a warm cream/ink palette with brass, teal and brick accents; no purple, no emojis
  - frosted-glass panels over an illustrated jazz-instrument background
  - the design's pills, "fill bars" and buttons
- **Theme switch**: a control in the header to choose Light, Dark or Auto (follow the device). The choice is remembered in that browser. Auto is the default.
- **Background style picker** (added after review): Close-up, Club wall or Poster, remembered like the theme. The background now scrolls with the page.
- **New schedule layout**:
  - Desktop: a setlist table, with the fixed periods as rows and the 3 weekdays as columns, plus a status legend.
  - Phones: day tabs with a single-day list.
- **Hero area**: a date-range tag, the headline "Pick a period, take the stage.", and a **Now playing** strip. The strip shows the period happening right now, how many people are in it, and the minutes left.
- **House rules** move from a pop-up on every visit to a strip at the bottom of the page. A **Room rules** button scrolls to it. The pop-up still appears once per browser for first-time visitors.
- **Become a supervisor** becomes a header button; the floating "?" button goes away.
- **"Requested" state**: after a visitor applies, that slot shows "Requested · Awaiting confirmation" on their device until the admin acts. It is remembered in the browser only; nothing new is stored in the database.
- **Admin view**:
  - header counters: requests waiting, and periods open out of 27
  - compact slot cells ("8/10 in", "2 pending")
  - the Manage window becomes a side panel that includes a **supervisor switch** for the period
  - the admin panel (statistics, supervisor applications) is restyled to match

## Capabilities

### New Capabilities
- `site-theme`: Light/dark/auto theme selection, persistence, and the visual system both themes share.
- `schedule-presentation`: How the schedule, slot states, now-playing strip, house rules and the visitor's own requested slots are shown on desktop and phone.
- `admin-workspace`: How the admin sees counters, compact slot cells and the Manage side panel, including changing a period's supervisor.

### Modified Capabilities
<!-- None: fix-bugs-and-harden-rules is not archived yet, so there are no main specs to modify. Its behavior is kept unchanged. -->

## Impact

- `index.html`: styles rewritten, render functions restructured. The data layer, transactions, rules and listeners from `fix-bugs-and-harden-rules` stay as they are.
- New static files: `img/bg-light.svg`, `img/bg-dark.svg`, `img/bg-phone.svg` (from the design, about 650 KB total, cached by Vercel).
- Google Fonts request changes from Space Grotesk/Inter to Fraunces, Instrument Sans and Bebas Neue.
- No Firestore rules or data changes. Changing the supervisor is an admin write that the current rules already allow.
- Depends on `fix-bugs-and-harden-rules` being live (it is merged and deployed; archive pending the owner's smoke test).
