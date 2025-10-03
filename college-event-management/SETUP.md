# 🚀 Quick Setup Guide

This guide will get your College Event Management system up and running in under 10 minutes.

## Prerequisites Checklist

- [ ] Node.js 16+ installed
- [ ] npm or yarn installed
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Git installed
- [ ] Firebase account created

## Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd college-event-management

# Install all dependencies
npm install

# Install Firebase Functions dependencies
cd functions && npm install && cd ..
```

## Step 2: Firebase Project Setup (3 minutes)

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `college-event-management`
4. Enable Google Analytics (optional)
5. Create project

### Enable Firebase Services
1. **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" and "Google"
   - Add your domain to authorized domains

2. **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in production mode
   - Choose location closest to your users

3. **Storage**:
   - Go to Storage
   - Click "Get started"
   - Start in production mode

4. **Functions** (for email notifications):
   - Functions will be set up during deployment

## Step 3: Environment Configuration (2 minutes)

### Get Firebase Config
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Web app" icon (</>)
4. Register app with name: `college-event-management`
5. Copy the config object

### Create Environment File
```bash
# Copy the template
cp .env.example .env
```

Edit `.env` with your Firebase config:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Step 4: Firebase CLI Setup (1 minute)

```bash
# Login to Firebase
firebase login

# Initialize project (select existing project)
firebase use your_project_id
```

## Step 5: Deploy Security Rules (1 minute)

```bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore:rules,firestore:indexes

# Deploy Storage rules
firebase deploy --only storage
```

## Step 6: Start Development (1 minute)

```bash
# Start the development server
npm start
```

Your app will open at `http://localhost:3000` 🎉

## Optional: Email Notifications Setup

If you want email notifications (registration confirmations, reminders):

### Setup SendGrid
1. Create [SendGrid account](https://sendgrid.com)
2. Get API key from Settings > API Keys
3. Verify sender email

### Configure Cloud Functions
```bash
# Set SendGrid configuration
firebase functions:config:set sendgrid.api_key="your_sendgrid_api_key"
firebase functions:config:set sendgrid.from_email="noreply@yourdomain.com"

# Deploy functions
firebase deploy --only functions
```

## 🎯 Quick Test

1. **Create Account**: Go to `/signup` and create a student account
2. **Browse Events**: Visit `/events` to see the events page
3. **Create Event**: 
   - Sign up as organizer (requires admin approval)
   - Or manually set role to 'organizer' in Firestore
   - Create an event at `/events/create`
4. **Admin Functions**:
   - Set a user's role to 'admin' in Firestore
   - Access admin features

## 🚀 Production Deployment

### One-Command Deploy
```bash
# Build and deploy everything
npm run firebase:deploy
```

### Individual Services
```bash
# Deploy only hosting
firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions

# Deploy only rules
firebase deploy --only firestore:rules,storage
```

## 🔧 Troubleshooting

### Common Issues

**Build Errors**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Firebase Permission Errors**:
```bash
# Re-login to Firebase
firebase logout
firebase login
```

**Environment Variables Not Working**:
- Ensure `.env` file is in root directory
- Restart development server after changes
- Check for typos in variable names

**Firestore Permission Denied**:
- Deploy security rules: `firebase deploy --only firestore:rules`
- Check user authentication status

## 📱 Mobile Testing

Test on mobile devices:
```bash
# Get your local IP
ipconfig getifaddr en0  # macOS
ip route get 1 | awk '{print $7}' # Linux

# Access via mobile browser
http://YOUR_IP:3000
```

## 🎉 You're Done!

Your College Event Management system is now running! Here's what you can do next:

### For Students:
- Browse and register for events
- View registration history
- Get notifications

### For Organizers:
- Create and manage events
- View registration lists
- Upload event images

### For Admins:
- Approve organizer accounts
- Manage all events and users
- Send announcements

## 📚 Next Steps

1. **Customize Branding**: Update colors, logos, and text
2. **Add Sample Data**: Create some test events
3. **Configure Email**: Set up SendGrid for notifications
4. **Set up CI/CD**: Configure GitHub Actions
5. **Monitor Performance**: Set up Firebase Analytics

## 🆘 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Create an issue on GitHub
- Check Firebase documentation

---

**Happy Event Managing! 🎓✨**