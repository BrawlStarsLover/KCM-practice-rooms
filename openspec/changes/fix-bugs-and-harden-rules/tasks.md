# Tasks

## 1. Rules and rules tests

- [x] 1.1 Add `.vercelignore` excluding `openspec/`, `tests/` and `.claude/`, and verify with `git ls-files` that the repo root still has only `index.html` as the served page (no root `package.json` that would trigger a Vercel build)
- [x] 1.2 Rewrite `firestore.rules` per design §1–2 (`cells` admin-only writes plus the append-one visitor rule with slice check, `validEntry` and `existsAfter`; `requestDetails` admin read, visitor create cross-checked with `getAfter`; validated `supervisorApps` create; `supervisors` unchanged), and verify it compiles with `npx firebase-tools` or the console Rules editor showing no errors
- [x] 1.3 Create `tests/rules/` (its own `package.json` and a `@firebase/rules-unit-testing` test file) with one test per `data-access-rules` scenario, plus: visitor apply to a closed or full cell is rejected, visitor setting `declinedIds` is rejected, and a details doc without a matching pending entry is rejected. Verify all pass with `tests/rules/emulate.sh` (emulator config lives in the root `firebase.json`, which also enables `firebase deploy --only firestore:rules`). This needs JDK 21 and only JDK 8 is installed, so ask the user before installing it; if declined, run the same cases in the console Rules Playground and record the results in this task

## 2. Data layer in `index.html`

- [x] 2.1 Make `getCell()` normalize legacy or malformed docs to closed and empty, and add `declinedIds` to the returned shape; verify by loading the page against the live data (legacy docs render as Closed, no console errors)
- [x] 2.2 Replace `applyToCell` with the atomic batch (details doc plus `arrayUnion` of `{id, name}`); verify by applying from two browser tabs within the same second and seeing both requests pending
- [x] 2.3 Rewrite `openCellWith`, `acceptPending`, `declinePending`, `removeConfirmed` and `closeCell` as transactions per design §3 (re-open keeps history, close declines pending and keeps confirmed, accept blocks at 10); verify each spec scenario in `slot-administration` by hand in the emulator or on a preview deploy
- [x] 2.4 Switch the cells listener to the document-ID range query for the 3 visible days, plus the 30-second tick that re-subscribes on window change and re-renders on minute change; verify in the Network or Firestore debug log that only visible-day docs load, and that faking the clock past a period's end removes its Apply button

## 3. UI fixes

- [x] 3.1 Open modal: label "Me (display name)", with a name prompt and `updateProfile` when no display name is set; verify a visitor view shows the real name, never "Me"
- [x] 3.2 Visitor slots: hide Apply for periods that have ended and show an "Ended" pill; verify with a period whose end time has passed today
- [x] 3.3 Manage modal redraw hook per design §6 (live updates, auto-close if the period is closed elsewhere, hook cleared on close); verify a request made in another tab appears in the open Manage window
- [x] 3.4 Manage modal loads instrument and note for listed requests from `requestDetails` (admin only); verify details show for the admin and that a visitor's page never requests `requestDetails`

## 4. Statistics

- [x] 4.1 On sidebar open, fetch all cells and requestDetails once, then compute: most frequent visitor, total hours supervised, total practice hours, and most popular instrument (with a loading state); verify against the `admin-statistics` example scenario (1.5 h / 3.5 h) using emulator seed data or a hand-made test period

## 5. Deploy

- [x] 5.1 Commit on branch `fix-bugs-and-harden-rules`, push, and open a PR; verify the Vercel preview loads with no console errors
- [ ] 5.2 With the user: delete the 2 legacy `cells` docs in the Firebase console, publish the new rules, then merge the PR; verify the live smoke test from the design's Migration Plan step 5 passes
