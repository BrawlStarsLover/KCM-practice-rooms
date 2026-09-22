# Spec Delta

## Purpose

Defines what the schedule shows for each period and day: why a period can't be booked, how full it is, where we are in the current period, and how many periods are still open. This lets a visitor read the week at a glance.

## ADDED Requirements

### Requirement: Unavailable periods say why
A period a visitor can't apply for SHALL show the reason instead of a bare "Closed":
- "Ended" when its end time has passed, whatever its status
- "Full (10/10)" when it is open and all 10 places are confirmed
- "Not open yet" when it has not been opened and has not ended

The admin SHALL still see the Open or Manage button on every period, as now.

#### Scenario: Future unopened period
- **WHEN** Thursday's Period 5 has not been opened and Thursday is still ahead
- **THEN** that period reads "Not open yet"

#### Scenario: Past unopened period
- **WHEN** today's Period 1 was never opened and it is now 11:00
- **THEN** that period reads "Ended"

#### Scenario: Full period
- **WHEN** an open, unfinished period has 10 people confirmed
- **THEN** it reads "Full (10/10)"

### Requirement: Seat meter of ten dots
Every open period that hasn't ended SHALL show a row of 10 dots, one per place, with confirmed places filled. The meter SHALL be announced to screen readers as "N of 10 places taken" and SHALL replace the "N of 10" text label.

#### Scenario: Six people in
- **WHEN** an open period has 6 confirmed people
- **THEN** 6 of its 10 dots are filled, and a screen reader hears "6 of 10 places taken"

### Requirement: Current period highlight and progress
While a period is running today, its row SHALL be highlighted and SHALL show a thin progress bar with the share of the period that has passed. It SHALL update at least every 30 seconds.

#### Scenario: Halfway through Period 3
- **WHEN** it is 12:10 on a weekday (Period 3 runs 11:40–12:40)
- **THEN** today's Period 3 row is highlighted, with its progress bar at about half

### Requirement: Finished periods fold away
In today's list, the periods that have ended SHALL be folded into one line reading "Earlier today (N)", placed above the remaining periods, where N is the number of finished periods. Activating that line SHALL show and hide them. The line SHALL NOT appear when no period has ended, and other days SHALL never fold.

#### Scenario: Mid-morning
- **WHEN** it is 12:00 today (Period 1, Period 2 and Break have ended)
- **THEN** today starts with "Earlier today (3)", followed by Period 3 onwards

#### Scenario: Expand finished periods
- **WHEN** a visitor activates "Earlier today (3)"
- **THEN** the three finished periods appear with their "Ended" state, and the fold stays open across the automatic refresh

### Requirement: Day tabs show open counts
Each day tab SHALL show the short day name and the number of that day's periods a visitor can still apply for (open, not ended and not full), e.g. "Wed · 3 open". A day with none SHALL read "none open". For the admin, the count SHALL be the number of open periods.

#### Scenario: Day with three bookable periods
- **WHEN** Wednesday has three periods open, unfinished and not full
- **THEN** its tab reads "Wed · 3 open"
