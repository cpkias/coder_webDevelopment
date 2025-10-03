import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';

admin.initializeApp();
const db = admin.firestore();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
if (SENDGRID_API_KEY) sgMail.setApiKey(SENDGRID_API_KEY);

export const onRegistrationCreated = onDocumentCreated('events/{eventId}/registrations/{uid}', async (event) => {
  const { eventId, uid } = event.params as { eventId: string; uid: string };
  const eventDoc = await db.doc(`events/${eventId}`).get();
  const userDoc = await db.doc(`users/${uid}`).get();

  const eventData = eventDoc.data() as any;
  const userData = userDoc.data() as any;
  if (!eventData || !userData) return;

  await db.collection('notifications').add({
    userId: uid,
    type: 'registration_confirmed',
    eventId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    read: false,
    message: `You are registered for ${eventData.title}.`,
  });

  if (SENDGRID_API_KEY && userData.email) {
    await sgMail.send({
      to: userData.email,
      from: 'noreply@college-events.example',
      subject: `Registration Confirmed: ${eventData.title}`,
      text: `You're registered for ${eventData.title} at ${eventData.startAt}.`,
    });
  }
});

export const sendEventReminders = onSchedule('every 24 hours', async () => {
  const now = new Date();
  const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const q = await db.collection('events')
    .where('status', '==', 'published')
    .where('startAt', '>=', now.toISOString())
    .where('startAt', '<=', soon.toISOString())
    .get();

  for (const docSnap of q.docs) {
    const ev = docSnap.data() as any;
    const regs = await db.collection(`events/${docSnap.id}/registrations`).get();
    for (const r of regs.docs) {
      const uid = r.id;
      const userDoc = await db.doc(`users/${uid}`).get();
      const userData = userDoc.data() as any;
      if (!userData?.email) continue;
      if (SENDGRID_API_KEY) {
        await sgMail.send({
          to: userData.email,
          from: 'noreply@college-events.example',
          subject: `Reminder: ${ev.title} starts soon`,
          text: `Reminder: ${ev.title} starts at ${ev.startAt}.`,
        });
      }
    }
  }
  return null;
});
