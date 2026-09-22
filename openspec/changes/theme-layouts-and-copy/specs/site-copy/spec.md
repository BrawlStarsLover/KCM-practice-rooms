# Spec Delta

## Purpose

Sets the visible wording of the page in plain, specific language: the headline per theme, the house rules and the rules pop-up button.

## ADDED Requirements

### Requirement: One-line headline per theme
The headline SHALL be one plain line per theme:

| Theme | Headline |
|---|---|
| Jazz | Rooms open this week |
| Classical | Book a practice room |
| Rock | GET IN THE ROOM |

#### Scenario: Rock headline
- **WHEN** Rock is active
- **THEN** the headline reads "GET IN THE ROOM" on a single line of text

### Requirement: Plain numbered house rules
The house rules SHALL be a numbered list with no icons, worded exactly as follows, both on the page and in the rules pop-up:
1. Doors lock 5 min after the period starts.
2. First requests get the rooms.
3. Everyone inside has to be playing, singing or writing.

The rule numbers SHALL follow the theme (I–III in Classical, 1–3 elsewhere).

#### Scenario: Rules pop-up
- **WHEN** a first-time visitor sees the rules pop-up
- **THEN** it lists the three rules above, numbered, with no icons

### Requirement: Rules pop-up button
The button that closes the rules pop-up SHALL read "OK, show me the rooms".

#### Scenario: Dismiss rules
- **WHEN** a visitor presses "OK, show me the rooms"
- **THEN** the pop-up closes and does not appear again in that browser
