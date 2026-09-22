# Tasks

## 1. Fixes

- [x] 1.1 Scope the theme button's open state to the nav so the phone rule can't clear its fill; verify at 375px in all six looks that the open button keeps a filled background with its symbol visible at 3:1 or better
- [x] 1.2 Size the rule numbers to their text and line them up on the first line; verify in all three themes that each number's top is no higher than its first text line

## 2. Background treatment

- [x] 2.1 Add the fixed tint and grain layers behind the page with per-theme duotone colours; verify they don't catch clicks and that every theme's photo reads as its own colour
- [x] 2.2 Crop each photo in per theme (`--art-size`, `--art-pos`), keeping the phone gradient fade lined up; verify by screenshots at 375px and 1280px in all three themes
- [x] 2.3 Re-measure contrast in all six looks, including the headline over the photo on phones; verify nothing drops below 4.5:1 (3:1 for large text)

## 3. Section order

- [x] 3.1 Make `#app` a flex column and give Rock the rules above the schedule; verify the order in Rock and that Jazz and Classical are unchanged
- [x] 3.2 Move the Classical date line to a footer below the rules and out of the hero; verify it appears exactly once in every theme, and reads correctly in the accessibility tree

## 4. Motion fallback

- [x] 4.1 Add the `@supports not (animation-timeline: view())` starting state and the IntersectionObserver that reveals rows, re-attached on each render; verify with scroll timelines stubbed out that rows start hidden, fade in on scroll, and end visible
- [x] 4.2 Confirm the fallback is off under reduced motion and when scroll timelines exist; verify rows are never left hidden in either case

## 5. Owner's follow-ups

- [x] 5.1 Centre Rock's rule text against the middle of its number; verify in Rock that each rule's text middle matches its number's middle, and that Jazz and Classical still sit on the first line
- [x] 5.2 Change the first house rule to "The entrance door locks 5 min after the period starts."; verify it reads that way on the page and in the pop-up in all three themes

## 6. Ship

- [x] 6.1 Full pass with `?demo`: all six looks at 375px and 1280px, the theme menu, the day tabs and a request; verify no console errors
- [ ] 6.2 Open a PR and merge after the checks pass; verify the live site shows the treated background and the new order
