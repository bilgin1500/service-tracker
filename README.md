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

## IDE Setup (VS Code)

This project uses **Yarn PnP** (Plug'n'Play) for dependency management. To ensure proper TypeScript and ESLint support in VS Code:

1. **Install recommended extensions** (VS Code will prompt you automatically)
2. **Select Workspace TypeScript version**:
   - Open any `.ts` or `.tsx` file
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "TypeScript: Select TypeScript Version"
   - Choose **"Use Workspace Version"**

If you encounter module resolution errors after installing new packages, reload VS Code (`Cmd+Shift+P` → "Developer: Reload Window").

## Linting

Run linters to check for code quality issues:

```bash
# Lint both JavaScript/TypeScript and CSS
yarn lint

# Lint only JavaScript/TypeScript files
yarn lint:js

# Lint only CSS files
yarn lint:css
```

The project uses:

- **ESLint** for JavaScript and TypeScript files with React-specific rules
- **Stylelint** for CSS files with essential validation rules

## Deployment

Build the project:

```bash
yarn build
```

Deploy to Firebase Hosting:

```bash
firebase deploy
```
