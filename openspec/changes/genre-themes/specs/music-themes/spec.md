# Spec Delta

## Purpose

Lets each visitor pick the look of the site from three music themes (Jazz, Classical and Rock) designed in the Claude Design canvas.

## ADDED Requirements

### Requirement: Theme picker
The header SHALL offer a Theme picker listing **Jazz**, **Classical** and **Rock** by name, each with a thumbnail, with the current one marked. Choosing one SHALL restyle the page immediately, be remembered in that browser, and be applied before first paint on later visits. Jazz SHALL be the default.

#### Scenario: Pick Rock
- **WHEN** a visitor opens the Theme picker and chooses Rock
- **THEN** the page immediately uses the Rock colours, fonts, wording and background, and after a reload it opens in Rock

### Requirement: Each theme restyles the page
Each theme SHALL apply its own colour palette, typefaces, photo background, and wording from its design board:

| | Jazz | Classical | Rock |
|---|---|---|---|
| Headline | "Pick a period, / take the stage." | "Pick a period, / begin the overture." | "Pick a period. / Turn it up." |
| Now strip | "Now playing" | "Now performing" | "On stage now" |
| Setlist | "This week's setlist" | "This week's programme" | "This week's gigs" |
| Rules | "Before you head in" / "House rules" | "Before the downbeat" / "Etiquette" | "Before soundcheck" / "Backstage rules" |
| Rule numbers | 01–03 | I–III | 01–03 |

Text SHALL meet 4.5:1 contrast (3:1 for large text) in every theme.

#### Scenario: Classical wording
- **WHEN** Classical is active
- **THEN** the headline reads "begin the overture.", the schedule is titled "This week's programme", and the rules are titled "Etiquette" and numbered I, II, III

### Requirement: Light and Dark only for Jazz
The Light/Dark switch SHALL be shown only while Jazz is active. Classical and Rock SHALL each show their single designed look.

#### Scenario: Switch to Classical
- **WHEN** a visitor using Jazz Dark switches to Classical
- **THEN** the Light/Dark switch is hidden and Classical's cream-on-wine look is shown; switching back to Jazz restores Jazz Dark

### Requirement: Only the active theme's fonts load
The page SHALL download only the web fonts of the active theme, and SHALL load another theme's fonts when that theme is chosen.

#### Scenario: Jazz visitor
- **WHEN** a visitor opens the site in Jazz
- **THEN** no Classical or Rock font files are requested

### Requirement: Theme button shows the active theme's symbol
The Theme button SHALL show a symbol for the active theme (a trumpet for Jazz, a music note for Classical, a flame for Rock), and SHALL update as soon as the theme changes. Its accessible name SHALL include the theme's name. Each entry in the Theme menu SHALL show the same symbol next to its name.

#### Scenario: Switch to Rock
- **WHEN** a visitor picks Rock
- **THEN** the Theme button shows a flame and is announced as "Music theme: Rock"
