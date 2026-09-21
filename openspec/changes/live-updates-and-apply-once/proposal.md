# Proposal

## Why

After the redesign went live, the owner found four problems:
- Changes often only showed after a reload: removing several people in a row looked frozen, and a phone didn't show whether a request was accepted.
- Any visitor could keep applying to a period they were already in, under any name.
- The admin panel animated open twice.
- The owner wants only Light and Dark themes, not Auto.

## What Changes

- **Live updates you can trust:**
  - When a tab or phone comes back into view (or the network returns), the page forces a fresh connection to the database. Browsers silently drop the live connection on background tabs.
  - The admin's own changes show immediately from the write's result instead of waiting for the listener.
- **One live request per browser per period, enforced by the database:**
  - Visitors get an invisible anonymous Firebase ID (no login screen).
  - A browser that is waiting for, or already in, a period can't request it again, under any name.
  - After being declined or removed, the visitor can apply again.
  - A name already on that period is refused by the page.
  - **BREAKING** for data and rules: pending and confirmed entries gain `uid`, and period documents gain `pendingUids` and `confirmedUids`. Anonymous sign-in must be enabled in Firebase.
- **Visitor sees their outcome:** "You're in" when accepted; "Not accepted · You can apply again" (with Apply) when declined or removed; "Requested" while waiting.
- **Admin panel** is built once and updates in place: one slide-in, and focus stays inside.
- **Theme:** Light and Dark only. A first visit follows the device setting once; after that it's the visitor's choice.

## Capabilities

### New Capabilities
- `request-limits`: Who may request a period, and how often, enforced server-side per browser.
- `live-sync`: How the page stays current without reloads, for visitors and the admin.

### Modified Capabilities
<!-- jazz-redesign-theme-toggle and fix-bugs-and-harden-rules are not archived yet, so there are no main specs to modify. The Auto-theme removal and the admin panel fix are recorded in this change's tasks and design, and their specs will be reconciled when those changes are archived. -->

## Impact

- `firestore.rules`: visitor append requires anonymous auth, a `uid` on the entry, and the uid mirrors. Rules tests grow from 23 to 30.
- `index.html`: anonymous sign-in, apply checks, new cell states, uid mirrors in admin transactions, reconnect-on-resume, in-place admin panel, Light/Dark theme.
- Firebase project: **Anonymous sign-in provider must be enabled** before the rules are published.
- Existing live entries without a uid keep working. Those people just aren't protected by the per-browser limit.
