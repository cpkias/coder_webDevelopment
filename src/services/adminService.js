/**
 * Admin Service
 * Handles admin operations: user management, approvals, announcements
 */

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { createBulkNotifications, NotificationTypes } from './notificationService';

const USERS_COLLECTION = 'users';
const EVENTS_COLLECTION = 'events';
const REGISTRATIONS_COLLECTION = 'registrations';

/**
 * Get all users
 */
export const getAllUsers = async (filters = {}) => {
  try {
    let q = collection(db, USERS_COLLECTION);
    const constraints = [orderBy('createdAt', 'desc')];

    if (filters.role) {
      constraints.unshift(where('role', '==', filters.role));
    }

    if (filters.isApproved !== undefined) {
      constraints.unshift(where('isApproved', '==', filters.isApproved));
    }

    q = query(q, ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error(`Failed to get users: ${error.message}`);
  }
};

/**
 * Update user role
 */
export const updateUserRole = async (userId, role) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      role,
      updatedAt: new Date(),
    });
  } catch (error) {
    throw new Error(`Failed to update user role: ${error.message}`);
  }
};

/**
 * Approve organizer
 */
export const approveOrganizer = async (userId) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      isApproved: true,
      updatedAt: new Date(),
    });

    // Send notification to user
    await createBulkNotifications(
      [userId],
      NotificationTypes.ORGANIZER_APPROVED,
      'Organizer Account Approved',
      'Your organizer account has been approved. You can now create and manage events.',
      {}
    );
  } catch (error) {
    throw new Error(`Failed to approve organizer: ${error.message}`);
  }
};

/**
 * Delete user
 */
export const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, USERS_COLLECTION, userId));

    // Note: In production, you'd also want to delete user's events, registrations, etc.
    // This would be better handled by a Cloud Function
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

/**
 * Get all events (admin view)
 */
export const getAllEvents = async () => {
  try {
    const q = query(collection(db, EVENTS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error(`Failed to get all events: ${error.message}`);
  }
};

/**
 * Get all registrations (admin view)
 */
export const getAllRegistrations = async () => {
  try {
    const q = query(collection(db, REGISTRATIONS_COLLECTION), orderBy('registeredAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error(`Failed to get all registrations: ${error.message}`);
  }
};

/**
 * Get registrations for a specific event
 */
export const getEventRegistrations = async (eventId) => {
  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where('eventId', '==', eventId),
      orderBy('registeredAt', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error(`Failed to get event registrations: ${error.message}`);
  }
};

/**
 * Send announcement to all users or specific role
 */
export const sendAnnouncement = async (title, message, targetRole = null) => {
  try {
    // Get target users
    let q = collection(db, USERS_COLLECTION);
    if (targetRole) {
      q = query(q, where('role', '==', targetRole));
    }

    const snapshot = await getDocs(q);
    const userIds = snapshot.docs.map((doc) => doc.id);

    // Create notifications for all target users
    await createBulkNotifications(
      userIds,
      NotificationTypes.ANNOUNCEMENT,
      title,
      message,
      { isAnnouncement: true }
    );

    return { sentTo: userIds.length };
  } catch (error) {
    throw new Error(`Failed to send announcement: ${error.message}`);
  }
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const [usersSnapshot, eventsSnapshot, registrationsSnapshot] = await Promise.all([
      getDocs(collection(db, USERS_COLLECTION)),
      getDocs(collection(db, EVENTS_COLLECTION)),
      getDocs(collection(db, REGISTRATIONS_COLLECTION)),
    ]);

    const users = usersSnapshot.docs.map((doc) => doc.data());
    const events = eventsSnapshot.docs.map((doc) => doc.data());

    return {
      totalUsers: users.length,
      totalStudents: users.filter((u) => u.role === 'student').length,
      totalOrganizers: users.filter((u) => u.role === 'organizer').length,
      pendingApprovals: users.filter((u) => !u.isApproved).length,
      totalEvents: events.length,
      upcomingEvents: events.filter((e) => {
        const eventDate = e.dateTime?.toDate();
        return eventDate && eventDate > new Date();
      }).length,
      totalRegistrations: registrationsSnapshot.size,
    };
  } catch (error) {
    throw new Error(`Failed to get dashboard stats: ${error.message}`);
  }
};
