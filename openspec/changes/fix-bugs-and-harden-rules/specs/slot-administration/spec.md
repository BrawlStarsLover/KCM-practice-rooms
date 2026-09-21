# Spec Delta

## Purpose

Lets the signed-in admin (the supervisor who runs the rooms) open periods, choose who supervises, handle requests and close periods without losing history.

## ADDED Requirements

### Requirement: Open a period with a named supervisor
The admin SHALL be able to open a closed period and choose its supervisor from "Me" or the approved supervisors list. Choosing "Me" SHALL store the admin's display name, and visitors SHALL never see the literal text "Me" as a supervisor. If the admin has no display name set, the system SHALL ask for one before opening and remember it for future use.

#### Scenario: Admin supervises
- **WHEN** the admin, whose display name is "Mr Kim", opens a period choosing "Me"
- **THEN** visitors see "Supervisor: Mr Kim"

#### Scenario: No display name yet
- **WHEN** the admin chooses "Me" and has no display name saved
- **THEN** the admin is asked for a name, it is saved, and the period opens with that name

### Requirement: Re-opening keeps history
Re-opening a period that was previously closed SHALL keep its earlier confirmed attendees and recorded outcomes, and SHALL only change its status and supervisor.

#### Scenario: Close then re-open
- **WHEN** a period with 3 confirmed people is closed and then opened again
- **THEN** it opens showing 3/10 confirmed

### Requirement: Accept, decline and remove requests
In the Manage window the admin SHALL be able to accept or decline each pending request and remove each confirmed person. Accepting SHALL never result in more than 10 confirmed people. Declined and removed requests SHALL be recorded as such by request id.

#### Scenario: Accept into last spot
- **WHEN** a period has 9 confirmed and the admin accepts a pending request
- **THEN** it has 10 confirmed and the request is no longer pending

#### Scenario: Accept when full
- **WHEN** a period has 10 confirmed and the admin tries to accept another request
- **THEN** the request stays pending and the admin is told the period is full

#### Scenario: Decline
- **WHEN** the admin declines a pending request
- **THEN** it is removed from pending and its id is recorded as declined

### Requirement: Manage window stays current
While the Manage window is open it SHALL reflect changes to that period within a few seconds, including new requests from visitors.

#### Scenario: Request arrives while managing
- **WHEN** the admin has the Manage window open and a visitor applies to that period
- **THEN** the new pending request appears in the open window without closing and reopening it

### Requirement: Closing keeps history
Closing a period SHALL stop new requests, keep its confirmed attendees for statistics, and record all still-pending requests as declined.

#### Scenario: Close a period with attendees
- **WHEN** the admin closes a period with 5 confirmed and 2 pending
- **THEN** the period shows as Closed, its 5 confirmed attendees still count in statistics, and the 2 pending requests are recorded as declined
