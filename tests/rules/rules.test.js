// Firestore rules tests — one test per scenario in
// openspec/changes/fix-bugs-and-harden-rules/specs/data-access-rules/spec.md
// Run: npm run emulate   (needs JDK 21+)
import { test, before, beforeEach, after } from 'node:test';
import { readFileSync } from 'node:fs';
import {
  initializeTestEnvironment, assertSucceeds, assertFails
} from '@firebase/rules-unit-testing';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const ADMIN_UID = 'TdvMfESAnahSxiSGdZvzOGEiAAV2';
const FV = firebase.firestore.FieldValue;
let env;

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-practice-rooms',
    firestore: { rules: readFileSync(new URL('../../firestore.rules', import.meta.url), 'utf8') }
  });
});
after(async () => { await env.cleanup(); });

const ann = { id: 'existing01', name: 'Ann', uid: 'ann-uid' };
const tenPeople = Array.from({ length: 10 }, (_, i) => ({ id: 'confirmed' + i, name: 'P' + i }));

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async ctx => {
    const db = ctx.firestore();
    const base = { supervisor: 'Mr Kim', confirmed: [], declinedIds: [], pendingUids: [], confirmedUids: [] };
    await db.doc('cells/open1').set({ ...base, status: 'open', pending: [ann], pendingUids: ['ann-uid'] });
    await db.doc('cells/closed1').set({ ...base, status: 'closed', pending: [] });
    await db.doc('cells/full1').set({ ...base, status: 'open', pending: [], confirmed: tenPeople });
    await db.doc('cells/in1').set({ ...base, status: 'open', pending: [], confirmed: [{ id: 'confirmedB', name: 'Bea', uid: 'bea-uid' }], confirmedUids: ['bea-uid'] });
    await db.doc('requestDetails/existing01').set({ cellId: 'open1', name: 'Ann', instrument: 'Piano', note: '', createdAt: new Date(), uid: 'ann-uid' });
  });
});

// Visitors are anonymous Firebase users: one uid per browser
let visitorCount = 0;
const visitor = (uid = 'visitor-' + (++visitorCount)) =>
  env.authenticatedContext(uid, { firebase: { sign_in_provider: 'anonymous' } }).firestore();
const nobody = () => env.unauthenticatedContext().firestore();
const admin = () => env.authenticatedContext(ADMIN_UID).firestore();

// The same batch the app sends when a visitor applies
function applyBatch(db, uid, cellId, id, name, detailOverrides = {}, entryOverrides = {}) {
  const batch = db.batch();
  batch.set(db.doc('requestDetails/' + id), {
    cellId, name, instrument: 'Violin', note: '', createdAt: FV.serverTimestamp(), uid, ...detailOverrides
  });
  batch.update(db.doc('cells/' + cellId), {
    pending: FV.arrayUnion({ id, name, uid, ...entryOverrides }),
    pendingUids: FV.arrayUnion(uid)
  });
  return batch.commit();
}
// Apply as a fresh visitor with its own uid
let applyCount = 0;
function applyAs(uid, cellId, id, name, detailOverrides, entryOverrides) {
  return applyBatch(visitor(uid), uid, cellId, id, name, detailOverrides, entryOverrides);
}
function applyFresh(cellId, id, name, detailOverrides, entryOverrides) {
  return applyAs('fresh-' + (++applyCount), cellId, id, name, detailOverrides, entryOverrides);
}

// ---- Visitors can only append their own request ----
test('visitor can apply to an open period', async () => {
  await assertSucceeds(applyFresh('open1', 'newRequest01', 'Ben'));
});

test('first applicant to a period with no pending requests succeeds', async () => {
  await env.withSecurityRulesDisabled(ctx => ctx.firestore().doc('cells/empty1').set({
    status: 'open', supervisor: 'Mr Kim', pending: [], confirmed: [], declinedIds: []
  }));
  await assertSucceeds(applyFresh('empty1', 'firstReq01', 'Zoe'));
});

test('two visitors applying at once both succeed', async () => {
  await Promise.all([
    assertSucceeds(applyFresh('open1', 'simultaneous1', 'Cat')),
    assertSucceeds(applyFresh('open1', 'simultaneous2', 'Dan'))
  ]);
  const snap = await admin().doc('cells/open1').get();
  if (snap.data().pending.length !== 3) throw new Error('expected 3 pending, got ' + snap.data().pending.length);
});

// ---- One live request per browser per period ----
test('the same browser cannot request the same period twice', async () => {
  await assertSucceeds(applyAs('same-uid', 'open1', 'firstTry01', 'Cal'));
  await assertFails(applyAs('same-uid', 'open1', 'secondTry1', 'Someone Else'));
});

test('a browser already in the room cannot request that period again', async () => {
  await assertFails(applyAs('bea-uid', 'in1', 'beaAgain01', 'Bea'));
});

test('a declined browser can request again', async () => {
  // Admin declines Ann: her entry and uid leave pending
  await assertSucceeds(admin().doc('cells/open1').update({ pending: [], pendingUids: [], declinedIds: ['existing01'] }));
  await assertSucceeds(applyAs('ann-uid', 'open1', 'annAgain01', 'Ann'));
});

