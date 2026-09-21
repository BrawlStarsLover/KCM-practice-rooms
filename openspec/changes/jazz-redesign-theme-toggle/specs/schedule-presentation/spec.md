# Spec Delta

## Purpose

Defines how visitors see the three-weekday schedule, each period's state, what is happening right now, the house rules, and their own pending requests, on both desktop and phone.

## ADDED Requirements

### Requirement: Desktop setlist table
On screens 900 px wide and up, the schedule SHALL be a table with the nine fixed periods as rows (code such as P1/BR/L1, name and time) and the three visible weekdays as columns (day name, date, and a "Today" tag on today). A legend SHALL explain the states Open, Requested, Full, Closed and Ended.

#### Scenario: Desktop layout
- **WHEN** the page is viewed 1280 px wide
- **THEN** all 27 period cells are visible as 9 rows by 3 day columns, without horizontal scrolling

### Requirement: Phone day tabs
Below 900 px the schedule SHALL show three day tabs (today selected first) and one day's nine periods as a vertical list. There SHALL be no horizontal page scroll at 360 px width, and touch targets SHALL be at least 44 px tall.

#### Scenario: Switch day on phone
- **WHEN** a visitor on a 390 px screen taps the Wed tab
- **THEN** the list shows Wednesday's nine periods and the Wed tab is marked selected

### Requirement: Slot states shown to visitors
Each cell SHALL show exactly one state, and SHALL never reveal instrument, reason, or who has applied:
- **Closed**: dashed, lock icon, no action.
- **Ended**: an open period whose end time has passed; shows "Finished at HH:MM", no action.
- **Full**: 10 confirmed; brick pill and "10 of 10".
- **Open**: teal pill, a 10-segment fill bar of confirmed places, "N of 10 · supervisor", and an Apply button.
- **Requested**: the visitor's own pending request for that period, from this browser; brass pill, "Awaiting confirmation · N of 10", no Apply button.

#### Scenario: Open period
- **WHEN** a period is open with 8 confirmed and supervisor "Ms. Chen"
- **THEN** its cell shows Open, 8 of 10 bars filled, "8 of 10 · Ms. Chen", and an Apply button

### Requirement: Own requests remembered in this browser
After a successful request, the browser SHALL remember its request id for that period and show the period as Requested while the id is still pending. Once the id is no longer pending (accepted, declined, removed or closed), the normal state SHALL show again. Nothing new SHALL be written to the database for this.

#### Scenario: Request then reload
- **WHEN** a visitor applies to Period 3 and reloads the page
- **THEN** Period 3 still shows Requested on that browser, and other browsers see it as Open

#### Scenario: Admin acts
- **WHEN** the admin accepts or declines that request
- **THEN** within a few seconds the visitor's cell leaves the Requested state

### Requirement: Now playing strip
The hero SHALL show a "Now playing" strip when an open period is in progress today: its name and time, "N of 10 in the room", minutes left, and a progress bar of elapsed time. When no open period is in progress, the strip SHALL show the next open period later today, or be hidden if there is none. It SHALL update at least once a minute.

#### Scenario: During an open period
- **WHEN** it is 10:43 on a weekday and today's Period 2 (10:25–11:20) is open with 8 confirmed
- **THEN** the strip shows "Period 2 · 10:25–11:20 · 8 of 10 in the room" and "37 min left"

### Requirement: House rules and first-visit notice
The three house rules SHALL always be visible in a strip at the bottom of the page, and a "Room rules" header button SHALL scroll to it. The rules pop-up SHALL appear only on a browser's first visit, not on every load.

#### Scenario: Second visit
- **WHEN** a visitor who dismissed the rules pop-up opens the page again
- **THEN** no pop-up appears and the rules strip is still on the page

### Requirement: Visitor forms in the new style
The Apply window SHALL show the period, date and time, "N of 10 spots filled · supervisor", fields for name, instrument (optional) and reason (optional), and a note that other visitors only see the name. The supervisor application SHALL be opened from a "Become a supervisor" header button. Both keep all validation and behavior from before.

#### Scenario: Privacy note
- **WHEN** a visitor opens the Apply window
- **THEN** it states that other visitors only see their name, and instrument and reason go to the admin only
