# College Event Management System

A production-ready, full-stack event management platform built with React and Firebase. This application enables students to discover events, organizers to manage events, and admins to oversee the entire platform.

## 🚀 Features

### Public Features
- **Home Page**: Landing page with hero section and feature highlights
- **Events List**: Browse all available events with search and filters
- **Event Details**: Detailed event information with registration functionality
- **Calendar View**: Visual monthly calendar showing all events
- **About & Contact Pages**: Information and contact forms

### Authentication
- **Email/Password Signup & Login**: Traditional authentication
- **Google Sign-In**: One-click OAuth authentication
- **Role-Based Access**: Student, Organizer, and Admin roles
- **Email Verification**: Verify email addresses on signup
- **Password Reset**: Recover forgotten passwords

### Event Management (Organizers)
- **Create Events**: Rich event creation with multiple fields
- **Edit/Delete Events**: Full CRUD operations
- **Image Uploads**: Multiple event images with Firebase Storage
- **Event Categories**: Academic, Sports, Cultural, Technical, etc.
- **Capacity Management**: Set attendance limits
- **Registration Deadlines**: Control registration periods
- **Tags**: Organize events with custom tags

### Student Features
- **Event Registration**: One-click registration with confirmation
- **Unregister**: Cancel registrations before events
- **My Registrations**: View all registered events
- **Notifications**: In-app notifications for events and updates

### Admin Panel
- **Dashboard**: Overview statistics and metrics
- **User Management**: Approve organizers, manage roles, delete users
- **Event Oversight**: View and manage all events
- **Announcements**: Send platform-wide or role-specific announcements
- **Registration Reports**: View all registrations across events

### Notifications
- **In-App Notifications**: Real-time Firestore-based notifications
- **Email Notifications**: 
  - Registration confirmations
  - Event reminders (24 hours before)
  - Organizer approvals
  - Event updates
- **Real-time Updates**: Live event capacity and registration status

### Search & Filters
- **Full-Text Search**: Search by title, description, and tags
- **Filter by Category**: Academic, Sports, Cultural, etc.
- **Filter by Venue**: Location-based filtering
- **Date Range**: Filter events by date range
- **Sort Options**: By date, popularity, created date

### Security
- **Firestore Security Rules**: Role-based data access
- **Storage Rules**: Secure file uploads
- **Input Validation**: Client and server-side validation
- **Authentication Guards**: Protected routes and actions

## 📁 Project Structure

```
college-event-management/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── functions/                   # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts            # Email notifications & triggers
│   ├── package.json
│   └── tsconfig.json
├── public/                      # Static assets
├── src/
│   ├── __tests__/              # Unit tests
│   │   ├── components/
│   │   └── utils/
│   ├── components/
│   │   ├── admin/              # Admin components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   └── AnnouncementForm.jsx
│   │   ├── auth/               # Authentication
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── common/             # Reusable components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── events/             # Event components
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventList.jsx
│   │   │   ├── EventForm.jsx
│   │   │   ├── EventDetails.jsx
│   │   │   ├── EventFilters.jsx
│   │   │   └── EventCalendar.jsx
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   └── notifications/
│   │       └── NotificationBell.jsx
│   ├── config/
│   │   └── firebase.js         # Firebase configuration
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useEvents.js
│   │   └── useNotifications.js
│   ├── pages/                  # Page components
│   │   ├── Home.jsx
│   │   ├── EventsPage.jsx
│   │   ├── EventDetailsPage.jsx
│   │   ├── CalendarPage.jsx
│   │   ├── CreateEventPage.jsx
│   │   ├── MyEventsPage.jsx
│   │   ├── AdminDashboardPage.jsx
│   │   └── UserManagementPage.jsx
│   ├── services/               # Firebase services
│   │   ├── authService.js
│   │   ├── eventService.js
│   │   ├── notificationService.js
│   │   └── adminService.js
│   ├── store/                  # State management
│   │   └── authStore.js
│   ├── styles/
│   │   └── index.css          # Global styles
│   ├── utils/                  # Utilities
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point
│   └── setupTests.js          # Test configuration
├── .env.example               # Environment variables template
├── .gitignore
├── firebase.json              # Firebase configuration
├── firestore.rules            # Firestore security rules
├── firestore.indexes.json     # Firestore indexes
├── storage.rules              # Storage security rules
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **React Router v6**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **React Hook Form**: Form handling
- **React Hot Toast**: Toast notifications
- **React Calendar**: Calendar component
- **Lucide React**: Icon library
- **date-fns**: Date manipulation

### Backend (Firebase)
- **Firebase Authentication**: User authentication
- **Cloud Firestore**: NoSQL database
- **Firebase Storage**: File storage
- **Cloud Functions**: Serverless functions
- **Firebase Hosting**: Static site hosting

### Email Service
- **SendGrid**: Transactional email delivery

### Testing
- **Jest**: Testing framework
- **React Testing Library**: Component testing
- **@testing-library/jest-dom**: DOM matchers

### CI/CD
- **GitHub Actions**: Automated testing and deployment

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase account
- SendGrid account (for email notifications)
- Git

## 🚀 One-Click Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd college-event-management
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install Cloud Functions dependencies
cd functions
npm install
cd ..
```