test('the same browser can request different periods', async () => {
  await env.withSecurityRulesDisabled(ctx => ctx.firestore().doc('cells/open2').set({
    status: 'open', supervisor: 'Mr Kim', pending: [], confirmed: [], declinedIds: [], pendingUids: [], confirmedUids: []
  }));
  await assertSucceeds(applyAs('multi-uid', 'open1', 'multiOne01', 'Dee'));
  await assertSucceeds(applyAs('multi-uid', 'open2', 'multiTwo01', 'Dee'));
});

test('a visitor cannot apply under someone else\'s uid', async () => {
  await assertFails(applyBatch(visitor('real-uid'), 'fake-uid', 'open1', 'spoofed001', 'Eve'));
});

test('a visitor who is not signed in at all cannot apply', async () => {
  await assertFails(applyBatch(nobody(), 'no-uid', 'open1', 'noAuth0001', 'Nia'));
});

test('a visitor cannot skip adding their uid to pendingUids', async () => {
  const db = visitor('sneaky-uid');
  const batch = db.batch();
  batch.set(db.doc('requestDetails/sneaky0001'), { cellId: 'open1', name: 'Sy', instrument: '', note: '', createdAt: FV.serverTimestamp(), uid: 'sneaky-uid' });
  batch.update(db.doc('cells/open1'), { pending: FV.arrayUnion({ id: 'sneaky0001', name: 'Sy', uid: 'sneaky-uid' }) });
  await assertFails(batch.commit());
});

test('visitor cannot erase others\' requests even if the list grows by one', async () => {
  const db = visitor();
  const batch = db.batch();
  batch.set(db.doc('requestDetails/eraser0001'), { cellId: 'open1', name: 'Eve', instrument: '', note: '', createdAt: FV.serverTimestamp() });
  batch.update(db.doc('cells/open1'), { pending: [{ id: 'fakeentry01', name: 'X' }, { id: 'eraser0001', name: 'Eve' }] });
  await assertFails(batch.commit());
});

test('visitor cannot alter an existing entry', async () => {
  await assertFails(visitor().doc('cells/open1').update({ pending: [{ id: 'existing01', name: 'Hacked' }] }));
});

test('oversized name is rejected', async () => {
  await assertFails(applyFresh('open1', 'bigname001', 'x'.repeat(500)));
});

test('extra field in the public entry is rejected', async () => {
  await assertFails(applyFresh('open1', 'extrafld01', 'Fay', {}, { instrument: 'Cello' }));
});

test('oversized reason in details is rejected', async () => {
  await assertFails(applyFresh('open1', 'bignote001', 'Gus', { note: 'x'.repeat(201) }));
});

test('visitor cannot apply to a closed period', async () => {
  await assertFails(applyFresh('closed1', 'toclosed01', 'Hal'));
});

test('visitor cannot apply to a full period', async () => {
  await assertFails(applyFresh('full1', 'tofull0001', 'Ivy'));
});

test('cell entry without a new details doc is rejected', async () => {
  await assertFails(visitor().doc('cells/open1').update({ pending: FV.arrayUnion({ id: 'nodetails1', name: 'Jo' }) }));
});

test('reusing an existing details id is rejected', async () => {
  await assertFails(visitor().doc('cells/open1').update({ pending: FV.arrayUnion({ id: 'existing01', name: 'Ann' }) }));
});

test('details doc without a matching pending entry is rejected', async () => {
  await assertFails(visitor().doc('requestDetails/orphan0001').set({
    cellId: 'open1', name: 'Kim', instrument: '', note: '', createdAt: FV.serverTimestamp()
  }));
});

// ---- Only the admin changes period state ----
test('visitor cannot confirm themselves', async () => {
  await assertFails(visitor().doc('cells/open1').update({ confirmed: FV.arrayUnion({ id: 'selfconfrm', name: 'Lu' }) }));
});

test('visitor cannot set declinedIds', async () => {
  await assertFails(visitor().doc('cells/open1').update({ declinedIds: ['existing01'] }));
});

test('visitor cannot open a closed period or create one', async () => {
  await assertFails(visitor().doc('cells/closed1').update({ status: 'open' }));
  await assertFails(visitor().doc('cells/new1').set({ status: 'open', supervisor: '', pending: [], confirmed: [], declinedIds: [] }));
});

test('admin can change period state', async () => {
  await assertSucceeds(admin().doc('cells/open1').update({ status: 'closed', pending: [], declinedIds: ['existing01'] }));
});

// ---- Applicant details are private ----
test('anyone can read a period', async () => {
  await assertSucceeds(visitor().doc('cells/open1').get());
});

test('visitor cannot read, change or delete details', async () => {
  await assertFails(visitor().doc('requestDetails/existing01').get());
  await assertFails(visitor().doc('requestDetails/existing01').update({ note: 'x' }));
  await assertFails(visitor().doc('requestDetails/existing01').delete());
});

test('admin can read details', async () => {
  await assertSucceeds(admin().doc('requestDetails/existing01').get());
  await assertSucceeds(admin().collection('requestDetails').get());
});

// ---- Supervisor applications are validated ----
test('valid supervisor application is accepted', async () => {
  await assertSucceeds(visitor().collection('supervisorApps').add({ name: 'Mo', message: 'Happy to help', ts: FV.serverTimestamp() }));
});

test('oversized supervisor application is rejected', async () => {
  await assertFails(visitor().collection('supervisorApps').add({ name: 'Mo', message: 'x'.repeat(5000), ts: FV.serverTimestamp() }));
});

test('visitor cannot read supervisor applications', async () => {
  await assertFails(visitor().collection('supervisorApps').get());
});
