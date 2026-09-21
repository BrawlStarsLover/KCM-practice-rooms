# Spec Delta

## Purpose

Makes sure each visitor browser can hold only one live request per period, while still letting people who were declined try again.

## ADDED Requirements

### Requirement: Invisible visitor identity
Every visitor browser SHALL be given an anonymous identity automatically, without any login screen, and SHALL keep it across visits in that browser.

#### Scenario: First visit
- **WHEN** a visitor opens the site for the first time
- **THEN** they see no sign-in prompt, and their browser holds an anonymous identity used for their requests

### Requirement: One live request per browser per period
The database SHALL reject a request for a period when that browser's identity already has a pending request for it or is confirmed in it, whatever name is used. Requests without a signed-in identity, or claiming another browser's identity, SHALL be rejected.

#### Scenario: Apply again under another name while waiting
- **WHEN** a browser with a pending request for Tuesday Period 1 sends another request for it under a different name
- **THEN** the database rejects it

#### Scenario: Apply again after being accepted
- **WHEN** a browser that is confirmed in a period tries to request it again
- **THEN** the page shows no Apply button, and a request sent directly is rejected

#### Scenario: Different periods
- **WHEN** a browser requests Tuesday Period 1 and then Tuesday Period 2
- **THEN** both requests are accepted

### Requirement: Declined visitors may apply again
After the admin declines or removes a browser's request for a period, or closes the period, that browser SHALL be able to request the period again (if it is open, not full and not ended). The cell SHALL show "Not accepted · You can apply again" with an Apply button.

#### Scenario: Declined then reapply
- **WHEN** the admin declines a visitor's request and the visitor applies again
- **THEN** the new request is accepted and the cell shows Requested

### Requirement: No duplicate names on a period
The page SHALL refuse a request whose name (ignoring case and surrounding spaces) is already on that period's waiting or confirmed list, and say why.

#### Scenario: Name already taken
- **WHEN** "Sam R." is confirmed in a period and another visitor applies to it as "sam r."
- **THEN** the page shows "That name is already on this period" and sends nothing
