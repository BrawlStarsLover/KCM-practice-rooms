# Design

## Context

The page already styles everything through CSS custom properties, with Jazz light on `:root` and Jazz dark on `[data-theme="dark"]` (see `jazz-redesign-theme-toggle`). The new Classical and Rock boards have the same markup as the Jazz boards, with 744 identical colour slots, so their colours were extracted by pairing the boards slot by slot.

## Decisions

1. **`data-genre` on `<html>` with full token sets.** `:root[data-genre="classical"]` and `[data-genre="rock"]` come after the Jazz rules and redefine every token, including fonts and headline metrics (`--h1-*`). The new role tokens needed by the photo backgrounds are `--on-bg*`, `--hero-accent`, `--mark-*`, `--today-*`, `--tag-*`, `--np-*`, `--rules-*` and `--toast-icon`.
2. **Backgrounds pre-rendered.** Each board's background layer (three masked, filtered photos plus glows) was rendered to a single image with headless Chrome, using an isolated throwaway profile: desktop 1440×1560 at 1.25×, phone 390×844 at 2×, as WebP. This gives exact fidelity with zero runtime masks or filters, which keeps phone scrolling smooth, and each file is under 90 KB.
3. **Fonts per theme.** A tiny head script injects the Google Fonts link for the active theme only, and the picker injects another theme's link on demand.
4. **Wording.** The `GENRE_COPY` table in the script drives the headline, strip label, setlist title, rules eyebrow, title and numerals, and the page re-renders on theme change.
5. **Light/Dark scoped to Jazz** via CSS (`:root:not([data-genre="jazz"]) .theme-seg`). The stored Light/Dark choice is kept, so returning to Jazz restores it.

## Risks / Trade-offs

- **[Contrast on photos]** The Jazz light panels are now over a dark photo, so glass was raised from 0.84 to 0.92. Rock's small rules eyebrow uses white instead of black on red. After these changes, 1,864 text checks pass.
- **[Photo credits]** Per the design's artwork board, the Jazz photos are free Unsplash photos (guitar by Thomas Kelley, trumpet by Miguel Alcântara, cymbal by K Atkinson). The Unsplash licence doesn't require credit. Classical and Rock photo sources aren't listed on the board.