### 3. Firebase Setup

#### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Follow the setup wizard
4. Enable Google Analytics (optional)

#### Enable Firebase Services

1. **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
   - Enable "Google"
   - Add authorized domains

2. **Firestore Database**:
   - Go to Firestore Database
   - Create database (start in test mode, we'll deploy rules later)
   - Choose a location

3. **Storage**:
   - Go to Storage
   - Get started (test mode is fine, we'll deploy rules)

4. **Functions**:
   - Upgrade to Blaze plan (pay-as-you-go)
   - Required for Cloud Functions

#### Get Firebase Configuration

1. Go to Project Settings > General
2. Scroll to "Your apps"
3. Click "Web app" (</> icon)
4. Register app and copy the configuration

### 4. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

VITE_APP_NAME=College Event Management
VITE_APP_URL=http://localhost:5173
```

### 5. SendGrid Setup (Optional but Recommended)

1. Create a [SendGrid account](https://sendgrid.com/)
2. Verify a sender email address
3. Create an API key with "Mail Send" permissions
4. Add the API key to `.env`

### 6. Firebase CLI Setup

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase use --add
# Select your Firebase project
```

### 7. Deploy Security Rules and Indexes

```bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy Storage rules
firebase deploy --only storage
```

### 8. Configure Cloud Functions Environment

```bash
# Set SendGrid configuration for Cloud Functions
firebase functions:config:set sendgrid.api_key="YOUR_SENDGRID_API_KEY"
firebase functions:config:set sendgrid.from_email="noreply@yourdomain.com"
```

### 9. Run the Application

```bash
# Development mode
npm run dev

# The app will open at http://localhost:5173
```

### 10. Create Admin User

Since the first user needs to be admin:

1. Sign up with email/password
2. Go to Firebase Console > Firestore
3. Find your user document in the `users` collection
4. Edit the document:
   - Set `role` to `"admin"`
   - Set `isApproved` to `true`
5. Reload the app

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm test -- --coverage
```

## 🏗️ Build for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### Automated Deployment (GitHub Actions)

1. **Setup GitHub Secrets**:
   - Go to your repository > Settings > Secrets
   - Add the following secrets:
     ```
     VITE_FIREBASE_API_KEY
     VITE_FIREBASE_AUTH_DOMAIN
     VITE_FIREBASE_PROJECT_ID
     VITE_FIREBASE_STORAGE_BUCKET
     VITE_FIREBASE_MESSAGING_SENDER_ID
     VITE_FIREBASE_APP_ID
     FIREBASE_TOKEN (run: firebase login:ci)
     SENDGRID_API_KEY
     SENDGRID_FROM_EMAIL
     ```

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. GitHub Actions will automatically:
   - Run tests
   - Build the app
   - Deploy to Firebase Hosting
   - Deploy Cloud Functions

### Manual Deployment

```bash
# Deploy everything
npm run deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only functions
npm run functions:deploy
```

## 📊 Firestore Data Model

### Users Collection
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  role: 'student' | 'organizer' | 'admin',
  isApproved: boolean,
  photoURL: string | null,
  emailVerified: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Events Collection
```javascript
{
  title: string,
  description: string,
  category: string,
  dateTime: timestamp,
  venue: string,
  capacity: number | null,
  registrationCount: number,
  registrationDeadline: timestamp | null,
  tags: string[],
  images: string[],
  organizerId: string,
  organizerName: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Registrations Collection
```javascript
{
  eventId: string,
  userId: string,
  userEmail: string,
  userName: string,
  eventTitle: string,
  eventDateTime: timestamp,
  status: 'confirmed',
  registeredAt: timestamp
}
```

### Notifications Collection
```javascript
{
  userId: string,
  type: string,
  title: string,
  message: string,
  data: object,
  read: boolean,
  createdAt: timestamp
}
```

## 🔐 Security Rules Summary

- **Users**: Read by all, write by owner or admin
- **Events**: Read by all, write by organizers/admins
- **Registrations**: Read by owner/organizer/admin, create by authenticated users
- **Notifications**: Read/update by owner only
- **Storage**: Images readable by all, writable by authenticated users

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Edit color scheme in the config file
- Update components for UI changes

### Branding
- Update app name in `.env`
- Replace logo in Header component
- Modify Footer with your information

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run deploy       # Build and deploy to Firebase
npm run emulators    # Start Firebase emulators
```

## 🐛 Troubleshooting

### Firebase Issues
- Ensure you're on the Blaze plan for Cloud Functions
- Check that all Firebase services are enabled
- Verify security rules are deployed

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### Authentication Issues
- Check Firebase Console > Authentication
- Verify authorized domains include localhost
- Ensure Google OAuth is configured

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review Firebase documentation

## 🎯 Roadmap

Future enhancements:
- [ ] QR code check-in system
- [ ] Event analytics dashboard
- [ ] Social sharing features
- [ ] Mobile app (React Native)
- [ ] Email templates customization
- [ ] Advanced search with Algolia
- [ ] Recurring events
- [ ] Ticket sales integration
- [ ] Live event streaming

---

Built with ❤️ using React and Firebase
