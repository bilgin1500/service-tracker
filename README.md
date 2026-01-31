# Subscription Tracker

A comprehensive web application to track digital subscriptions, built with React, Vite, and Firebase.

## Features

- **User Authentication**: Google Sign-In via Firebase Auth.
- **Dashboard**: View active subscriptions and available services.
- **Service Discovery**: Browse supported services (Netflix, Spotify, etc.).
- **Subscription Management**: Add subscriptions via API connection (simulated) or manual entry.
- **Admin Interface**: Manage available services (add new services).
- **Premium UI**: Modern, responsive design with dark mode aesthetics.

## Tech Stack

- **Frontend**: React, Vite, CSS Modules (Variables)
- **Backend**: Firebase (Auth, Firestore)
- **Testing**: Vitest (`yarn test`)
- **State Management**: React Context API

## Local Development

1. **Clone the repo**
2. **Install dependencies**:
   ```bash
   yarn install
   ```
3. **Setup Environment**:
   Create `.env.local` with your Firebase config:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   ...
   ```
4. **Start Emulators**:
   ```bash
   firebase emulators:start
   ```
5. **Run App**:
   ```bash
   yarn dev
   ```
   Open [http://localhost:5173](http://localhost:5173).

## Deployment

Build the project:

```bash
yarn build
```

Deploy to Firebase Hosting:

```bash
firebase deploy
```
