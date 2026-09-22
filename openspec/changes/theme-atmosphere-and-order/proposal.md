# Proposal

## Why

After `theme-layouts-and-copy` went live, the owner found four things that still read as unfinished and one bug. The photo backgrounds are loud and untreated, so they compete with the schedule instead of setting a mood. The Rock rule numbers float above their text. The theme button turns into an empty box while its menu is open. And the three themes still run the page in the same order, so the layouts differ but the shape of the page doesn't.

## What Changes

- **Quieter, treated backgrounds.** Each theme keeps its single photo, cropped in harder, tinted towards the theme's own colour (a duotone) and given a fine grain. The result sits behind the page as atmosphere rather than a photograph.
- **Rock rules line up.** The big 1/2/3 sit on the first line of their rule text instead of floating above it. Jazz and Classical are checked for the same fault.
- **Fix the theme button while its menu is open.** On phones the button currently keeps the header's own background and flips its icon to the light colour, so it reads as an empty white box with no icon. Its open state keeps the dark fill and light icon it has on desktop.
- **Motion that works in every browser.** The row fade-in currently needs scroll-driven animation, which Safari doesn't have, so iPhone visitors see none of it. Rows fade in there too, through a fallback that doesn't change what Chrome already does. (View Transitions for theme, light/dark and day switching already work and don't change.)
- **A different section order per theme.** Rock puts the house rules above the schedule, like a poster's small print at the top. Classical moves the date line ("Tue Sep 22 – Thu Sep 24") to the foot of the page, the way a printed programme dates itself at the end. Jazz keeps today's order.
- **Not changed:** booking, requests, admin actions, Firestore data and rules, the 9 periods, the 3-weekday window, the wording, the schedule's contents, and the per-theme layouts themselves.

## Capabilities

### New Capabilities
- `theme-atmosphere`: How each theme's photo is treated (crop, duotone, grain) and how strong it may be behind the page.

### Modified Capabilities
- `theme-layouts`: Adds the per-theme section order, and fixes the theme button's open state and the rule-number alignment.
- `page-motion`: The row fade-in must also work in browsers without scroll-driven animation.

## Impact

- `index.html` only: CSS for the background treatment, the rules list, the header button and the section order; a small render change to move the date line in Classical; and a scroll fallback for the row fade.
- No new image files. The existing photos are reused and treated with CSS.
- No data, Firestore rules or Firebase changes.
