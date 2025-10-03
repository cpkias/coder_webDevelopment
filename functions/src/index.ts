/**
 * Cloud Functions for College Event Management
 * Handles email notifications and automated tasks
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';

// Initialize Firebase Admin
admin.initializeApp();

// Initialize SendGrid
const SENDGRID_API_KEY = functions.config().sendgrid?.api_key || process.env.SENDGRID_API_KEY;
const FROM_EMAIL = functions.config().sendgrid?.from_email || process.env.SENDGRID_FROM_EMAIL || 'noreply@eventhub.edu';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

/**
 * Send email using SendGrid
 */
async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!SENDGRID_API_KEY) {
    console.log('SendGrid not configured. Email would be sent to:', to);
    console.log('Subject:', subject);
    console.log('Content:', html);
    return;
  }

  const msg = {
    to,
    from: FROM_EMAIL,
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Trigger: When a user registers for an event
 * Action: Send confirmation email and create notification
 */
export const onEventRegistration = functions.firestore
  .document('registrations/{registrationId}')
  .onCreate(async (snap, context) => {
    const registration = snap.data();
    const { userId, userEmail, userName, eventId, eventTitle, eventDateTime } = registration;

    try {
      // Get event details
      const eventDoc = await admin.firestore().collection('events').doc(eventId).get();
      const event = eventDoc.data();

      if (!event) {
        console.error('Event not found:', eventId);
        return;
      }

      // Format event date
      const eventDate = eventDateTime.toDate();
      const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      // Send email confirmation
      const emailSubject = `Registration Confirmed: ${eventTitle}`;
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0ea5e9; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .event-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #0ea5e9; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
            .button { display: inline-block; padding: 12px 24px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Registration Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Your registration for <strong>${eventTitle}</strong> has been confirmed!</p>
              
              <div class="event-details">
                <h2 style="color: #0ea5e9; margin-top: 0;">Event Details</h2>
                <div class="detail-row">
                  <span class="label">Event:</span> ${eventTitle}
                </div>
                <div class="detail-row">
                  <span class="label">Date & Time:</span> ${formattedDate}
                </div>
                <div class="detail-row">
                  <span class="label">Venue:</span> ${event.venue}
                </div>
                ${event.description ? `
                <div class="detail-row">
                  <span class="label">Description:</span><br>
                  ${event.description}
                </div>
                ` : ''}
              </div>

              <p>We're excited to see you there! Please arrive a few minutes early.</p>
              
              <p style="margin-top: 30px;">
                <strong>Important:</strong> Please save this email for your records. You may need to show this confirmation at the event.
              </p>

              <div class="footer">
                <p>This is an automated message from EventHub. Please do not reply to this email.</p>
                <p>© ${new Date().getFullYear()} EventHub. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendEmail(userEmail, emailSubject, emailHtml);

      // Create in-app notification
      await admin.firestore().collection('notifications').add({
        userId,
        type: 'registration_confirmed',
        title: 'Registration Confirmed',
        message: `You're registered for ${eventTitle} on ${formattedDate}`,
        data: { eventId, registrationId: snap.id },
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log('Registration confirmation sent to:', userEmail);
    } catch (error) {
      console.error('Error in onEventRegistration:', error);
    }
  });

/**
 * Trigger: When an organizer is approved
 * Action: Send approval email and notification
 */
export const onOrganizerApproval = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const userId = context.params.userId;

    // Check if user was just approved
    if (!before.isApproved && after.isApproved && after.role === 'organizer') {
      try {
        const emailSubject = 'Organizer Account Approved';
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; padding: 12px 24px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Account Approved!</h1>
              </div>
              <div class="content">
                <p>Hi ${after.displayName},</p>
                <p>Great news! Your organizer account has been approved.</p>
                <p>You can now:</p>
                <ul>
                  <li>Create and manage events</li>
                  <li>Track event registrations</li>
                  <li>Communicate with attendees</li>
                  <li>Access organizer dashboard</li>
                </ul>
                <p style="text-align: center;">
                  <a href="${process.env.VITE_APP_URL || 'http://localhost:5173'}/events/create" class="button">Create Your First Event</a>
                </p>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} EventHub. All rights reserved.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;

        await sendEmail(after.email, emailSubject, emailHtml);
        console.log('Organizer approval email sent to:', after.email);
      } catch (error) {
        console.error('Error in onOrganizerApproval:', error);
      }
    }
  });

/**
 * Scheduled function: Send event reminders 24 hours before event
 * Run daily at 9 AM
 */
export const sendEventReminders = functions.pubsub
  .schedule('0 9 * * *')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfterTomorrow = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    try {
      // Get events happening in the next 24-48 hours
      const eventsSnapshot = await admin
        .firestore()
        .collection('events')
        .where('dateTime', '>=', tomorrow)
        .where('dateTime', '<', dayAfterTomorrow)
        .get();

      for (const eventDoc of eventsSnapshot.docs) {
        const event = eventDoc.data();
        const eventId = eventDoc.id;

        // Get all registrations for this event
        const registrationsSnapshot = await admin
          .firestore()
          .collection('registrations')
          .where('eventId', '==', eventId)
          .get();

        for (const regDoc of registrationsSnapshot.docs) {
          const registration = regDoc.data();
          const eventDate = event.dateTime.toDate();
          const formattedDate = eventDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          // Send reminder email
          const emailSubject = `Reminder: ${event.title} Tomorrow`;
          const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .event-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>⏰ Event Reminder</h1>
                </div>
                <div class="content">
                  <p>Hi ${registration.userName},</p>
                  <p>This is a friendly reminder that you're registered for <strong>${event.title}</strong> tomorrow!</p>
                  
                  <div class="event-details">
                    <h2 style="color: #f59e0b; margin-top: 0;">Event Details</h2>
                    <p><strong>Date & Time:</strong> ${formattedDate}</p>
                    <p><strong>Venue:</strong> ${event.venue}</p>
                  </div>

                  <p>Don't forget to arrive a few minutes early. We look forward to seeing you!</p>

                  <div class="footer">
                    <p>© ${new Date().getFullYear()} EventHub. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `;

          await sendEmail(registration.userEmail, emailSubject, emailHtml);

          // Create in-app notification
          await admin.firestore().collection('notifications').add({
            userId: registration.userId,
            type: 'event_reminder',
            title: 'Event Reminder',
            message: `${event.title} is tomorrow at ${formattedDate}`,
            data: { eventId },
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        console.log(`Sent reminders for event: ${event.title}`);
      }

      return null;
    } catch (error) {
      console.error('Error in sendEventReminders:', error);
      return null;
    }
  });

/**
 * Trigger: When an event is updated
 * Action: Notify all registered users if important details changed
 */
export const onEventUpdate = functions.firestore
  .document('events/{eventId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const eventId = context.params.eventId;

    // Check if important fields changed
    const dateChanged = before.dateTime !== after.dateTime;
    const venueChanged = before.venue !== after.venue;

    if (dateChanged || venueChanged) {
      try {
        // Get all registrations for this event
        const registrationsSnapshot = await admin
          .firestore()
          .collection('registrations')
          .where('eventId', '==', eventId)
          .get();

        const changes: string[] = [];
        if (dateChanged) changes.push('date/time');
        if (venueChanged) changes.push('venue');

        for (const regDoc of registrationsSnapshot.docs) {
          const registration = regDoc.data();

          // Create notification
          await admin.firestore().collection('notifications').add({
            userId: registration.userId,
            type: 'event_updated',
            title: 'Event Updated',
            message: `${after.title} has been updated. Changes: ${changes.join(', ')}`,
            data: { eventId },
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        console.log(`Notified ${registrationsSnapshot.size} users about event update`);
      } catch (error) {
        console.error('Error in onEventUpdate:', error);
      }
    }
  });
