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
  limit,
  startAfter,
  Timestamp,
  DocumentSnapshot,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { Event, EventFormData, EventFilters, SearchParams, PaginatedResponse } from '../types';

export class EventService {
  private static instance: EventService;
  private eventsCollection = collection(db, 'events');

  static getInstance(): EventService {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }
    return EventService.instance;
  }

  // Create a new event
  async createEvent(eventData: EventFormData, organizerId: string, organizerName: string): Promise<string> {
    try {
      const event: Omit<Event, 'id'> = {
        ...eventData,
        startDate: Timestamp.fromDate(eventData.startDate),
        endDate: Timestamp.fromDate(eventData.endDate),
        registrationDeadline: Timestamp.fromDate(eventData.registrationDeadline),
        organizerId,
        organizerName,
        currentRegistrations: 0,
        images: [],
        isActive: true,
        isApproved: false, // Requires admin approval
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(this.eventsCollection, event);
      return docRef.id;
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  }

  // Get event by ID
  async getEvent(eventId: string): Promise<Event | null> {
    try {
      const eventDoc = await getDoc(doc(db, 'events', eventId));
      if (eventDoc.exists()) {
        return { id: eventDoc.id, ...eventDoc.data() } as Event;
      }
      return null;
    } catch (error) {
      console.error('Error getting event:', error);
      throw new Error('Failed to get event');
    }
  }

  // Update event
  async updateEvent(eventId: string, updates: Partial<EventFormData>): Promise<void> {
    try {
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      // Convert dates to Timestamps if present
      if (updates.startDate) {
        updateData.startDate = Timestamp.fromDate(updates.startDate);
      }
      if (updates.endDate) {
        updateData.endDate = Timestamp.fromDate(updates.endDate);
      }
      if (updates.registrationDeadline) {
        updateData.registrationDeadline = Timestamp.fromDate(updates.registrationDeadline);
      }

      await updateDoc(doc(db, 'events', eventId), updateData);
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  }

  // Delete event
  async deleteEvent(eventId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'events', eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  }

  // Get events with filters and pagination
  async getEvents(params: SearchParams = {}): Promise<PaginatedResponse<Event>> {
    try {
      const {
        query: searchQuery,
        filters = {},
        sortBy = 'startDate',
        sortOrder = 'asc',
        limit: pageLimit = 10,
      } = params;

      let q = query(this.eventsCollection);

      // Apply filters
      if (filters.isActive !== undefined) {
        q = query(q, where('isActive', '==', filters.isActive));
      }

      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }

      if (filters.organizerId) {
        q = query(q, where('organizerId', '==', filters.organizerId));
      }

      if (filters.startDate) {
        q = query(q, where('startDate', '>=', Timestamp.fromDate(filters.startDate)));
      }

      if (filters.endDate) {
        q = query(q, where('startDate', '<=', Timestamp.fromDate(filters.endDate)));
      }

      // Apply sorting
      q = query(q, orderBy(sortBy, sortOrder));

      // Apply limit
      q = query(q, limit(pageLimit + 1)); // Get one extra to check if there are more

      const snapshot = await getDocs(q);
      const events = snapshot.docs.slice(0, pageLimit).map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      // Filter by search query if provided (client-side filtering for text search)
      let filteredEvents = events;
      if (searchQuery) {
        const queryLower = searchQuery.toLowerCase();
        filteredEvents = events.filter(event =>
          event.title.toLowerCase().includes(queryLower) ||
          event.description.toLowerCase().includes(queryLower) ||
          event.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
          event.venue.toLowerCase().includes(queryLower)
        );
      }

      return {
        data: filteredEvents,
        total: filteredEvents.length,
        page: 1,
        limit: pageLimit,
        hasMore: snapshot.docs.length > pageLimit,
      };
    } catch (error) {
      console.error('Error getting events:', error);
      throw new Error('Failed to get events');
    }
  }

  // Get events for organizer
  async getOrganizerEvents(organizerId: string): Promise<Event[]> {
    try {
      const q = query(
        this.eventsCollection,
        where('organizerId', '==', organizerId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
    } catch (error) {
      console.error('Error getting organizer events:', error);
      throw new Error('Failed to get organizer events');
    }
  }

  // Get upcoming events
  async getUpcomingEvents(limitCount: number = 10): Promise<Event[]> {
    try {
      const now = Timestamp.now();
      const q = query(
        this.eventsCollection,
        where('isActive', '==', true),
        where('isApproved', '==', true),
        where('startDate', '>', now),
        orderBy('startDate', 'asc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
    } catch (error) {
      console.error('Error getting upcoming events:', error);
      throw new Error('Failed to get upcoming events');
    }
  }

  // Upload event image
  async uploadEventImage(eventId: string, file: File): Promise<string> {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const imageRef = ref(storage, `events/${eventId}/images/${fileName}`);
      
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      
      // Update event with new image URL
      const event = await this.getEvent(eventId);
      if (event) {
        const updatedImages = [...event.images, downloadURL];
        await updateDoc(doc(db, 'events', eventId), {
          images: updatedImages,
          updatedAt: Timestamp.now(),
        });
      }
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading event image:', error);
      throw new Error('Failed to upload image');
    }
  }

  // Delete event image
  async deleteEventImage(eventId: string, imageUrl: string): Promise<void> {
    try {
      // Delete from storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      
      // Update event to remove image URL
      const event = await this.getEvent(eventId);
      if (event) {
        const updatedImages = event.images.filter(img => img !== imageUrl);
        await updateDoc(doc(db, 'events', eventId), {
          images: updatedImages,
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error('Error deleting event image:', error);
      throw new Error('Failed to delete image');
    }
  }

  // Approve event (admin only)
  async approveEvent(eventId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'events', eventId), {
        isApproved: true,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error approving event:', error);
      throw new Error('Failed to approve event');
    }
  }

  // Get events pending approval
  async getPendingEvents(): Promise<Event[]> {
    try {
      const q = query(
        this.eventsCollection,
        where('isApproved', '==', false),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
    } catch (error) {
      console.error('Error getting pending events:', error);
      throw new Error('Failed to get pending events');
    }
  }
}

export const eventService = EventService.getInstance();