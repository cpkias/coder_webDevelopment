# Firestore Data Model

Complete database schema and sample documents for the College Event Management System.

## Collections Overview

```
college-events (database)
├── users/
├── events/
├── registrations/
├── notifications/
└── announcements/ (optional)
```

## Collection: `users`

### Schema

```typescript
interface User {
  uid: string;                    // Firebase Auth UID
  email: string;                  // User email
  displayName: string;            // Full name
  role: 'student' | 'organizer' | 'admin';
  isApproved: boolean;            // Approval status
  photoURL: string | null;        // Profile picture URL
  emailVerified: boolean;         // Email verification status
  createdAt: Timestamp;           // Account creation date
  updatedAt: Timestamp;           // Last update
}
```

### Sample Documents

**Student User:**
```json
{
  "uid": "abc123xyz",
  "email": "john.doe@university.edu",
  "displayName": "John Doe",
  "role": "student",
  "isApproved": true,
  "photoURL": null,
  "emailVerified": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Organizer User:**
```json
{
  "uid": "def456uvw",
  "email": "jane.smith@university.edu",
  "displayName": "Jane Smith",
  "role": "organizer",
  "isApproved": true,
  "photoURL": "https://storage.googleapis.com/users/def456uvw/profile.jpg",
  "emailVerified": true,
  "createdAt": "2024-01-10T09:00:00Z",
  "updatedAt": "2024-01-20T15:45:00Z"
}
```

**Admin User:**
```json
{
  "uid": "ghi789rst",
  "email": "admin@university.edu",
  "displayName": "Admin User",
  "role": "admin",
  "isApproved": true,
  "photoURL": null,
  "emailVerified": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Indexes

```javascript
users:
  - role (ascending) + createdAt (descending)
  - isApproved (ascending) + createdAt (descending)
```

## Collection: `events`

### Schema

```typescript
interface Event {
  title: string;                  // Event name
  description: string;            // Detailed description
  category: string;               // Event category
  dateTime: Timestamp;            // Event date and time
  venue: string;                  // Event location
  capacity: number | null;        // Max attendees (null = unlimited)
  registrationCount: number;      // Current registration count
  registrationDeadline: Timestamp | null;  // Last date to register
  tags: string[];                 // Search tags
  images: string[];               // Image URLs from Storage
  organizerId: string;            // Creator's UID
  organizerName: string;          // Creator's display name
  createdAt: Timestamp;           // Event creation date
  updatedAt: Timestamp;           // Last update
}
```

### Sample Documents

**Tech Workshop:**
```json
{
  "title": "Introduction to Machine Learning",
  "description": "Join us for a comprehensive introduction to machine learning. Learn about basic concepts, algorithms, and practical applications. Perfect for beginners!",
  "category": "Technical",
  "dateTime": "2024-12-15T14:00:00Z",
  "venue": "Seminar Hall A",
  "capacity": 100,
  "registrationCount": 45,
  "registrationDeadline": "2024-12-14T23:59:59Z",
  "tags": ["AI", "Machine Learning", "Workshop", "Tech"],
  "images": [
    "https://storage.googleapis.com/events/ml_workshop_1.jpg",
    "https://storage.googleapis.com/events/ml_workshop_2.jpg"
  ],
  "organizerId": "def456uvw",
  "organizerName": "Jane Smith",
  "createdAt": "2024-11-01T10:00:00Z",
  "updatedAt": "2024-11-15T16:30:00Z"
}
```

**Sports Event:**
```json
{
  "title": "Annual Basketball Tournament",
  "description": "Inter-department basketball championship. Teams of 5 players each. Prizes for winners and runners-up!",
  "category": "Sports",
  "dateTime": "2024-12-20T09:00:00Z",
  "venue": "Sports Complex",
  "capacity": null,
  "registrationCount": 12,
  "registrationDeadline": "2024-12-18T23:59:59Z",
  "tags": ["Basketball", "Sports", "Tournament", "Competition"],
  "images": [
    "https://storage.googleapis.com/events/basketball_poster.jpg"
  ],
  "organizerId": "xyz789abc",
  "organizerName": "Sports Club",
  "createdAt": "2024-11-10T08:00:00Z",
  "updatedAt": "2024-11-10T08:00:00Z"
}
```

**Cultural Event:**
```json
{
  "title": "Cultural Night 2024",
  "description": "Annual cultural fest featuring music, dance, drama, and art performances from students across all departments.",
  "category": "Cultural",
  "dateTime": "2024-12-25T18:00:00Z",
  "venue": "Main Auditorium",
  "capacity": 500,
  "registrationCount": 387,
  "registrationDeadline": "2024-12-23T23:59:59Z",
  "tags": ["Culture", "Music", "Dance", "Performance"],
  "images": [
    "https://storage.googleapis.com/events/cultural_night_1.jpg",
    "https://storage.googleapis.com/events/cultural_night_2.jpg",
    "https://storage.googleapis.com/events/cultural_night_3.jpg"
  ],
  "organizerId": "def456uvw",
  "organizerName": "Cultural Committee",
  "createdAt": "2024-10-01T12:00:00Z",
  "updatedAt": "2024-12-01T14:20:00Z"
}
```

### Indexes

```javascript
events:
  - category (ascending) + dateTime (ascending)
  - venue (ascending) + dateTime (ascending)
  - organizerId (ascending) + dateTime (descending)
  - dateTime (ascending)
```

## Collection: `registrations`

### Schema

```typescript
interface Registration {
  eventId: string;                // Event document ID
  userId: string;                 // User UID
  userEmail: string;              // User email
  userName: string;               // User display name
  eventTitle: string;             // Cached event title
  eventDateTime: Timestamp;       // Cached event date
  status: 'confirmed';            // Registration status
  registeredAt: Timestamp;        // Registration timestamp
}
```

### Sample Documents

```json
{
  "eventId": "event123",
  "userId": "abc123xyz",
  "userEmail": "john.doe@university.edu",
  "userName": "John Doe",
  "eventTitle": "Introduction to Machine Learning",
  "eventDateTime": "2024-12-15T14:00:00Z",
  "status": "confirmed",
  "registeredAt": "2024-11-05T11:30:00Z"
}
```

```json
{
  "eventId": "event456",
  "userId": "abc123xyz",
  "userEmail": "john.doe@university.edu",
  "userName": "John Doe",
  "eventTitle": "Cultural Night 2024",
  "eventDateTime": "2024-12-25T18:00:00Z",
  "status": "confirmed",
  "registeredAt": "2024-11-20T15:45:00Z"
}
```

### Indexes

```javascript
registrations:
  - eventId (ascending) + registeredAt (descending)
  - userId (ascending) + registeredAt (descending)
  - eventId (ascending) + userId (ascending)  // Composite for checking duplicates
```

## Collection: `notifications`

### Schema

```typescript
interface Notification {
  userId: string;                 // Recipient UID
  type: 'registration_confirmed' | 'event_reminder' | 
        'event_updated' | 'organizer_approved' | 'announcement';
  title: string;                  // Notification title
  message: string;                // Notification message
  data: {                         // Additional data
    eventId?: string;
    registrationId?: string;
    isAnnouncement?: boolean;
    [key: string]: any;
  };
  read: boolean;                  // Read status
  createdAt: Timestamp;           // Creation timestamp
}
```

### Sample Documents

**Registration Confirmation:**
```json
{
  "userId": "abc123xyz",
  "type": "registration_confirmed",
  "title": "Registration Confirmed",
  "message": "You're registered for Introduction to Machine Learning on December 15, 2024 at 2:00 PM",
  "data": {
    "eventId": "event123",
    "registrationId": "reg456"
  },
  "read": false,
  "createdAt": "2024-11-05T11:30:05Z"
}
```

**Event Reminder:**
```json
{
  "userId": "abc123xyz",
  "type": "event_reminder",
  "title": "Event Reminder",
  "message": "Introduction to Machine Learning is tomorrow at 2:00 PM in Seminar Hall A",
  "data": {
    "eventId": "event123"
  },
  "read": false,
  "createdAt": "2024-12-14T09:00:00Z"
}
```

**Organizer Approval:**
```json
{
  "userId": "def456uvw",
  "type": "organizer_approved",
  "title": "Organizer Account Approved",
  "message": "Your organizer account has been approved. You can now create and manage events.",
  "data": {},
  "read": true,
  "createdAt": "2024-01-20T10:15:00Z"
}
```

**Announcement:**
```json
{
  "userId": "abc123xyz",
  "type": "announcement",
  "title": "Platform Maintenance Notice",
  "message": "The platform will undergo maintenance on Dec 30 from 2 AM to 4 AM. Some features may be unavailable.",
  "data": {
    "isAnnouncement": true
  },
  "read": false,
  "createdAt": "2024-12-20T08:00:00Z"
}
```

### Indexes

```javascript
notifications:
  - userId (ascending) + createdAt (descending)
  - userId (ascending) + read (ascending)
```

## Collection: `announcements` (Optional)

### Schema

```typescript
interface Announcement {
  title: string;                  // Announcement title
  message: string;                // Announcement content
  targetRole: 'student' | 'organizer' | 'admin' | null;  // Target audience
  createdBy: string;              // Admin UID
  createdByName: string;          // Admin name
  createdAt: Timestamp;           // Creation timestamp
  expiresAt: Timestamp | null;    // Expiration date
}
```

### Sample Document

```json
{
  "title": "Welcome to College Events!",
  "message": "We're excited to launch our new event management platform. Explore events, register, and stay connected with campus activities!",
  "targetRole": null,
  "createdBy": "ghi789rst",
  "createdByName": "Admin User",
  "createdAt": "2024-01-01T00:00:00Z",
  "expiresAt": "2024-01-31T23:59:59Z"
}
```

## Data Relationships

### User → Events (One-to-Many)
A user (organizer) can create multiple events.

```javascript
Query: events where organizerId == userId
```

### Event → Registrations (One-to-Many)
An event can have multiple registrations.

```javascript
Query: registrations where eventId == eventId
```

### User → Registrations (One-to-Many)
A user can register for multiple events.

```javascript
Query: registrations where userId == userId
```

### User → Notifications (One-to-Many)
A user can have multiple notifications.

```javascript
Query: notifications where userId == userId
```

## Common Queries

### Get User's Registered Events
```javascript
// Step 1: Get user's registrations
const registrations = await getDocs(
  query(
    collection(db, 'registrations'),
    where('userId', '==', userId),
    orderBy('registeredAt', 'desc')
  )
);

// Step 2: Get event details for each registration
const events = await Promise.all(
  registrations.docs.map(doc => 
    getDoc(collection(db, 'events', doc.data().eventId))
  )
);
```

### Get Event Attendees
```javascript
const attendees = await getDocs(
  query(
    collection(db, 'registrations'),
    where('eventId', '==', eventId),
    orderBy('registeredAt', 'desc')
  )
);
```

### Get Upcoming Events
```javascript
const upcomingEvents = await getDocs(
  query(
    collection(db, 'events'),
    where('dateTime', '>=', new Date()),
    orderBy('dateTime', 'asc'),
    limit(20)
  )
);
```

### Get Unread Notifications Count
```javascript
const unreadNotifications = await getDocs(
  query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('read', '==', false)
  )
);

const count = unreadNotifications.size;
```

### Check if User Registered for Event
```javascript
const existing = await getDocs(
  query(
    collection(db, 'registrations'),
    where('eventId', '==', eventId),
    where('userId', '==', userId)
  )
);

const isRegistered = !existing.empty;
```

## Data Validation Rules

### User Document
- `email`: Valid email format, required
- `displayName`: Non-empty string, required
- `role`: One of ['student', 'organizer', 'admin']
- `isApproved`: Boolean, required

### Event Document
- `title`: Non-empty string, required
- `description`: Non-empty string, required
- `dateTime`: Future timestamp, required
- `venue`: Non-empty string, required
- `capacity`: Positive number or null
- `registrationDeadline`: Before event dateTime

### Registration Document
- `eventId`: Valid event ID
- `userId`: Valid user ID
- No duplicate (eventId + userId) combinations

## Performance Considerations

### Denormalization
Event title and dateTime are cached in registrations to avoid additional reads.

### Counter Updates
`registrationCount` in events is updated atomically using `increment()`.

### Pagination
Use `limit()` and `startAfter()` for large result sets.

### Indexes
All frequently queried field combinations have composite indexes.

---

This data model is optimized for read performance while maintaining data integrity through Firestore security rules.
