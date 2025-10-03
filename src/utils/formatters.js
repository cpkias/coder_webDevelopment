/**
 * Utility functions for formatting dates, times, and other data
 */

import { format, formatDistanceToNow, isBefore, isAfter, parseISO } from 'date-fns';

/**
 * Format Firestore timestamp to readable date
 */
export const formatDate = (timestamp, formatStr = 'MMM dd, yyyy') => {
  if (!timestamp) return '';
  
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return format(date, formatStr);
};

/**
 * Format Firestore timestamp to readable date and time
 */
export const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return format(date, 'MMM dd, yyyy - h:mm a');
};

/**
 * Format time only
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return format(date, 'h:mm a');
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
};

/**
 * Check if event is upcoming
 */
export const isUpcoming = (timestamp) => {
  if (!timestamp) return false;
  
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return isAfter(date, new Date());
};

/**
 * Check if event is past
 */
export const isPast = (timestamp) => {
  if (!timestamp) return false;
  
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return isBefore(date, new Date());
};

/**
 * Format capacity (e.g., "45/100")
 */
export const formatCapacity = (current, total) => {
  if (!total) return `${current} registered`;
  return `${current}/${total}`;
};

/**
 * Get capacity percentage
 */
export const getCapacityPercentage = (current, total) => {
  if (!total) return 0;
  return Math.round((current / total) * 100);
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Convert Firebase Timestamp to ISO string for datetime-local input
 */
export const timestampToInputValue = (timestamp) => {
  if (!timestamp) return '';
  
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return format(date, "yyyy-MM-dd'T'HH:mm");
};

/**
 * Convert datetime-local input value to Date
 */
export const inputValueToDate = (value) => {
  if (!value) return null;
  return parseISO(value);
};
