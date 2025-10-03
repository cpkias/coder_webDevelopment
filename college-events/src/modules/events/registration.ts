import { doc, increment, runTransaction, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/services/firebase';
import { getAuth } from 'firebase/auth';

export async function registerForEvent(eventId: string) {
  const uid = getAuth().currentUser?.uid;
  if (!uid) throw new Error('Not signed in');
  const eventRef = doc(firestore, 'events', eventId);
  const regRef = doc(firestore, 'events', eventId, 'registrations', uid);
  await runTransaction(firestore, async (tx) => {
    const eventSnap = await tx.get(eventRef);
    if (!eventSnap.exists()) throw new Error('Event missing');
    const data = eventSnap.data() as any;
    const now = Date.now();
    if (new Date(data.registrationDeadline).getTime() <= now) throw new Error('Registration closed');
    if (data.attendeeCount >= data.capacity) throw new Error('Event full');

    const regSnap = await tx.get(regRef);
    if (regSnap.exists()) throw new Error('Already registered');

    tx.set(regRef, { createdAt: serverTimestamp(), userId: uid });
    tx.update(eventRef, { attendeeCount: increment(1) });
  });
}

export async function unregisterFromEvent(eventId: string) {
  const uid = getAuth().currentUser?.uid;
  if (!uid) throw new Error('Not signed in');
  const eventRef = doc(firestore, 'events', eventId);
  const regRef = doc(firestore, 'events', eventId, 'registrations', uid);
  await runTransaction(firestore, async (tx) => {
    const regSnap = await tx.get(regRef);
    if (!regSnap.exists()) return;
    tx.delete(regRef);
    tx.update(eventRef, { attendeeCount: increment(-1) });
  });
}
