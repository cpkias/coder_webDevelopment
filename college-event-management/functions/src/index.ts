import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize SendGrid
const sendGridApiKey = functions.config().sendgrid?.api_key;
if (sendGridApiKey) {
  sgMail.setApiKey(sendGridApiKey);
}

const db = admin.firestore();

/**
 * Send email notification when user registers for an event
 */
export const sendRegistrationConfirmation = functions.firestore
  .document('registrations/{registrationId}')
  .onCreate(async (snap, context) => {
    try {
      const registration = snap.data();
      const { eventId, userId, userEmail, userName } = registration;

      // Get event details
      const eventDoc = await db.collection('events').doc(eventId).get();
      if (!eventDoc.exists) {
        console.error('Event not found:', eventId);
        return;
      }

      const event = eventDoc.data();
      if (!event) return;

      // Create in-app notification
      await db.collection('notifications').add({
        userId,
        title: 'Registration Confirmed',
        message: `You have successfully registered for "${event.title}"`,
        type: 'success',
        isRead: false,
        eventId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Send email if SendGrid is configured
      if (sendGridApiKey && userEmail) {
        const msg = {
          to: userEmail,
          from: functions.config().sendgrid?.from_email || 'noreply@college.edu',
          subject: `Registration Confirmed - ${event.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1976d2;">Registration Confirmed!</h2>
              <p>Dear ${userName},</p>
              <p>You have successfully registered for the following event:</p>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #333;">${event.title}</h3>
                <p><strong>Date:</strong> ${event.startDate.toDate().toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${event.startDate.toDate().toLocaleTimeString()}</p>
                <p><strong>Venue:</strong> ${event.venue}</p>
                <p><strong>Description:</strong> ${event.description}</p>
              </div>
              
              <p>Please save this confirmation email for your records.</p>
              <p>If you need to cancel your registration, please log in to your account and manage your registrations.</p>
              
              <p>Best regards,<br>College Event Management Team</p>
            </div>
          `,
        };

        await sgMail.send(msg);
        console.log('Registration confirmation email sent to:', userEmail);
      }

      // Update event registration count
      await db.collection('events').doc(eventId).update({
        currentRegistrations: admin.firestore.FieldValue.increment(1),
      });

    } catch (error) {
      console.error('Error sending registration confirmation:', error);
    }
  });

/**
 * Send email reminder 24 hours before event
 */
export const sendEventReminders = functions.pubsub
  .schedule('every day 09:00')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      // Find events happening tomorrow
      const eventsSnapshot = await db.collection('events')
        .where('startDate', '>=', admin.firestore.Timestamp.fromDate(tomorrow))
        .where('startDate', '<', admin.firestore.Timestamp.fromDate(dayAfterTomorrow))
        .where('isActive', '==', true)
        .where('isApproved', '==', true)
        .get();

      for (const eventDoc of eventsSnapshot.docs) {
        const event = eventDoc.data();
        const eventId = eventDoc.id;

        // Get all registrations for this event
        const registrationsSnapshot = await db.collection('registrations')
          .where('eventId', '==', eventId)
          .where('status', '==', 'registered')
          .get();

        for (const regDoc of registrationsSnapshot.docs) {
          const registration = regDoc.data();

          // Create in-app notification
          await db.collection('notifications').add({
            userId: registration.userId,
            title: 'Event Reminder',
            message: `Don't forget! "${event.title}" is tomorrow at ${event.startDate.toDate().toLocaleTimeString()}`,
            type: 'info',
            isRead: false,
            eventId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          // Send email reminder if configured
          if (sendGridApiKey && registration.userEmail) {
            const msg = {
              to: registration.userEmail,
              from: functions.config().sendgrid?.from_email || 'noreply@college.edu',
              subject: `Reminder: ${event.title} is Tomorrow!`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #1976d2;">Event Reminder</h2>
                  <p>Dear ${registration.userName},</p>
                  <p>This is a friendly reminder that you're registered for the following event happening tomorrow:</p>
                  
                  <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #333;">${event.title}</h3>
                    <p><strong>Date:</strong> ${event.startDate.toDate().toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${event.startDate.toDate().toLocaleTimeString()}</p>
                    <p><strong>Venue:</strong> ${event.venue}</p>
                  </div>
                  
                  <p>We look forward to seeing you there!</p>
                  
                  <p>Best regards,<br>College Event Management Team</p>
                </div>
              `,
            };

            await sgMail.send(msg);
          }
        }
      }

      console.log('Event reminders sent successfully');
    } catch (error) {
      console.error('Error sending event reminders:', error);
    }
  });

/**
 * Handle registration cancellation
 */
export const handleRegistrationCancellation = functions.firestore
  .document('registrations/{registrationId}')
  .onUpdate(async (change, context) => {
    try {
      const before = change.before.data();
      const after = change.after.data();

      // Check if status changed to cancelled
      if (before.status !== 'cancelled' && after.status === 'cancelled') {
        const { eventId, userId, userEmail, userName } = after;

        // Create in-app notification
        await db.collection('notifications').add({
          userId,
          title: 'Registration Cancelled',
          message: `Your registration has been cancelled for the event`,
          type: 'info',
          isRead: false,
          eventId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Update event registration count
        await db.collection('events').doc(eventId).update({
          currentRegistrations: admin.firestore.FieldValue.increment(-1),
        });

        console.log('Registration cancelled and count updated');
      }
    } catch (error) {
      console.error('Error handling registration cancellation:', error);
    }
  });

/**
 * Send notification when event is approved
 */
export const notifyEventApproval = functions.firestore
  .document('events/{eventId}')
  .onUpdate(async (change, context) => {
    try {
      const before = change.before.data();
      const after = change.after.data();

      // Check if event was approved
      if (!before.isApproved && after.isApproved) {
        const { organizerId, title } = after;

        // Create notification for organizer
        await db.collection('notifications').add({
          userId: organizerId,
          title: 'Event Approved',
          message: `Your event "${title}" has been approved and is now live!`,
          type: 'success',
          isRead: false,
          eventId: context.params.eventId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log('Event approval notification sent');
      }
    } catch (error) {
      console.error('Error sending event approval notification:', error);
    }
  });

/**
 * Clean up old notifications (run weekly)
 */
export const cleanupOldNotifications = functions.pubsub
  .schedule('every sunday 02:00')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const oldNotifications = await db.collection('notifications')
        .where('createdAt', '<', admin.firestore.Timestamp.fromDate(thirtyDaysAgo))
        .get();

      const batch = db.batch();
      oldNotifications.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`Cleaned up ${oldNotifications.size} old notifications`);
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
    }
  });