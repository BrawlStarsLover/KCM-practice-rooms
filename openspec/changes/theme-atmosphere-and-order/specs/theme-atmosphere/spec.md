# Spec Delta

## Purpose

Describes how each theme's background photo is treated — cropped, tinted to the theme's colour and grained — so it reads as atmosphere behind the page rather than a photograph competing with the schedule.

## ADDED Requirements

### Requirement: One treated photo per theme
Each theme SHALL use its own single photo, cropped in closer than today, tinted towards that theme's own colour as a duotone, and covered by a fine grain. The treatment SHALL apply on phones and on desktop, and SHALL NOT require any new image file.

#### Scenario: Jazz background
- **WHEN** Jazz is active
- **THEN** the background photo is tinted towards Jazz's oxblood and brass, carries visible grain, and shows a closer crop than the untreated photo

#### Scenario: Each theme keeps its own photo
- **WHEN** a visitor switches between the three themes
- **THEN** each theme shows its own photo, treated in its own colour

### Requirement: The background stays behind the page
The treated background SHALL sit behind all content, SHALL NOT catch clicks, and SHALL leave every text on the page at 4.5:1 contrast (3:1 for large text). Where the page already dims the photo behind the headline on phones, that SHALL still hold.

#### Scenario: Reading over the background
- **WHEN** any theme and look is shown at phone or desktop width
- **THEN** the headline and the text over the photo stay at or above their contrast minimum, and nothing in the background intercepts a tap
