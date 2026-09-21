# Spec Delta

## Purpose

Keeps what visitors and the admin see in step with the database without anyone having to reload the page.

## ADDED Requirements

### Requirement: Visitors see their outcome live
A visitor's view of their own request SHALL update within a few seconds of the admin acting, without a reload: Requested while waiting, "You're in" once accepted (with no Apply button), and "Not accepted · You can apply again" after being declined or removed.

#### Scenario: Accepted while the page is open
- **WHEN** a visitor has the page open showing Requested and the admin accepts them
- **THEN** within a few seconds the cell shows "You're in", without a reload

### Requirement: Reconnect when the page comes back
When the page becomes visible after being hidden for more than a few seconds, comes back online, or is restored from the browser's back/forward cache, it SHALL re-establish its live connection so that any missed changes appear without a reload.

#### Scenario: Phone unlocked
- **WHEN** a visitor's phone was locked while the admin accepted them, and the visitor unlocks it and returns to the page
- **THEN** the page reconnects and shows "You're in" without a reload

### Requirement: Admin actions show immediately
Each accept, decline, remove, open, close or supervisor change SHALL be reflected in the admin's page as soon as the database confirms it, even if the live listener is slow. Several actions made in quick succession SHALL all be applied, in order.

#### Scenario: Remove three people quickly
- **WHEN** the admin removes three confirmed people within a second
- **THEN** all three rows dim at once, all three disappear once confirmed, without a reload, and all three are recorded as removed
