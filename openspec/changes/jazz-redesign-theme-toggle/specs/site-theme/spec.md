# Spec Delta

## Purpose

Lets every visitor choose how the Practice Room Schedule looks (light "Matinee", dark "Late set", or following their device) and keeps both themes visually consistent.

## ADDED Requirements

### Requirement: Theme choice
The page SHALL offer a theme control in the header with three options: Light, Dark and Auto. Auto SHALL follow the device's light/dark setting and SHALL be the default for a first visit. Changing the option SHALL restyle the page immediately without a reload and without losing open windows or typed input.

#### Scenario: Switch to dark
- **WHEN** a visitor on a light-mode device selects Dark
- **THEN** the page immediately shows the dark "Late set" colors and background art

#### Scenario: Auto follows the device
- **WHEN** the theme is Auto and the device switches from light to dark mode
- **THEN** the page switches to the dark theme without a reload

#### Scenario: Apply form survives a theme change
- **WHEN** a visitor has typed their name in the Apply window and changes the theme
- **THEN** the window stays open with the typed name intact

### Requirement: Theme is remembered per browser
The chosen theme SHALL be remembered in that browser across visits, and the page SHALL render in the remembered theme from first paint, with no flash of the other theme. If the browser blocks storage, the page SHALL still work, falling back to Auto.

#### Scenario: Returning visitor
- **WHEN** a visitor who chose Dark reloads the page
- **THEN** it opens directly in the dark theme

#### Scenario: Storage blocked
- **WHEN** the browser refuses site storage
- **THEN** the page loads in Auto with no errors

### Requirement: Shared visual system
Both themes SHALL use the design's type (Fraunces display, Instrument Sans body, Bebas Neue numerals and day names), the same layout and spacing, frosted panels over the illustrated jazz-instrument background, and the design's status colors (open teal, requested brass, full brick, closed dashed, ended muted). The page SHALL contain no purple accents and no emoji. Text SHALL meet 4.5:1 contrast against its panel in both themes, and every interactive element SHALL be a real button, link or form field that is reachable by keyboard and has a visible focus ring.

#### Scenario: Keyboard use
- **WHEN** a visitor tabs through the page
- **THEN** every button and link receives a visible focus outline in the current theme's accent color

### Requirement: Background style choice
Next to the theme control, the page SHALL offer a background style picker with the design's three illustrations: Close-up (default), Club wall and Poster, each shown with a thumbnail. The choice SHALL apply immediately in both themes, be remembered per browser the same way as the theme, and be applied before first paint.

#### Scenario: Pick Poster
- **WHEN** a visitor opens the style picker and chooses Poster
- **THEN** the background immediately changes to the Poster illustration, and after a reload it is still Poster in whichever theme is active

### Requirement: Background scrolls with the page
The background illustration SHALL scroll together with the page content (not stay fixed to the screen). On screens 900 px and wider it SHALL cover the full length of the page. On phones it SHALL span the full width of the first screen and fade into the page color below it. Scrolling on phones SHALL NOT be slowed by blur effects: frosted panels on phones use a solid tint instead of a live blur.

#### Scenario: Long desktop page
- **WHEN** the page is scrolled to the bottom at 1280 px wide
- **THEN** the illustration is still visible behind the house rules and no plain band shows below it
