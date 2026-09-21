# Design

## Context

The whole app is one static `index.html` served by Vercel. It uses the Firebase compat SDK (10.12.2) directly from the browser, and access control lives entirely in `firestore.rules` (deployed separately in the Firebase console). There is no build step, backend or test suite. One admin account is hard-coded by UID.

Current data: `cells/{YYYY-MM-DD}_{periodId}` holds `{status, supervisor, pending[], confirmed[]}` where each entry is `{id, name, instrument, note}` and is publicly readable. The live database currently has only two legacy test documents (`2026-09-18_br`, `2026-09-19_p2`) shaped `{status, supervisor, applicant, note}` from an older version. So no real booking data needs migrating.

## Goals / Non-Goals

**Goals:**
- The database itself enforces every rule in `specs/data-access-rules`, so a visitor with the browser console open cannot bypass the UI.
- Keep the single-file, no-build setup and the free tier.

**Non-Goals:**
- Showing visitors other applicants' names or their own request status (the next change, `visitor-request-status`, builds on the `declinedIds` added here).
- Visual redesign.
- Enforcing "period already ended" in the rules. Rules have no notion of the school's timezone, so this stays client-side (low risk: the admin still has to accept).

## Decisions

### 1. Data model: public period doc + private details collection
```
cells/{date}_{pid}       public read
  status: 'open' | 'closed'
  supervisor: string
  pending:     [{id, name}]
  confirmed:   [{id, name}]
  declinedIds: [string]           // declined, removed, or pending-at-close

requestDetails/{requestId}   admin read only
  cellId, name, instrument, note, createdAt (server time)
```
Firestore rules can't hide individual fields, so private data has to be in a separate document. *Alternative considered:* one `requests/{id}` doc per application with the cell holding only counts. Rejected because visitors will need names (next change), and the admin's live view would need a second listener.

### 2. Visitor apply = one atomic batch
The client generates the request id with `requestDetails.doc().id` (20 random characters). It then commits a single batch:
- `set requestDetails/{id}`
- `update cells/{cellId} { pending: arrayUnion({id, name}) }`

Rules cross-check both halves:
- The cell rule requires `existsAfter(requestDetails/{newId})`.
- The details rule requires `getAfter(cells/{cellId}).data.pending` to contain `{id, name}`.

So neither half can be written alone, and orphan or forged details are impossible.

Because `arrayUnion` is applied server-side against the latest document, two simultaneous applies both succeed. That fixes the "permission denied" race without needing a transaction. Visitors can't use transactions well here anyway, since they can't read `requestDetails`.

Cell rule for non-admin updates (sketch):
```
let before = resource.data.pending;
let after  = request.resource.data.pending;
resource.data.status == 'open'
&& resource.data.confirmed.size() < 10
&& request.resource.data.diff(resource.data).affectedKeys().hasOnly(['pending'])
&& after.size() == before.size() + 1
&& after[0:before.size()] == before
&& validEntry(after[before.size()])          // keys == {id,name}, lengths
&& existsAfter(/databases/$(database)/documents/requestDetails/$(after[before.size()].id))
```

### 3. Admin writes use transactions
Open, accept, decline, remove and close each run in `db.runTransaction`. The transaction reads the current cell, applies the change and writes it back. The capacity check therefore uses server data, not the possibly stale local copy.
- **Open:** if the doc already exists in the current shape, update only `status` and `supervisor`. If it is missing or legacy, write a fresh doc.
- **Close:** set `status: 'closed'`, append all pending ids to `declinedIds`, clear `pending`, keep `confirmed`.
- **Remove:** move the id from `confirmed` to `declinedIds`. The `requestDetails` doc is kept so history stays intact.

### 4. "Me" supervisor uses the Firebase Auth display name
The "Me" option is labelled `Me (<displayName>)` and stores `auth.currentUser.displayName`. If that is empty, the Open modal shows a name field and saves it with `currentUser.updateProfile({displayName})`. No new collection or rule is needed.

### 5. Scoped live listener + clock tick
- The schedule listens to `cells` with a document-ID range query from the first to the last visible date (`__name__ >= '<d1>'` and `< '<d3>_~'`). That is at most 27 docs, instead of the whole collection.
- A 30-second interval recomputes the visible window and the current minute. If the window changed, it re-subscribes. If the minute changed, it re-renders, so ended periods lose their Apply button.

### 6. Manage modal registers a redraw hook
While the Manage modal is open, it stores `{cellKey, draw}` in a module variable, which the cells snapshot handler calls. The hook is cleared when the modal closes. If the period gets closed from elsewhere, the modal closes itself.

### 7. Statistics fetched on demand
When the admin opens the sidebar, the app runs one `get()` of all `cells` plus one `get()` of all `requestDetails` (instrument lookup by id) and computes the stats. It shows "Loading…" until both return. Reading on demand rather than listening keeps free-tier reads low: each sidebar open costs one read per document.

### 8. Legacy documents
`getCell()` treats any doc without array `pending`/`confirmed` fields as closed and empty. The two existing legacy docs are deleted by hand in the Firebase console during deploy. Admin "Open" on a legacy doc overwrites it with the fresh shape.

## Risks / Trade-offs

- **[Deploy ordering]** Old page code with new rules means visitor applies fail (old entries contain instrument/note). New code with old rules also fails (there is no `requestDetails` rule). → Deploy the rules and the Vercel build within a minute or two of each other: publish the rules first, then merge. Admin actions keep working throughout.
- **[Rules list slicing]** `list[i:j]` equality and `existsAfter` inside the batch are core rules features, but they are easy to get subtly wrong. → Emulator tests cover each spec scenario (task 1). If no JDK is available, the Firebase console Rules Playground is used for the same cases.
- **[Stats reads grow]** Each sidebar open reads every historical document. At a few hundred docs a week this stays well inside the free 50k reads/day for a long time. → A future change can add a precomputed summary doc if needed.
- **[Clock-based "ended"]** A visitor whose device clock is wrong could still apply to an ended period. → The admin still reviews every request. This is accepted.
- **[Display name]** Changing the display name later doesn't rewrite supervisor names on already-open periods. → This is acceptable, and matches how approved supervisors behave.

## Migration Plan

1. Merge nothing yet. Run the rules tests (emulator or Playground) against the new `firestore.rules`.
2. In the Firebase console, delete `cells/2026-09-18_br` and `cells/2026-09-19_p2`.
3. Publish the new `firestore.rules` in the console.
4. Immediately merge the PR to `main`. Vercel redeploys in about 1 minute.
5. Smoke test on the live site: visitor applies, admin accepts, admin closes and re-opens, stats show.

**Rollback:** re-publish the previous rules (kept in git history) and revert the merge commit. New `requestDetails` docs are harmless to the old code.
