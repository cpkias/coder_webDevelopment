import { Timestamp } from 'firebase/firestore';

export type UserRole = 'student' | 'organizer' | 'admin';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  isApproved: boolean; // For organizers pending approval
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Additional profile fields
  studentId?: string;
  department?: string;
  year?: string;
  phone?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  startDate: Timestamp;
  endDate: Timestamp;
  venue: string;
  capacity: number;
  currentRegistrations: number;
  registrationDeadline: Timestamp;
  tags: string[];
  images: string[]; // URLs from Firebase Storage
  attachments?: EventAttachment[];
  organizerId: string;
  organizerName: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Additional fields
  requirements?: string;
  contactEmail?: string;
  price?: number;
  isApproved: boolean; // Admin approval required
}

export interface EventAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

export type EventCategory = 
  | 'academic'
  | 'cultural'
  | 'sports'
  | 'technical'
  | 'social'
  | 'workshop'
  | 'seminar'
  | 'competition'
  | 'other';

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  registeredAt: Timestamp;
  status: 'registered' | 'cancelled' | 'attended';
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Timestamp;
  // Optional fields for different notification types
  eventId?: string;
  actionUrl?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  targetRole?: UserRole; // If specified, only users with this role will see it
  isActive: boolean;
  createdBy: string;
  createdAt: Timestamp;
  expiresAt?: Timestamp;
}

// Form interfaces
export interface EventFormData {
  title: string;
  description: string;
  category: EventCategory;
  startDate: Date;
  endDate: Date;
  venue: string;
  capacity: number;
  registrationDeadline: Date;
  tags: string[];
  requirements?: string;
  contactEmail?: string;
  price?: number;
}

export interface UserFormData {
  displayName: string;
  email: string;
  role: UserRole;
  studentId?: string;
  department?: string;
  year?: string;
  phone?: string;
}

// Filter and search interfaces
export interface EventFilters {
  category?: EventCategory;
  startDate?: Date;
  endDate?: Date;
  venue?: string;
  tags?: string[];
  organizerId?: string;
  isActive?: boolean;
}

export interface SearchParams {
  query?: string;
  filters?: EventFilters;
  sortBy?: 'startDate' | 'createdAt' | 'title' | 'registrations';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}