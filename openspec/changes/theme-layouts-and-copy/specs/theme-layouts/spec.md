# Spec Delta

## Purpose

Gives each music theme (Jazz, Classical, Rock) its own layout, surfaces, typefaces and palette, so the three themes read as three designs rather than one layout recoloured.

## ADDED Requirements

### Requirement: Jazz is a club setlist
In Jazz, each period in the schedule SHALL be a plain row with no box around it. The period name SHALL be joined to its start and end times by a dotted leader, and the times SHALL be set as large condensed numerals (Bebas Neue). Only the period running now SHALL have a warm spotlight glow behind its row. Jazz SHALL be the only theme that uses frosted glass surfaces.

#### Scenario: Jazz schedule rows
- **WHEN** a visitor views the schedule in Jazz
- **THEN** each period shows its name, a dotted line and its times in large numerals, with no border or card around the row

#### Scenario: Spotlight on the current period
- **WHEN** it is 10:00 on a weekday and today is shown in Jazz
- **THEN** only the Period 1 row today has the spotlight glow

### Requirement: Classical is a printed concert programme
In Classical, the schedule SHALL sit in a centred narrow column at every screen width. Periods SHALL be separated by thin double rules, with no cards and no rounded corners. Teaching periods SHALL be labelled in small caps with Roman numerals ("Period I" to "Period VI"), and Break and the two Lunches SHALL keep their names. Times SHALL be italic Cormorant Garamond, aligned right. The day selector SHALL read as full day names separated by a small ornament (e.g. "Tuesday · Wednesday · Thursday").

#### Scenario: Classical period label
- **WHEN** a visitor views Period 3 in Classical
- **THEN** it reads "Period III" in small caps, with its time in italics on the right

#### Scenario: Classical on a wide screen
- **WHEN** Classical is shown on a 1440px-wide screen
- **THEN** the schedule stays one narrow centred column showing one day at a time, with the day selector above it

### Requirement: Rock is a gig poster
In Rock, surfaces SHALL be solid with square corners, SHALL NOT use glass or blur, and SHALL use 2–3px outlines. The schedule card SHALL be tilted slightly (about -0.5°) on wide screens. A period that can't be booked SHALL carry a stamp that looks like torn tape and gives the reason in capitals (for example "SOLD OUT" for a full period). The Apply button SHALL look like a ticket stub with a perforated edge.

#### Scenario: Full period in Rock
- **WHEN** a period has 10 of 10 people confirmed and Rock is active
- **THEN** that period shows a tape stamp reading "SOLD OUT" and no Apply button

#### Scenario: Rock has no glass
- **WHEN** Rock is active
- **THEN** no panel, button or card on the page blurs the background behind it

### Requirement: Body typeface per theme
Each theme SHALL use its own typeface for body text: DM Sans for Jazz, EB Garamond for Classical and Archivo for Rock. Only the active theme's fonts SHALL be downloaded.

#### Scenario: Switching to Classical loads its fonts
- **WHEN** a visitor using Jazz switches to Classical
- **THEN** body text is set in EB Garamond, and the Classical fonts are requested only at that moment

### Requirement: Jazz oxblood and brass palette
Jazz SHALL use deep oxblood with brass accents in place of navy and gold, in both its Light and Dark looks. All text SHALL meet 4.5:1 contrast (3:1 for large text) against what sits behind it, in every theme and look.

#### Scenario: Jazz Dark
- **WHEN** Jazz Dark is active
- **THEN** surfaces are deep oxblood, accents are brass, and no navy surface remains

### Requirement: Text wordmark
The header SHALL show the wordmark "KCM Rooms" in the active theme's heading typeface, and SHALL NOT show an icon in a tile.

#### Scenario: Wordmark follows the theme
- **WHEN** a visitor switches from Jazz to Rock
- **THEN** the "KCM Rooms" wordmark changes from the Jazz heading face to the Rock heading face

### Requirement: Side-by-side days on wide screens
When the schedule area is wide enough, Jazz and Rock SHALL show the three visible days side by side (e.g. Tue, Wed and Thu as three columns), with each day as its own list of periods. When it is narrower, they SHALL show day tabs and one day at a time. The switch SHALL depend on the width of the schedule area, not on the device.

#### Scenario: Desktop Jazz
- **WHEN** Jazz is shown on a 1280px-wide screen
- **THEN** three day columns sit side by side and no day tabs are shown

#### Scenario: Phone Rock
- **WHEN** Rock is shown on a 375px-wide phone
- **THEN** day tabs are shown and one day's periods are listed below them

### Requirement: Theme-specific spacing
Spacing, corner radius and the gaps between blocks SHALL differ between themes, following each theme's layout. Jazz rows SHALL be airy with no radius, Classical SHALL have no radius at all, and Rock corners SHALL be square.

#### Scenario: No rounded corners outside Jazz
- **WHEN** Classical or Rock is active
- **THEN** the schedule, its rows and its buttons have square corners

### Requirement: Light and Dark in every theme
The Light/Dark switch SHALL be shown in all three themes. Each theme SHALL remember its own choice in that browser. With no saved choice, Jazz SHALL follow the device setting, Classical SHALL start Light and Rock SHALL start Dark. Jazz SHALL keep reading the choice saved by earlier versions of the site. Each theme's layout SHALL keep its identity in both looks: Classical Dark uses deep wine surfaces with gold, and Rock Light uses white surfaces with red kept for actions.

#### Scenario: Switch shown everywhere
- **WHEN** Classical or Rock is active
- **THEN** the header shows the Light/Dark switch

#### Scenario: Choices are per theme
- **WHEN** a visitor opens Rock for the first time, sees Dark, chooses Light, then switches to Classical
- **THEN** Classical shows Light (its default), and switching back to Rock shows Light

#### Scenario: Layout survives the look
- **WHEN** Classical Dark or Rock Light is active
- **THEN** Classical is still a double-ruled programme with no radius, and Rock still has square outlines, tape stamps and no glass
