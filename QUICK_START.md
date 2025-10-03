# 🚀 Quick Start - Get Running in 10 Minutes

The absolute fastest way to get the College Event Management System running on your machine.

## Prerequisites Check

Before starting, make sure you have:

```bash
# Check Node.js version (need 18+)
node --version

# Check npm
npm --version

# If not installed, download from: https://nodejs.org/
```

## Step 1: Download the Code (1 minute)

```bash
# Clone or download the repository
cd your-projects-folder
# Extract files if downloaded as ZIP

# Navigate to project
cd college-event-management
```

## Step 2: Install Everything (2 minutes)

```bash
# Install main dependencies
npm install

# Install Cloud Functions dependencies
cd functions
npm install
cd ..
```

**Wait for installation to complete...**

## Step 3: Firebase Setup (5 minutes)

### A. Create Firebase Project

1. Go to: https://console.firebase.google.com/
2. Click "Create a project"
3. Name it: "My College Events"
4. Continue through wizard (disable Analytics if asked)
5. Wait for project to be created

### B. Enable Services

**Enable Authentication:**
1. Click "Authentication" in left menu
2. Click "Get Started"
3. Click "Email/Password" → Toggle ON → Save
4. Click "Google" → Toggle ON → Save

**Enable Firestore:**
1. Click "Firestore Database" in left menu
2. Click "Create database"
3. Choose "Start in test mode" → Next
4. Select nearest location → Enable

**Enable Storage:**
1. Click "Storage" in left menu
2. Click "Get started"
3. Start in test mode → Next → Done

### C. Get Your Config

1. Click ⚙️ (gear icon) → Project settings
2. Scroll down to "Your apps"
3. Click Web icon `</>`
4. App nickname: "College Events Web"
5. ✅ Also set up Firebase Hosting
6. Register app
7. **COPY the firebaseConfig object**

## Step 4: Configure Your App (2 minutes)

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
nano .env   # or use any text editor
```

Paste your Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=my-college-events.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-college-events
VITE_FIREBASE_STORAGE_BUCKET=my-college-events.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123

# Leave SendGrid empty for now
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=

VITE_APP_NAME=College Event Management
VITE_APP_URL=http://localhost:5173
```

Save and close the file.

## Step 5: Deploy Security Rules (1 minute)

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase use --add
# Select your project from the list
# Alias: default

# Deploy rules
firebase deploy --only firestore,storage
```

## Step 6: Start the App! 🎉

```bash
npm run dev
```

**Open your browser to: http://localhost:5173**

You should see the home page!

## Step 7: Create Your Admin Account (1 minute)

1. Click "Sign Up" in the app
2. Fill in:
   - Name: Your name
   - Email: your.email@example.com
   - Password: (at least 6 characters)
   - Role: Select "Student" (we'll change it)
3. Click "Create Account"

**Now make yourself admin:**

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Click "Firestore Database"
4. Click on `users` collection
5. Click on your user document (the one with your email)
6. Click the pencil icon ✏️ to edit
7. Change these fields:
   - `role`: Change to `admin`
   - `isApproved`: Change to `true`
8. Click "Update"

**Refresh your app - you now have admin powers!**

## 🎯 Test the App

Try these features:

### As a Student:
- ✅ Browse Events page
- ✅ View Calendar
- ✅ Click on an event to see details

### As an Organizer:
- ✅ Click "Create Event" button in header
- ✅ Fill in event details
- ✅ Upload an image
- ✅ Submit
- ✅ View your event in "My Events"

### As an Admin:
- ✅ Click on your profile picture → Admin Dashboard
- ✅ See platform statistics
- ✅ Go to "Manage Users"
- ✅ Approve other organizers

## 🐛 Something Not Working?

### "Firebase: Error (auth/configuration-not-found)"
→ Make sure Authentication is enabled in Firebase Console

### "Missing or insufficient permissions"
→ Deploy rules: `firebase deploy --only firestore`

### Can't log in
→ Check `.env` file has correct Firebase config

### Images not uploading
→ Deploy storage rules: `firebase deploy --only storage`

### Still stuck?
→ Check the full README.md or SETUP_GUIDE.md

## 📚 Next Steps

Now that it's working:

1. **Invite friends**: Share the signup link
2. **Create events**: Test the event creation flow
3. **Customize**: 
   - Change colors in `tailwind.config.js`
   - Update app name in `.env`
4. **Add SendGrid** (for emails):
   - Sign up at https://sendgrid.com
   - Get API key
   - Add to `.env`
   - Configure in Firebase Functions

## 🚀 Deploy to Production

When ready to share with the world:

```bash
# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Your app is now live at:
# https://your-project.web.app
```

## 📖 Learn More

- **README.md** - Complete documentation
- **SETUP_GUIDE.md** - Detailed setup
- **FEATURES.md** - All features explained
- **DATA_MODEL.md** - Database structure

## 🎉 That's It!

You now have a fully functional event management system running!

**What you can do:**
- Create and manage events
- Register for events
- Send notifications
- Manage users (as admin)
- View calendar
- And much more!

**Time taken**: ~10 minutes ⏱️

Enjoy your new event management platform! 🎊

---

Need help? Check the documentation files or create an issue on GitHub.
