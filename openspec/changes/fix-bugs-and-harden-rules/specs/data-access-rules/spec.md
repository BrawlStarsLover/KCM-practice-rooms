# Spec Delta

## Purpose

Defines who can read and change schedule data, enforced by the database so that visitors cannot tamper with other people's requests or see private applicant details.

## ADDED Requirements

### Requirement: Only the admin changes period state
Only the admin account SHALL be able to create periods, change a period's status, supervisor, confirmed list or recorded outcomes, or remove pending requests.

#### Scenario: Visitor tries to confirm themselves
- **WHEN** a non-admin sends a write that adds an entry to a period's confirmed list
- **THEN** the database rejects the write

### Requirement: Visitors can only append their own request
A non-admin write to a period SHALL be accepted only if the period is open and has fewer than 10 confirmed, the only changed field is the pending list, every existing pending entry is kept unchanged and in order, exactly one entry is added at the end, and that entry contains only an id (8–40 characters) and a name (1–60 characters).

#### Scenario: Visitor tries to erase others' requests
- **WHEN** a non-admin writes a pending list that drops or alters an existing entry, even if the list length grows by one
- **THEN** the database rejects the write

#### Scenario: Oversized or extra fields
- **WHEN** a non-admin appends an entry with a 500-character name or an extra field
- **THEN** the database rejects the write

### Requirement: Applicant details are private
Instrument and reason given with a request SHALL be readable only by the admin. Anyone MAY read period status, supervisor, and applicants' ids and names. A non-admin SHALL be able to create a details record only together with its matching pending entry, and SHALL NOT be able to read, change or delete any details record.

#### Scenario: Visitor reads a period
- **WHEN** a non-admin reads a period document
- **THEN** it contains no instrument or reason for any applicant

#### Scenario: Visitor reads details
- **WHEN** a non-admin tries to read any applicant details record
- **THEN** the database rejects the read

### Requirement: Supervisor applications are validated
A non-admin SHALL only be able to create a supervisor application containing a name (1–60 characters), an optional message (up to 200 characters) and a server timestamp, and SHALL NOT be able to read, change or delete applications.

#### Scenario: Oversized application
- **WHEN** a non-admin submits a supervisor application with a 5,000-character message
- **THEN** the database rejects it
