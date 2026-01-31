import { render, screen } from '@testing-library/react';
import App from '../App';
import { AuthProvider } from '../contexts/AuthContext';
import { vi } from 'vitest';

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn((_auth, callback) => {
    callback(null); // Simulate unauthenticated state by default
    return () => {}; // Unsubscribe function
  }),
}));

// Mock firebase lib to avoid emulator connection logs
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    loginWithGoogle: vi.fn(),
    currentUser: null,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('Login Flow', () => {
  it('shows login button when user is not authenticated', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    const loginButton = screen.getByRole('button', {
      name: /sign in with google/i,
    });
    expect(loginButton).toBeInTheDocument();
  });
});
