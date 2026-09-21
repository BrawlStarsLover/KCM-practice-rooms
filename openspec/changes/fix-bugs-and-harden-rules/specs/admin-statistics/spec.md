# Spec Delta

## Purpose

Gives the admin running totals about room use, computed from all history ever recorded, including closed and past periods.

## ADDED Requirements

### Requirement: Statistics cover all history
The admin panel SHALL compute its statistics from every period ever recorded, including closed and past periods, counting only confirmed attendees.

#### Scenario: Closed period still counted
- **WHEN** a period with 4 confirmed attendees is closed
- **THEN** those 4 attendances still count toward every statistic

### Requirement: Statistics shown
The admin panel SHALL show: most frequent visitor (name and count), total hours supervised (the length of each period that had at least one confirmed attendee, counted once per period), total practice hours (period length × confirmed attendees, summed), and most popular instrument (with count).

#### Scenario: Hours computed
- **WHEN** history holds one 60-minute period with 3 confirmed and one 30-minute period with 1 confirmed
- **THEN** total hours supervised is 1.5 h and total practice hours is 3.5 h

#### Scenario: No history
- **WHEN** no period has any confirmed attendee
- **THEN** each statistic shows a dash or 0.0 h without errors
