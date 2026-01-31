import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Dashboard from '../pages/Dashboard';
import { AuthProvider } from '../contexts/AuthContext';

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  db: {},
  auth: {}
}));

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: vi.fn(),
    collection: vi.fn((db, ...path) => path.join('/')),
    getDocs: vi.fn(() => Promise.resolve({
      docs: [
        {
          id: '1',
          data: () => ({ name: 'Netflix', logo: 'netflix-logo.png', managementUrl: '...' })
        },
        {
          id: '2',
          data: () => ({ name: 'Spotify', logo: 'spotify-logo.png', managementUrl: '...' })
        }
      ]
    })),
    // Mock for user subscriptions query
    query: vi.fn(),
  };
});

// Mock Auth to be logged in
const mockCurrentUser = { uid: 'test-user' };

vi.mock('../contexts/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: () => ({
      currentUser: mockCurrentUser,
      logout: vi.fn()
    }),
    AuthProvider: ({ children }) => children
  };
});


describe('Service Discovery', () => {
  it('displays available services fetched from firestore', async () => {
    render(
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    );

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();

    // Wait for services to load
    await screen.findByText('Netflix', {}, { timeout: 3000 });
    expect(screen.getByText('Spotify')).toBeInTheDocument();
  });
});
