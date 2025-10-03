# College Event Management (React + Firebase)

Production-ready, mobile-responsive web app to manage college events with Firebase Authentication, Firestore, Storage, and Cloud Functions.

## One-click local setup

```bash
# 1) Clone repo and enter
# git clone <your-fork-url> && cd college-events

# 2) Install deps (root and functions)
npm install
npm --prefix functions install

# 3) Copy env and fill Firebase keys
cp .env.example .env
# Edit .env with your Firebase project values

# 4) Initialize Firebase (once)
npx firebase login
npx firebase use <project-id>

# (optional) Start emulators for local dev
npx firebase emulators:start

# 5) Start the app
npm run dev
```

## Folder structure

```
/college-events
  ├─ src/
  │  ├─ modules/
  │  │  ├─ app/
  │  │  │  ├─ App.tsx, AppProviders.tsx
  │  │  │  └─ components/ (layout, cards, calendar, protected route)
  │  │  ├─ auth/ (AuthContext, LoginPage, SignupPage)
  │  │  ├─ public/ (Home, About, Contact)
  │  │  ├─ events/ (list, details, form, registration helpers)
  │  │  ├─ admin/ (AdminDashboard)
  │  └─ services/firebase.ts
  ├─ functions/ (Cloud Functions: registration emails, reminders)
  ├─ firestore.rules, storage.rules, firestore.indexes.json
  ├─ vite.config.ts, tailwind config, jest config
  └─ README.md
```

## Firestore data model

- **users/{uid}**: `{ role: 'student'|'organizer'|'admin', approvedOrganizer: boolean, email, createdAt }`
- **events/{eventId}**: `{ title, description, category, campus, venue, capacity, images[], attachments[], startAt, endAt, registrationDeadline, tags[], status, organizerId, attendeeCount, createdAt, updatedAt }`
- **events/{eventId}/registrations/{uid}**: `{ userId, createdAt }`
- **notifications/{id}**: `{ userId, type, eventId, message, createdAt, read }`
- **announcements/{id}**: `{ text, createdAt }`

Sample documents:

```json
{
  "users/abc": {"role":"student","approvedOrganizer":false,"email":"s@example.com","createdAt":"2025-10-03T00:00:00Z"},
  "events/xyz": {"title":"Tech Talk","description":"AI trends","category":"Tech","campus":"Main","venue":"Hall A","capacity":100,"images":[],"attachments":[],"startAt":"2025-11-20T18:00:00.000Z","endAt":"2025-11-20T20:00:00.000Z","registrationDeadline":"2025-11-19T23:59:59.000Z","tags":["ai"],"status":"published","organizerId":"org1","attendeeCount":5}
}
```

## Security rules

Key constraints in `firestore.rules` and `storage.rules`:
- Only admins can manage everything; organizers (approved) manage their own events.
- Registrations are per-UID subcollection; rules enforce deadline and capacity.
- Notifications readable by their owner; announcements public read, admin write.

Deploy:

```bash
npx firebase deploy --only firestore:rules,storage
```

## Cloud Functions

- `onRegistrationCreated`: creates in-app notification and optional SendGrid email.
- `sendEventReminders`: daily reminder emails for events starting within 24h.

Deploy:

```bash
npm --prefix functions run deploy
```

Set SendGrid API key secret (GitHub and local):

- In Firebase (runtime env for Functions): add `SENDGRID_API_KEY` to environment variables (Functions > Variables) or deploy with `--env-vars-file`.
- In GitHub Actions: add `FIREBASE_SERVICE_ACCOUNT` and `FIREBASE_PROJECT_ID` secrets; add `SENDGRID_API_KEY` if you plan to email from CI-triggered deploys.

## Scripts

- `npm run dev` — Vite dev server
- `npm run build` — Production build
- `npm test` — Jest + RTL

## CI and Hosting

Example GitHub Actions workflow `.github/workflows/ci.yml`:

```yaml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm test -- --ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: "${{ secrets.GITHUB_TOKEN }}"
          firebaseServiceAccount: "${{ secrets.FIREBASE_SERVICE_ACCOUNT }}"
          channelId: live
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
```

## Notes

- For production, enable App Check, configure custom domains, and set stricter indexes as data grows.
- Consider adding callable function for organizer approval flow if needed.
