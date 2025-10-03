# Quick Setup Guide

This guide will help you get the College Event Management System running in 15 minutes.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Git installed
- [ ] Firebase account created
- [ ] SendGrid account created (optional)

## Step-by-Step Setup

### Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd college-event-management

# Install all dependencies
npm install
cd functions && npm install && cd ..
```

### Step 2: Firebase Project Setup (5 minutes)

1. **Create Firebase Project**
   - Visit https://console.firebase.google.com/
   - Click "Create a project"
   - Name it "College Events" or similar
   - Continue through the wizard

2. **Enable Services**
   
   **Authentication:**
   - Navigate to: Build > Authentication
   - Click "Get Started"
   - Enable "Email/Password" provider
   - Enable "Google" provider
   - Add `localhost` to authorized domains

   **Firestore:**
   - Navigate to: Build > Firestore Database
   - Click "Create database"
   - Start in "test mode" (we'll deploy rules later)
   - Choose your nearest location

   **Storage:**
   - Navigate to: Build > Storage
   - Click "Get started"
   - Use test mode

   **Upgrade to Blaze Plan:**
   - Go to: Project Settings > Usage and billing
   - Click "Modify plan"
   - Select "Blaze (Pay as you go)"
   - This is required for Cloud Functions

3. **Get Configuration**
   - Go to: Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click Web icon (</>)
   - Register app name: "College Event Management"
   - Copy the config object

### Step 3: Environment Setup (3 minutes)

1. **Create .env file**
   ```bash
   cp .env.example .env
   ```

2. **Fill in Firebase Config**
   
   Edit `.env` and paste your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123:web:abc
   VITE_FIREBASE_MEASUREMENT_ID=G-ABC123
   ```

3. **SendGrid (Optional - for emails)**
   ```env
   SENDGRID_API_KEY=SG.xxx (get from SendGrid)
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   ```

### Step 4: Firebase CLI Setup (3 minutes)

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Select your project
firebase use --add
# Choose your project from the list
# Give it an alias: "default"
```

### Step 5: Deploy Firebase Configuration (2 minutes)

```bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy Storage rules  
firebase deploy --only storage

# Configure Cloud Functions (if using SendGrid)
firebase functions:config:set sendgrid.api_key="YOUR_KEY"
firebase functions:config:set sendgrid.from_email="noreply@yourdomain.com"
```

### Step 6: Run the Application! 🎉

```bash
# Start development server
npm run dev
```

Open http://localhost:5173 in your browser!

### Step 7: Create First Admin User (2 minutes)

1. **Sign Up**
   - Click "Sign Up" in the app
   - Create account with email/password
   - Choose role: "Student" (we'll change it)

2. **Make Yourself Admin**
   - Go to Firebase Console
   - Navigate to Firestore Database
   - Find `users` collection
   - Click on your user document
   - Edit fields:
     - `role`: Change to `"admin"`
     - `isApproved`: Change to `true`
   - Save

3. **Refresh the app** - You now have admin access!

## Verification Checklist

Test these features to ensure everything works:

- [ ] Sign in with email/password
- [ ] Sign in with Google
- [ ] Browse events page
- [ ] View calendar
- [ ] Create an event (as organizer/admin)
- [ ] Register for an event
- [ ] View notifications
- [ ] Access admin dashboard (as admin)

## Common Issues & Solutions

### "Firebase: Error (auth/configuration-not-found)"
- **Solution**: Make sure Authentication is enabled in Firebase Console

### "Missing or insufficient permissions"
- **Solution**: Deploy Firestore rules: `firebase deploy --only firestore`

### "Network request failed"
- **Solution**: Check your internet connection and Firebase service status

### Images not uploading
- **Solution**: Deploy Storage rules: `firebase deploy --only storage`

### Functions not working
- **Solution**: 
  - Ensure you're on Blaze plan
  - Deploy functions: `firebase deploy --only functions`

## Next Steps

1. **Customize the app**
   - Update app name in `.env`
   - Modify colors in `tailwind.config.js`
   - Update footer information

2. **Add more users**
   - Share the signup link
   - Approve organizers from admin panel

3. **Create events**
   - Use the "Create Event" button
   - Upload event images
   - Set capacity and deadlines

4. **Deploy to production**
   - Follow deployment guide in README.md
   - Set up GitHub Actions for CI/CD

## Development Tips

### Using Firebase Emulators (Optional)

For local development without hitting production:

```bash
# Install emulators
firebase init emulators

# Start emulators
npm run emulators
```

Then update `.env` to point to emulators.

### Hot Reload

Vite provides instant hot reload. Just save your files and see changes immediately!

### Debugging

- Use React DevTools browser extension
- Check browser console for errors
- View Firebase Console for backend issues

## Production Deployment

When ready to deploy:

```bash
# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy Cloud Functions
firebase deploy --only functions
```

Your app will be live at: `https://your-project.web.app`

## Support

Need help? 

1. Check the main README.md
2. Review Firebase documentation
3. Check the issues in the repository
4. Create a new issue with details

---

**Estimated Total Setup Time: 15-20 minutes**

Happy coding! 🚀
