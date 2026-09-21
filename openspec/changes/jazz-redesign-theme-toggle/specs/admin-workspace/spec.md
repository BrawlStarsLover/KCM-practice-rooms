# Spec Delta

## Purpose

Gives the signed-in admin an at-a-glance working view of the schedule and a side panel to run each period, in the redesigned style.

## ADDED Requirements

### Requirement: Admin counters and compact cells
When signed in as admin, the page SHALL show "N requests waiting" (pending requests across the visible days) and "N of 27 periods open". Each open cell SHALL show "N/10 in", a pending count when above zero, the supervisor, and a Manage button. A full cell SHALL show "Full · 10/10", and an ended cell "Ended · N/10". Closed cells SHALL show Closed and an Open button. An Admin panel button SHALL show a badge with the number of supervisor applications waiting.

#### Scenario: Counters
- **WHEN** the visible days have 17 open periods holding 14 pending requests in total
- **THEN** the header shows "14 requests waiting" and "17 of 27 periods open"

### Requirement: Manage window
Manage SHALL open a window for that period (a bottom sheet on phones). It shows:
- the date and time, the name, "N/10 in" and spots left
- a supervisor selector
- the waiting list, each request with name, instrument and reason (or "No reason given"), plus Accept and Decline
- "In the room · N of 10" listing confirmed names, each with Remove
- Close period and Done buttons

It SHALL update live, as today's Manage window does. When one spot is left and requests are waiting, it SHALL warn that accepting one fills the room.

#### Scenario: Live panel
- **WHEN** the window is open and a visitor applies to that period
- **THEN** the new request appears in the waiting list without reopening the window

### Requirement: Change a period's supervisor
From the Manage window the admin SHALL be able to change the period's supervisor to themself ("Me (name)") or any approved supervisor. Visitors SHALL see the new supervisor within a few seconds. The change SHALL NOT touch the waiting list, confirmed list or recorded outcomes.

#### Scenario: Swap supervisor
- **WHEN** the admin changes an open period's supervisor from "Ms. Chen" to "Mr. Brooks"
- **THEN** visitors see "Mr. Brooks" on that period, and its confirmed and pending lists are unchanged

### Requirement: Quick, reliable consecutive actions
In the Manage window, each accept, decline or remove SHALL give visible feedback immediately (the row dims and cannot be clicked twice). Several actions on the same period made in quick succession SHALL all be applied, in order, without errors.

#### Scenario: Remove two people back to back
- **WHEN** the admin removes two confirmed people within a second of each other
- **THEN** both rows dim at once, both are removed, and both are recorded as removed
