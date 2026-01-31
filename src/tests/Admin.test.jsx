import { render, screen, fireEvent } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';
import { vi } from 'vitest';
import * as firestore from 'firebase/firestore';

vi.mock('../lib/firebase', () => ({
  db: {},
  auth: {},
}));

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: vi.fn(),
    collection: vi.fn(() => 'mock-collection-ref'),
    addDoc: vi.fn(() => Promise.resolve({ id: 'mock-doc-id' })),
  };
});

describe('Admin Service Creation', () => {
  it('allows admin to add a new service', async () => {
    render(<AdminDashboard />);

    // Check for inputs
    expect(screen.getByLabelText(/service name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/logo url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/management url/i)).toBeInTheDocument();

    // Fill form
    fireEvent.change(screen.getByLabelText(/service name/i), {
      target: { value: 'Netflix' },
    });
    fireEvent.change(screen.getByLabelText(/logo url/i), {
      target: { value: 'https://netflix.com/logo.png' },
    });
    fireEvent.change(screen.getByLabelText(/management url/i), {
      target: { value: 'https://netflix.com' },
    });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /add service/i });
    fireEvent.click(submitBtn);

    // Verify Firestore call
    expect(firestore.addDoc).toHaveBeenCalledWith(
      expect.anything(), // collection reference
      expect.objectContaining({
        name: 'Netflix',
        logo: 'https://netflix.com/logo.png',
        managementUrl: 'https://netflix.com',
        hasApi: false,
      })
    );
  });
});
