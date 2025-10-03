# College Event Management System

A comprehensive full-stack web application for managing college events, built with React, TypeScript, and Firebase. This platform enables students to discover and register for events, organizers to create and manage events, and administrators to oversee the entire system.

## 🚀 Features

### Public Features
- **Home Page**: Hero section with featured events and statistics
- **Event Discovery**: Browse all events with advanced search and filtering
- **Event Details**: Comprehensive event information with registration options
- **Responsive Design**: Mobile-first, fully responsive UI
- **About & Contact Pages**: Information about the platform

### Authentication & User Management
- **Email/Password Authentication**: Secure user registration and login
- **Google Sign-In**: One-click authentication with Google
- **Role-Based Access Control**: Student, Organizer, and Admin roles
- **Profile Management**: User profile with customizable information
- **Organizer Approval System**: Admin approval required for organizer accounts

### Event Management
- **Event CRUD Operations**: Create, read, update, and delete events
- **Rich Event Data**: Title, description, category, date/time, venue, capacity, images, tags
- **Event Categories**: Academic, Cultural, Sports, Technical, Social, Workshop, Seminar, Competition
- **Image Upload**: Multiple image support with Firebase Storage
- **Event Approval**: Admin approval required for new events
- **Capacity Management**: Automatic registration tracking and limits

### Registration System
- **Event Registration**: One-click registration with duplicate prevention
- **Capacity Control**: Automatic prevention of over-registration
- **Registration Management**: View and cancel registrations
- **Real-time Updates**: Live registration counts and status updates

### Admin Dashboard
- **User Management**: View, approve, and manage all users
- **Event Oversight**: Approve events and manage all event data
- **Registration Analytics**: Track registrations and event performance
- **Announcement System**: Send platform-wide announcements

### Notifications
- **In-App Notifications**: Real-time notifications for important events
- **Email Notifications**: Registration confirmations and event reminders
- **Cloud Functions**: Automated email sending via SendGrid integration

### Advanced Features
- **Search & Filtering**: Advanced search by title, category, date, venue, tags
- **Calendar View**: Monthly calendar display of events (ready for implementation)
- **File Management**: Secure file uploads with proper validation
- **Real-time Updates**: Firestore listeners for live data synchronization
- **Security Rules**: Comprehensive Firestore security rules
- **Performance Optimized**: Lazy loading, pagination, and efficient queries

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for component library
- **React Router** for navigation
- **React Hook Form** with Yup validation
- **Day.js** for date handling
- **React Hot Toast** for notifications

### Backend & Services
- **Firebase Authentication** for user management
- **Firestore** for database
- **Firebase Storage** for file uploads
- **Firebase Cloud Functions** for serverless backend logic
- **Firebase Hosting** for deployment

### Development & Testing
- **TypeScript** for type safety
- **Jest** and **React Testing Library** for testing
- **ESLint** for code quality
- **Firebase Emulator Suite** for local development

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Git**

## 🚀 Quick Start (One-Click Setup)

### 1. Clone and Install
```bash
# Clone the repository
git clone <your-repo-url>
cd college-event-management

# Install dependencies
npm install

# Install Firebase Functions dependencies
cd functions
npm install
cd ..
```

### 2. Firebase Setup
```bash
# Login to Firebase
firebase login

# Initialize Firebase project (if not already done)
firebase init

# Select the following services:
# - Firestore
# - Functions
# - Hosting
# - Storage
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Firebase configuration
# Get these values from Firebase Console > Project Settings > General
```

### 4. Firebase Configuration
Add your Firebase config to `.env`:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 5. Deploy Firestore Rules and Indexes
```bash
# Deploy security rules and indexes
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 6. Set up Cloud Functions Environment
```bash
# Set SendGrid API key for email notifications (optional)
firebase functions:config:set sendgrid.api_key="your_sendgrid_api_key"
firebase functions:config:set sendgrid.from_email="noreply@yourdomain.com"
```

### 7. Start Development Server
```bash
# Start the React development server
npm start

# In another terminal, start Firebase emulators (optional)
firebase emulators:start
```

The application will open at `http://localhost:3000`.

## 📁 Project Structure

```
college-event-management/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   │   ├── auth/          # Authentication components
│   │   ├── events/        # Event-related components
│   │   ├── admin/         # Admin dashboard components
│   │   ├── common/        # Shared components
│   │   └── layout/        # Layout components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── services/          # API and service functions
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main App component
│   └── index.tsx          # Entry point
├── functions/             # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts       # Cloud Functions code
│   ├── package.json
│   └── tsconfig.json
├── firestore.rules        # Firestore security rules
├── firestore.indexes.json # Firestore indexes
├── storage.rules          # Storage security rules
├── firebase.json          # Firebase configuration
└── README.md
```

## 🔧 Configuration

### Firebase Services Setup

1. **Authentication**:
   - Enable Email/Password and Google sign-in methods
   - Configure authorized domains for production

2. **Firestore Database**:
   - Create database in production mode
   - Deploy security rules: `firebase deploy --only firestore:rules`

3. **Storage**:
   - Set up default bucket
   - Deploy storage rules: `firebase deploy --only storage`

