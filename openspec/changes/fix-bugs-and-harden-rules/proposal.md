# Proposal

## Why

The Practice Room Schedule is live and used for real bookings, but a review found security holes in the Firestore rules (any visitor can overwrite other people's pending requests, and every applicant's instrument and note are publicly readable) plus several bugs that lose data or show wrong information (closing a period erases its attendance history, "Supervisor: Me" is shown to visitors, simultaneous applications fail). These must be fixed before new features and the redesign are built on top.

## What Changes

- **Rules hardening**: visitors can only append exactly one well-formed request to an open, non-full period; every existing entry, the status, supervisor and confirmed list must stay untouched. Request and supervisor-application fields are type- and length-checked.
- **Privacy split**: the public period document holds only request ids and names. Instrument and note move to an admin-only collection. (Visitors may see other applicants' names; never their instrument or note.) **BREAKING** for the stored data shape — handled in-app, see design.
- **Closing keeps history**: closing a period keeps its confirmed attendees for statistics; still-pending requests become declined. Re-opening a closed period keeps its history instead of wiping it.
- **Outcome tracking**: declined and removed requests are recorded by id (no public names), so a later change can show students their request status.
- **Supervisor name fix**: choosing yourself as supervisor stores your real display name, not the literal "Me".
- **Concurrency fix**: simultaneous applications to the same period both succeed; accepting a request can never push a period past 10.
- **Live Manage panel**: the Manage window updates as requests arrive or change.
- **Past periods**: visitors cannot apply to a period that has already ended; the schedule refreshes itself as time passes and when the day rolls over.
- **Efficient loading**: the schedule loads only the 3 visible days; the full history is loaded only when the admin opens the statistics panel.
- **Statistics**: "Total hours supervised" now counts each period once (if at least one person attended); a new "Total practice hours" shows the old person-hours number.
- **Legacy cleanup**: the two leftover documents from an older version of the site are ignored by the app and deleted as a deploy step.

## Capabilities

### New Capabilities
- `slot-booking`: How visitors see the 3-day schedule and apply for a spot in an open period.
- `slot-administration`: How the admin opens, manages and closes periods and handles requests.
- `data-access-rules`: Who may read and write which data, including privacy of applicant details.
- `admin-statistics`: Statistics shown in the admin panel, computed from preserved history.

### Modified Capabilities
<!-- None: no specs exist yet in openspec/specs/. -->

## Impact

- `index.html`: data layer (Firestore reads/writes), Manage modal, Open modal, render timing, sidebar statistics.
- `firestore.rules`: rewritten; must be redeployed to Firebase by the owner after the new `index.html` is live on Vercel.
- Firestore data: new `requestDetails` collection; `cells` documents gain `declinedIds`; two legacy `cells` docs deleted.
- No new dependencies; stays on Firebase compat SDK 10.12.2 and the free tier.
