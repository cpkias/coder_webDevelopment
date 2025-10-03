export type EventStatus = 'draft' | 'published' | 'cancelled';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  campus?: string;
  venue: string;
  capacity: number;
  startAt: string; // ISO string
  endAt: string; // ISO string
  organizerId: string;
  images: string[]; // storage URLs
  attachments?: string[];
  registrationDeadline: string; // ISO string
  tags: string[];
  status: EventStatus;
  attendeeCount: number;
}
