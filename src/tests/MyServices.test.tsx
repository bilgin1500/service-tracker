import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Dashboard from '../pages/Dashboard';
import { AuthProvider } from '../contexts/AuthContext';

// Mock Firebase
vi.mock('../lib/firebase', async () => {
  return {
    db: {},
    auth: {},
  };
});

vi.mock('firebase/firestore', async () => {
  return {
    getFirestore: vi.fn(),
    collection: vi.fn((_db, ...path) => path.join('/')),
    getDocs: vi.fn((path) => {
      if (path === 'services') {
        return Promise.resolve({ docs: [] }); // Available services
      }
      if (path === 'users/test-user/subscriptions') {
        return Promise.resolve({
          docs: [
            {
              id: 'sub1',
              data: () => ({
                name: 'Disney+',
                price: '7.99',
                status: 'active',
                serviceId: 'dplus',
              }),
            },
          ],
        });
      }
      return Promise.resolve({ docs: [] });
    }),
    addDoc: vi.fn(),
  };
});

const mockCurrentUser = { uid: 'test-user' };

vi.mock('../contexts/AuthContext', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../contexts/AuthContext')>();
  return {
    ...(actual as object),
    useAuth: () => ({
      currentUser: mockCurrentUser,
      logout: vi.fn(),
    }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

describe('My Services Persistence', () => {
  it('displays user subscriptions', async () => {
    render(
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    );

    // Should see "My Subscriptions" and the service
    await waitFor(() => {
      expect(screen.getByText(/my subscriptions/i)).toBeInTheDocument();
      expect(screen.getByText('Disney+')).toBeInTheDocument();
      expect(screen.getByText('$7.99')).toBeInTheDocument();
    });
  });
});
