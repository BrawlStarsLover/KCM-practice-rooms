# Proposal

## Why

The owner added two new themes, **Classical** and **Rock**, to the Claude Design canvas, and moved Jazz to photo backgrounds. They want visitors to choose between Jazz, Classical and Rock instead of the three illustrated background styles (Close-up, Club wall, Poster).

## What Changes

- **Theme picker:** the background-style picker is replaced by a "Theme" picker offering **Jazz**, **Classical** and **Rock**, with thumbnails. The choice is remembered per browser and applied before first paint.
- **Each theme restyles the whole page** from its design board:
  - Jazz: Fraunces, Bebas Neue and Instrument Sans in gold, ink and teal.
  - Classical: Cormorant Garamond, Cinzel and Instrument Sans in wine, cream and gold.
  - Rock: Anton, Oswald and Space Grotesk in black, red and yellow.
  - Each has its own photo background, and its own wording: headline, "Now playing", setlist name, the rules title and numerals (Classical uses I–III).
- **Jazz moves to photos:** its illustrated backgrounds are replaced by the design's photo composition. Light ("Matinee") and Dark ("Late set") both stay, and only Jazz shows the Light/Dark switch, since Classical and Rock were each designed in one version.
- **Fonts load per theme**, so a visitor only downloads the typefaces of the theme they use.
- **BREAKING (visual only):** the Close-up, Club wall and Poster backgrounds are removed. Their saved choice is ignored and those visitors see Jazz.

## Capabilities

### New Capabilities
- `music-themes`: Choosing between the Jazz, Classical and Rock themes, and what each theme changes.

### Modified Capabilities
<!-- The theme/background-style requirements live in jazz-redesign-theme-toggle, which isn't archived yet; they'll be reconciled at archive time. -->

## Impact

- `index.html`: theme token sets, font loading, the Theme picker, per-theme wording.
- `img/`: 12 illustration WebPs replaced by 6 photo-composite WebPs (20–85 KB each), pre-rendered from the design with headless Chrome.
- No data, rules or security changes.
