import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Dashboard from '../pages/Dashboard';
import { AuthProvider } from '../contexts/AuthContext';

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  db: {},
  auth: {},
}));

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...actual,
    getFirestore: vi.fn(),
    collection: vi.fn((_db, ...path) => path.join('/')),
    getDocs: vi.fn((path) => {
      // ... (rest is same, just fixing the spread issue by casting actual)
      // Actually I should just cast importOriginal result or verify typing.
      // But for now I will fix the 'children' type in AuthProvider mock below.
      // ... (rest is same, just fixing the spread issue by casting actual)
      // Actually I should just cast importOriginal result or verify typing.
      // But for now I will fix the 'children' type in AuthProvider mock below.
      if (path === 'services') {
        return Promise.resolve({
          docs: [
            {
              id: '1',
              data: () => ({
                name: 'Netflix',
                logo: 'netflix-logo.png',
                managementUrl: '...',
              }),
            },
            {
              id: '2',
              data: () => ({
                name: 'Spotify',
                logo: 'spotify-logo.png',
                managementUrl: '...',
              }),
            },
          ],
        });
      }
      return Promise.resolve({ docs: [] });
    }),
    // Mock for user subscriptions query
    query: vi.fn(),
  };
});

// Mock Auth to be logged in
vi.mock('../contexts/AuthContext', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../contexts/AuthContext')>();
  return {
    ...actual,
    useAuth: () => ({
      currentUser: { uid: 'test-uid', displayName: 'Test User' },
      logout: vi.fn(),
    }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
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
