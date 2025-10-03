/**
 * Event Service
 * Handles CRUD operations for events
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/config/firebase';

const EVENTS_COLLECTION = 'events';
const REGISTRATIONS_COLLECTION = 'registrations';

/**
 * Create a new event
 */
export const createEvent = async (eventData, images = []) => {
  try {
    // Upload images to Storage
    const imageUrls = await Promise.all(
      images.map(async (image, index) => {
        const imageRef = ref(storage, `events/${Date.now()}_${index}_${image.name}`);
        await uploadBytes(imageRef, image);
        return await getDownloadURL(imageRef);
      })
    );

    const eventDoc = {
      ...eventData,
      images: imageUrls,
      registrationCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), eventDoc);
    return { id: docRef.id, ...eventDoc };
  } catch (error) {
    throw new Error(`Failed to create event: ${error.message}`);
  }
};

/**
 * Update an existing event
 */
export const updateEvent = async (eventId, eventData, newImages = [], removedImageUrls = []) => {
  try {
    // Delete removed images from Storage
    await Promise.all(
      removedImageUrls.map(async (url) => {
        try {
          const imageRef = ref(storage, url);
          await deleteObject(imageRef);
        } catch (err) {
          console.warn('Failed to delete image:', err);
        }
      })
    );

    // Upload new images
    const newImageUrls = await Promise.all(
      newImages.map(async (image, index) => {
        const imageRef = ref(storage, `events/${Date.now()}_${index}_${image.name}`);
        await uploadBytes(imageRef, image);
        return await getDownloadURL(imageRef);
      })
    );

    const existingImages = eventData.images?.filter((url) => !removedImageUrls.includes(url)) || [];
    const allImages = [...existingImages, ...newImageUrls];

    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    await updateDoc(eventRef, {
      ...eventData,
      images: allImages,
      updatedAt: serverTimestamp(),
    });

    return { id: eventId, ...eventData, images: allImages };
  } catch (error) {
    throw new Error(`Failed to update event: ${error.message}`);
  }
};

/**
 * Delete an event
 */
export const deleteEvent = async (eventId) => {
  try {
    // Get event to access images
    const eventDoc = await getDoc(doc(db, EVENTS_COLLECTION, eventId));
    if (eventDoc.exists()) {
      const eventData = eventDoc.data();

      // Delete images from Storage
      if (eventData.images && eventData.images.length > 0) {
        await Promise.all(
          eventData.images.map(async (url) => {
            try {
              const imageRef = ref(storage, url);
              await deleteObject(imageRef);
            } catch (err) {
              console.warn('Failed to delete image:', err);
            }
          })
        );
      }
    }

    // Delete event document
    await deleteDoc(doc(db, EVENTS_COLLECTION, eventId));

    // Delete all registrations for this event
    const registrationsQuery = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where('eventId', '==', eventId)
    );
    const registrationsSnapshot = await getDocs(registrationsQuery);
    await Promise.all(
      registrationsSnapshot.docs.map((doc) => deleteDoc(doc.ref))
    );
  } catch (error) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }
};

/**
 * Get event by ID
 */
export const getEventById = async (eventId) => {
  try {
    const eventDoc = await getDoc(doc(db, EVENTS_COLLECTION, eventId));
    if (eventDoc.exists()) {
      return { id: eventDoc.id, ...eventDoc.data() };
    }
    return null;
  } catch (error) {
    throw new Error(`Failed to get event: ${error.message}`);
  }
};

/**
 * Get events with filters and pagination
 */
export const getEvents = async (filters = {}, limitCount = 20, lastDoc = null) => {
  try {
    let q = collection(db, EVENTS_COLLECTION);
    const constraints = [];

    // Apply filters
    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }

    if (filters.venue) {
      constraints.push(where('venue', '==', filters.venue));
    }

    if (filters.organizerId) {
      constraints.push(where('organizerId', '==', filters.organizerId));
    }

    if (filters.startDate) {
      constraints.push(where('dateTime', '>=', filters.startDate));
    }

    if (filters.endDate) {
      constraints.push(where('dateTime', '<=', filters.endDate));
    }

    // Order by date (default)
    constraints.push(orderBy(filters.orderBy || 'dateTime', filters.orderDirection || 'asc'));

    // Pagination
    constraints.push(limit(limitCount));
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    q = query(q, ...constraints);
    const snapshot = await getDocs(q);

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      events,
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
      hasMore: snapshot.docs.length === limitCount,
    };
  } catch (error) {
    throw new Error(`Failed to get events: ${error.message}`);
  }
};

/**
 * Search events by title
 */
export const searchEvents = async (searchTerm) => {
  try {
    // Note: This is a basic implementation. For production, consider using Algolia or similar
    const q = query(
      collection(db, EVENTS_COLLECTION),
      orderBy('title'),
      limit(20)
    );
    const snapshot = await getDocs(q);

    const events = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );

    return events;
  } catch (error) {
    throw new Error(`Failed to search events: ${error.message}`);
  }
};

/**
 * Register user for an event
 */
export const registerForEvent = async (eventId, userId, userEmail, userName) => {
  try {
    // Check if already registered
    const existingQuery = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where('eventId', '==', eventId),
      where('userId', '==', userId)
    );
    const existingSnapshot = await getDocs(existingQuery);

    if (!existingSnapshot.empty) {
      throw new Error('You are already registered for this event');
    }

    // Check event capacity
    const eventDoc = await getDoc(doc(db, EVENTS_COLLECTION, eventId));
    if (!eventDoc.exists()) {
      throw new Error('Event not found');
    }

    const eventData = eventDoc.data();
    if (eventData.capacity && eventData.registrationCount >= eventData.capacity) {
      throw new Error('Event is at full capacity');
    }

    // Check registration deadline
    if (eventData.registrationDeadline) {
      const deadline = eventData.registrationDeadline.toDate();
      if (new Date() > deadline) {
        throw new Error('Registration deadline has passed');
      }
    }

    // Create registration
    const registrationDoc = {
      eventId,
      userId,
      userEmail,
      userName,
      eventTitle: eventData.title,
      eventDateTime: eventData.dateTime,
      status: 'confirmed',
      registeredAt: serverTimestamp(),
    };

    await addDoc(collection(db, REGISTRATIONS_COLLECTION), registrationDoc);

    // Increment registration count
    await updateDoc(doc(db, EVENTS_COLLECTION, eventId), {
      registrationCount: increment(1),
    });

    return registrationDoc;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Unregister from an event
 */
export const unregisterFromEvent = async (eventId, userId) => {
  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where('eventId', '==', eventId),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error('Registration not found');
    }

    await deleteDoc(snapshot.docs[0].ref);

    // Decrement registration count
    await updateDoc(doc(db, EVENTS_COLLECTION, eventId), {
      registrationCount: increment(-1),
    });
  } catch (error) {
    throw new Error(`Failed to unregister: ${error.message}`);
  }
};

/**
 * Check if user is registered for an event
 */
export const isUserRegistered = async (eventId, userId) => {
  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where('eventId', '==', eventId),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    throw new Error(`Failed to check registration: ${error.message}`);
  }
};

/**
 * Get user's registrations
 */
export const getUserRegistrations = async (userId) => {
  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('registeredAt', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error(`Failed to get registrations: ${error.message}`);
  }
};
