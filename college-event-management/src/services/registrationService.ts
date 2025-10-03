import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  runTransaction,
} from 'firebase/firestore';
import { db } from './firebase';
import { Registration, Event } from '../types';

export class RegistrationService {
  private static instance: RegistrationService;
  private registrationsCollection = collection(db, 'registrations');

  static getInstance(): RegistrationService {
    if (!RegistrationService.instance) {
      RegistrationService.instance = new RegistrationService();
    }
    return RegistrationService.instance;
  }

  // Register user for an event
  async registerForEvent(eventId: string, userId: string, userName: string, userEmail: string): Promise<string> {
    try {
      // Use transaction to ensure consistency
      const registrationId = await runTransaction(db, async (transaction) => {
        // Check if user is already registered
        const existingRegistrationQuery = query(
          this.registrationsCollection,
          where('eventId', '==', eventId),
          where('userId', '==', userId),
          where('status', '==', 'registered')
        );
        
        const existingRegistrations = await getDocs(existingRegistrationQuery);
        if (!existingRegistrations.empty) {
          throw new Error('You are already registered for this event');
        }

        // Get event details
        const eventRef = doc(db, 'events', eventId);
        const eventDoc = await transaction.get(eventRef);
        
        if (!eventDoc.exists()) {
          throw new Error('Event not found');
        }

        const event = eventDoc.data() as Event;

        // Check if event is active and approved
        if (!event.isActive || !event.isApproved) {
          throw new Error('This event is not available for registration');
        }

        // Check capacity
        if (event.currentRegistrations >= event.capacity) {
          throw new Error('This event is full');
        }

        // Check registration deadline
        const now = new Date();
        const deadline = event.registrationDeadline.toDate();
        if (now > deadline) {
          throw new Error('Registration deadline has passed');
        }

        // Check if event has already started
        const eventStart = event.startDate.toDate();
        if (now > eventStart) {
          throw new Error('This event has already started');
        }

        // Create registration
        const registration: Omit<Registration, 'id'> = {
          eventId,
          userId,
          userName,
          userEmail,
          registeredAt: Timestamp.now(),
          status: 'registered',
        };

        const registrationRef = doc(this.registrationsCollection);
        transaction.set(registrationRef, registration);

        // Update event registration count (this will be handled by Cloud Function)
        // But we'll do it here as backup
        transaction.update(eventRef, {
          currentRegistrations: event.currentRegistrations + 1,
        });

        return registrationRef.id;
      });

      return registrationId;
    } catch (error: any) {
      console.error('Error registering for event:', error);
      throw new Error(error.message || 'Failed to register for event');
    }
  }

  // Cancel registration
  async cancelRegistration(eventId: string, userId: string): Promise<void> {
    try {
      await runTransaction(db, async (transaction) => {
        // Find the registration
        const registrationQuery = query(
          this.registrationsCollection,
          where('eventId', '==', eventId),
          where('userId', '==', userId),
          where('status', '==', 'registered')
        );

        const registrationSnapshot = await getDocs(registrationQuery);
        if (registrationSnapshot.empty) {
          throw new Error('Registration not found');
        }

        const registrationDoc = registrationSnapshot.docs[0];
        const registrationRef = doc(db, 'registrations', registrationDoc.id);

        // Update registration status
        transaction.update(registrationRef, {
          status: 'cancelled',
        });

        // Update event registration count
        const eventRef = doc(db, 'events', eventId);
        const eventDoc = await transaction.get(eventRef);
        
        if (eventDoc.exists()) {
          const event = eventDoc.data() as Event;
          transaction.update(eventRef, {
            currentRegistrations: Math.max(0, event.currentRegistrations - 1),
          });
        }
      });
    } catch (error: any) {
      console.error('Error cancelling registration:', error);
      throw new Error(error.message || 'Failed to cancel registration');
    }
  }

  // Check if user is registered for an event
  async isUserRegistered(eventId: string, userId: string): Promise<boolean> {
    try {
      const q = query(
        this.registrationsCollection,
        where('eventId', '==', eventId),
        where('userId', '==', userId),
        where('status', '==', 'registered')
      );

      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking registration status:', error);
      return false;
    }
  }

  // Get user's registrations
  async getUserRegistrations(userId: string): Promise<Registration[]> {
    try {
      const q = query(
        this.registrationsCollection,
        where('userId', '==', userId),
        orderBy('registeredAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Registration[];
    } catch (error) {
      console.error('Error getting user registrations:', error);
      throw new Error('Failed to get user registrations');
    }
  }

  // Get event registrations (for organizers/admins)
  async getEventRegistrations(eventId: string): Promise<Registration[]> {
    try {
      const q = query(
        this.registrationsCollection,
        where('eventId', '==', eventId),
        orderBy('registeredAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Registration[];
    } catch (error) {
      console.error('Error getting event registrations:', error);
      throw new Error('Failed to get event registrations');
    }
  }

  // Update registration status (for organizers/admins)
  async updateRegistrationStatus(registrationId: string, status: 'registered' | 'cancelled' | 'attended'): Promise<void> {
    try {
      const registrationRef = doc(db, 'registrations', registrationId);
      await updateDoc(registrationRef, {
        status,
      });
    } catch (error) {
      console.error('Error updating registration status:', error);
      throw new Error('Failed to update registration status');
    }
  }

  // Get registration statistics for an event
  async getEventRegistrationStats(eventId: string): Promise<{
    total: number;
    registered: number;
    cancelled: number;
    attended: number;
  }> {
    try {
      const registrations = await this.getEventRegistrations(eventId);
      
      const stats = {
        total: registrations.length,
        registered: registrations.filter(r => r.status === 'registered').length,
        cancelled: registrations.filter(r => r.status === 'cancelled').length,
        attended: registrations.filter(r => r.status === 'attended').length,
      };

      return stats;
    } catch (error) {
      console.error('Error getting registration stats:', error);
      throw new Error('Failed to get registration statistics');
    }
  }

  // Get user's upcoming events
  async getUserUpcomingEvents(userId: string): Promise<Event[]> {
    try {
      const registrations = await this.getUserRegistrations(userId);
      const activeRegistrations = registrations.filter(r => r.status === 'registered');
      
      const events: Event[] = [];
      const now = new Date();

      for (const registration of activeRegistrations) {
        const eventDoc = await getDoc(doc(db, 'events', registration.eventId));
        if (eventDoc.exists()) {
          const event = { id: eventDoc.id, ...eventDoc.data() } as Event;
          const eventStart = event.startDate.toDate();
          
          // Only include future events
          if (eventStart > now) {
            events.push(event);
          }
        }
      }

      // Sort by start date
      events.sort((a, b) => a.startDate.toDate().getTime() - b.startDate.toDate().getTime());
      
      return events;
    } catch (error) {
      console.error('Error getting user upcoming events:', error);
      throw new Error('Failed to get upcoming events');
    }
  }
}

export const registrationService = RegistrationService.getInstance();