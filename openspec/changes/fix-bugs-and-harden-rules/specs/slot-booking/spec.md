# Spec Delta

## Purpose

Lets visitors see the practice-room schedule for the next three weekdays and request a spot in any period the supervisor has opened.

## ADDED Requirements

### Requirement: Fixed three-weekday schedule
The system SHALL show exactly the next three weekdays starting today (skipping Saturday and Sunday), each with the fixed nine periods: Period 1 (9:30–10:25), Period 2 (10:25–11:20), Break (11:20–11:40), Period 3 (11:40–12:40), Period 4 (12:40–13:40), Lunch 1 (13:40–14:10), Lunch 2 (14:10–14:40), Period 5 (14:40–15:35), Period 6 (15:35–16:30), using the viewer's local time.

#### Scenario: Weekend skipped
- **WHEN** the page is viewed on a Friday
- **THEN** the columns shown are Friday, Monday and Tuesday

#### Scenario: Day rolls over while the page is open
- **WHEN** the page stays open past midnight
- **THEN** within one minute the schedule shows the new three-weekday window without a manual reload

### Requirement: Apply to an open period
A visitor SHALL be able to request a spot in a period that is open, not full, and has not yet ended, by giving a name (1–60 characters) and optionally an instrument (up to 40 characters) and a reason (up to 200 characters). The request SHALL appear as pending for the admin.

#### Scenario: Successful request
- **WHEN** a visitor submits a name for an open period with 4 of 10 spots filled
- **THEN** the visitor sees "Request sent" and the admin sees one more pending request with that name, instrument and reason

#### Scenario: Name missing
- **WHEN** a visitor submits the form with an empty name
- **THEN** no request is stored and the visitor is asked to enter a name

### Requirement: Simultaneous requests do not conflict
Two or more visitors applying to the same period at the same time SHALL all have their requests stored, with none overwriting another.

#### Scenario: Two visitors apply at once
- **WHEN** two visitors submit requests for the same open period within the same second
- **THEN** both requests appear as pending and neither visitor sees an error

### Requirement: No applying to ended or full periods
The system SHALL NOT offer the Apply action for a period whose end time has passed today, for a period that is closed, or for a period that already has 10 confirmed people.

#### Scenario: Period already over
- **WHEN** it is 12:00 and a visitor views today's Period 2 (ends 11:20) which is open
- **THEN** the period is shown as ended and has no Apply button

#### Scenario: Period ends while the page is open
- **WHEN** the page is open at 11:19 showing today's Period 2 as open, and the time passes 11:20
- **THEN** within one minute the Apply button for that period disappears

#### Scenario: Full period
- **WHEN** a period has 10 confirmed people
- **THEN** visitors see it as Full with no Apply button

### Requirement: Old-format data is ignored
Period documents that do not have the current structure SHALL be displayed as closed and SHALL NOT cause errors.

#### Scenario: Leftover document from an older version
- **WHEN** a stored period document has only `status`, `supervisor`, `applicant` and `note`
- **THEN** the schedule treats that period as closed and renders normally
