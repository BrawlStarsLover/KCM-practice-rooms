# Design

## Context

This builds on `fix-bugs-and-harden-rules` (rules, transactions, scoped listener) and `jazz-redesign-theme-toggle` (UI). Both are merged and live but not archived. Firestore rules can only test exact membership in lists (`x in list`), not "any map in this list has field = x". That is why the uid checks need flat mirror lists.

## Goals / Non-Goals

**Goals:** server-enforced one-live-request-per-browser-per-period; reliable live updates on phones and background tabs; small UI fixes.

**Non-Goals:** real student accounts. Clearing site data or using a private window gives a new anonymous identity; this is accepted. Limits across periods or days are also out of scope.

## Decisions

### 1. Anonymous Firebase Auth as the browser identity
Visitors are signed in with `signInAnonymously()` on page load (no UI). Firebase keeps the identity in the browser's storage. The admin's email sign-in replaces it on the admin's own device, which is fine. *Alternative:* a random id in localStorage. Rejected, because the rules can't trust a client-chosen id; `request.auth.uid` can't be forged.

### 2. Uid on entries plus flat mirror lists
- Entries become `{id, name, uid}`.
- The cell gains `pendingUids` and `confirmedUids`, always recomputed from the entries inside every admin transaction.
- A visitor append must add its own uid to `pendingUids`, which must grow by exactly one. The rules require `request.auth.uid` to be absent from both mirrors beforehand.
- Declining or removing drops the uid from the mirror, so the visitor can apply again.
- Old entries without a uid stay valid; they're just not protected.

### 3. Outcome shown from data
"You're in" and "Requested" are derived from the visitor's uid in `confirmed`/`pending`. "Not accepted" uses the request id remembered locally (`pr-requests`) found in `declinedIds`. Nothing extra is stored.

### 4. Reconnect on resume
On `visibilitychange` (after more than 5 s hidden), `online`, and `pageshow` with `persisted`, the page calls `db.disableNetwork()` then `enableNetwork()`. This makes the SDK drop any half-dead stream and resubscribe immediately, instead of waiting out its reconnect backoff.

### 5. Admin writes apply their own result
`mutateCell` returns the document it wrote. After commit, it's put into the local `cells` and rendered, so the admin never depends on the listener to see their own change. The per-period queue from the redesign stays.

### 6. Admin panel built once
The overlay is created on open. Later updates only replace the panel's contents when they changed, so the slide-in plays once and focus stays inside.

## Risks / Trade-offs

- **[Anonymous provider disabled]** Visitors couldn't sign in, and every apply would fail. → The provider is enabled before the rules are published (deploy step 1). The page shows "Could not connect — please reload" rather than failing silently.
- **[Deploy window]** As before, there's a brief window where the old page and new rules mismatch. → Publish the rules, then merge immediately.
- **[Anonymous user accounts pile up]** Firebase keeps anonymous users indefinitely. That's free and harmless at this scale.

## Migration Plan

1. Enable Firebase Authentication → Sign-in method → **Anonymous**.
2. Publish the new `firestore.rules`.
3. Merge the PR. Vercel deploys in about a minute.
4. Smoke test: apply from a phone → Requested; admin accepts → the phone shows "You're in" without a reload; applying again isn't possible.

**Rollback:** revert the merge and republish the previous rules. The extra fields are ignored by the old code.