4. **Cloud Functions**:
   - Configure SendGrid for email notifications
   - Set environment variables for email settings

### Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# App Configuration
REACT_APP_APP_NAME=College Event Management
REACT_APP_ADMIN_EMAIL=admin@college.edu
```

For Cloud Functions (set via Firebase CLI):
```bash
firebase functions:config:set sendgrid.api_key="your_sendgrid_api_key"
firebase functions:config:set sendgrid.from_email="noreply@yourdomain.com"
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure
- **Unit Tests**: Components and services
- **Integration Tests**: User workflows
- **Test Files**: Located in `__tests__` directories

## 🚀 Deployment

### Manual Deployment

1. **Build the project**:
```bash
npm run build
```

2. **Deploy to Firebase Hosting**:
```bash
firebase deploy
```

3. **Deploy specific services**:
```bash
# Deploy only hosting
firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions

# Deploy only Firestore rules
firebase deploy --only firestore:rules
```

### GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Build project
      run: npm run build
      env:
        REACT_APP_FIREBASE_API_KEY: ${{ secrets.REACT_APP_FIREBASE_API_KEY }}
        REACT_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.REACT_APP_FIREBASE_AUTH_DOMAIN }}
        REACT_APP_FIREBASE_PROJECT_ID: ${{ secrets.REACT_APP_FIREBASE_PROJECT_ID }}
        REACT_APP_FIREBASE_STORAGE_BUCKET: ${{ secrets.REACT_APP_FIREBASE_STORAGE_BUCKET }}
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.REACT_APP_FIREBASE_MESSAGING_SENDER_ID }}
        REACT_APP_FIREBASE_APP_ID: ${{ secrets.REACT_APP_FIREBASE_APP_ID }}
    
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        projectId: your-project-id
```

## 📊 Data Models

### User
```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'student' | 'organizer' | 'admin';
  isApproved: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  studentId?: string;
  department?: string;
  year?: string;
  phone?: string;
}
```

### Event
```typescript
interface Event {
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
  images: string[];
  organizerId: string;
  organizerName: string;
  isActive: boolean;
  isApproved: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  requirements?: string;
  contactEmail?: string;
  price?: number;
}
```

### Registration
```typescript
interface Registration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  registeredAt: Timestamp;
  status: 'registered' | 'cancelled' | 'attended';
  notes?: string;
}
```

## 🔒 Security

### Firestore Security Rules
- **Role-based access control**: Different permissions for students, organizers, and admins
- **Data validation**: Server-side validation of all data
- **User isolation**: Users can only access their own data
- **Admin privileges**: Full access for admin users

### Storage Security Rules
- **File type validation**: Only allowed file types can be uploaded
- **Size limits**: Maximum file sizes enforced
- **User authentication**: Only authenticated users can upload
- **Path-based security**: Organized file structure with proper permissions

## 🎨 UI/UX Features

### Design System
- **Material Design**: Consistent design language
- **Responsive Layout**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance
- **Dark Mode Ready**: Theme system prepared for dark mode

### User Experience
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: Comprehensive error messages and recovery
- **Form Validation**: Real-time validation with helpful messages
- **Toast Notifications**: Non-intrusive success and error messages

## 📱 Mobile Responsiveness

- **Breakpoints**: xs, sm, md, lg, xl screen sizes
- **Touch-Friendly**: Optimized for touch interactions
- **Performance**: Optimized images and lazy loading
- **PWA Ready**: Service worker and manifest ready

## 🔧 Development

### Available Scripts

```bash
# Development
npm start              # Start development server
npm test               # Run tests
npm run build          # Build for production
npm run eject          # Eject from Create React App

# Firebase
firebase serve         # Serve locally
firebase deploy        # Deploy to production
firebase emulators:start  # Start emulators
```

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

1. **Firebase Configuration**: Ensure all environment variables are set correctly
2. **Authentication Issues**: Check Firebase Authentication settings
3. **Deployment Failures**: Verify Firebase project permissions
4. **Build Errors**: Clear node_modules and reinstall dependencies

### Getting Help

- **Documentation**: Check Firebase documentation
- **Issues**: Create an issue on GitHub
- **Community**: Join our Discord server (link coming soon)

## 🚀 Future Enhancements

### Planned Features
- **Calendar Integration**: Google Calendar sync
- **Push Notifications**: Browser push notifications
- **Advanced Analytics**: Detailed event and user analytics
- **QR Code Check-in**: Event check-in via QR codes
- **Social Features**: Event sharing and social integration
- **Multi-language Support**: Internationalization (i18n)
- **Advanced Search**: Elasticsearch integration
- **Event Templates**: Reusable event templates
- **Bulk Operations**: Bulk user and event management
- **API Integration**: REST API for third-party integrations

### Technical Improvements
- **Performance**: Further optimization and caching
- **Testing**: Increased test coverage
- **Documentation**: API documentation with Swagger
- **Monitoring**: Error tracking and performance monitoring
- **Security**: Advanced security features and auditing

---

## 📞 Contact

**Project Maintainer**: Your Name
**Email**: your.email@example.com
**GitHub**: [@yourusername](https://github.com/yourusername)

---

**Made with ❤️ for the college community**