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
