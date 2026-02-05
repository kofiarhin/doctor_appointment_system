import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import App from '../App';
import { useAuth } from '../hooks/useAuth';
import { useDoctors } from '../hooks/useDoctors';

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn()
}));
vi.mock('../hooks/useDoctors', () => ({
  useDoctors: vi.fn()
}));

describe('App', () => {
  it('renders doctors route by default', () => {
    useAuth.mockReturnValue({ user: null, logout: vi.fn() });
    useDoctors.mockReturnValue({
      data: { doctors: [{ id: '1', user: { name: 'Dr. A' }, specialty: 'Cardio', bio: 'Bio' }] },
      isLoading: false,
      error: null
    });

    renderWithProviders(<App />);
    expect(screen.getByText('Available Doctors')).toBeInTheDocument();
  });
});
