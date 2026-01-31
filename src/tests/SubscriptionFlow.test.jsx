import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Dashboard from '../pages/Dashboard';
import { AuthProvider } from '../contexts/AuthContext';
import * as firestore from 'firebase/firestore';

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  db: {},
  auth: {},
}));

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: vi.fn(),
    collection: vi.fn((db, ...path) => path.join('/')),
    doc: vi.fn(),
    getDocs: vi.fn((path) => {
      if (path === 'services') {
        return Promise.resolve({
          docs: [
            {
              id: '1',
              data: () => ({
                name: 'Netflix',
                logo: 'netflix.png',
                managementUrl: '...',
                hasApi: false,
              }),
            },
          ],
        });
      }
      return Promise.resolve({ docs: [] });
    }),
    addDoc: vi.fn(() => Promise.resolve({ id: 'new-sub-id' })),
    onSnapshot: vi.fn(),
  };
});

// Stable user object
const mockCurrentUser = { uid: 'test-user' };

vi.mock('../contexts/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: () => ({
      currentUser: mockCurrentUser,
      logout: vi.fn(),
    }),
    AuthProvider: ({ children }) => children,
  };
});

describe('Subscription Flow', () => {
  it('allows user to add a subscription manually', async () => {
    render(
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    );

    // Wait for services to load
    await screen.findByText('Netflix', {}, { timeout: 3000 });

    // Click on Netflix card
    fireEvent.click(screen.getByText('Netflix'));

    // Modal should appear
    await screen.findByText(/add netflix/i, {}, { timeout: 3000 });

    // Select Manual Entry (or it might be default if hasApi is false)
    // Let's assume there's a button "Add Subscription"
    const addBtn = screen.getByRole('button', { name: /add subscription/i });

    // Fill price inputs if they exist (Contract said "Manual Entry" implies filling details)
    // Checking if price input exists
    const priceInput = screen.getByLabelText(/price/i);
    expect(priceInput).toBeInTheDocument();
    fireEvent.change(priceInput, { target: { value: '15.99' } });

    fireEvent.click(addBtn);

    // Verify addDoc called (to users/test-user/subscriptions)
    expect(firestore.addDoc).toHaveBeenCalledWith(
      expect.anything(), // Collection ref (users/uid/subs)
      expect.objectContaining({
        serviceId: '1',
        name: 'Netflix',
        price: '15.99',
        status: 'active',
      })
    );
  });
});
