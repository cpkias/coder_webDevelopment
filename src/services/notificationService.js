/**
 * Notification Service
 * Handles in-app notifications
 */

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

const NOTIFICATIONS_COLLECTION = 'notifications';

/**
 * Notification types
 */
export const NotificationTypes = {
  REGISTRATION_CONFIRMED: 'registration_confirmed',
  EVENT_REMINDER: 'event_reminder',
  EVENT_UPDATED: 'event_updated',
  EVENT_CANCELLED: 'event_cancelled',
  ORGANIZER_APPROVED: 'organizer_approved',
  ANNOUNCEMENT: 'announcement',
};

/**
 * Create a notification
 */
export const createNotification = async (userId, type, title, message, data = {}) => {
  try {
    const notificationDoc = {
      userId,
      type,
      title,
      message,
      data,
      read: false,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, NOTIFICATIONS_COLLECTION), notificationDoc);
    return { id: docRef.id, ...notificationDoc };
  } catch (error) {
    throw new Error(`Failed to create notification: ${error.message}`);
  }
};

/**
 * Create notifications for multiple users (bulk)
 */
export const createBulkNotifications = async (userIds, type, title, message, data = {}) => {
  try {
    const notifications = userIds.map((userId) => ({
      userId,
      type,
      title,
      message,
      data,
      read: false,
      createdAt: serverTimestamp(),
    }));

    const promises = notifications.map((notification) =>
      addDoc(collection(db, NOTIFICATIONS_COLLECTION), notification)
    );

    await Promise.all(promises);
  } catch (error) {
    throw new Error(`Failed to create bulk notifications: ${error.message}`);
  }
};

/**
 * Get user notifications
 */
export const getUserNotifications = async (userId, limitCount = 50) => {
  try {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw new Error(`Failed to get notifications: ${error.message}`);
  }
};

/**
 * Subscribe to user notifications (realtime)
 */
export const subscribeToNotifications = (userId, callback, limitCount = 50) => {
  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(notifications);
  });
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(notificationRef, {
      read: true,
    });
  } catch (error) {
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('userId', '==', userId),
      where('read', '==', false)
    );

    const snapshot = await getDocs(q);
    const promises = snapshot.docs.map((doc) =>
      updateDoc(doc.ref, { read: true })
    );

    await Promise.all(promises);
  } catch (error) {
    throw new Error(`Failed to mark all notifications as read: ${error.message}`);
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (userId) => {
  try {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('userId', '==', userId),
      where('read', '==', false)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    throw new Error(`Failed to get unread count: ${error.message}`);
  }
};
