# Tasks

## 1. Rules

- [x] 1.1 Visitor append requires anonymous auth, `uid` on the entry and details, and a one-step `pendingUids` growth with the uid absent from both mirrors; verify with `tests/rules/emulate.sh` (30/30, including twice, already-in, declined-reapply, other-period, spoofed uid, signed-out and skipped-mirror cases)

## 2. Page

- [x] 2.1 Anonymous sign-in on load and before applying, a uid on new requests, duplicate-name and already-requested checks; verify in a separate-origin visitor tab that applying shows Requested, the Apply button disappears, and a direct second request is rejected
- [x] 2.2 "You're in" / "Not accepted · apply again" states and the legend entry; verify the visitor tab updates live when the admin accepts and then removes them, and that re-applying works
- [x] 2.3 Admin transactions keep `pendingUids`/`confirmedUids` in sync and apply their result locally; verify accept shows in about 0.2 s and three rapid removals all apply, with confirmedUids matching
- [x] 2.4 Reconnect on visibility (more than 5 s hidden), `online` and `pageshow`; verify live updates still arrive after a disable/enable-network cycle in both tabs
- [x] 2.5 Admin panel built once and updated in place; verify the overlay is created exactly once when opening, and the same element stays after the stats load
- [x] 2.6 Theme Light/Dark only (pre-paint, segmented control, phone toggle), with the first visit following the device once; verify the buttons are light and dark only and the phone toggle alternates

## 3. Ship

- [ ] 3.1 Commit, push and open a PR; verify the Vercel preview builds
- [ ] 3.2 With the owner: enable Anonymous sign-in, publish the rules, merge; verify the live smoke test in design.md
