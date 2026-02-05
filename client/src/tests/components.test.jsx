import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from './test-utils';
import NavBar from '../components/NavBar';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

describe('components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navbar for guest', () => {
    useAuth.mockReturnValue({ user: null, logout: vi.fn() });
    renderWithProviders(<NavBar />);

    expect(screen.getByText('Doctor On Demand')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('renders navbar for authenticated user', () => {
    useAuth.mockReturnValue({ user: { name: 'Test' }, logout: vi.fn() });
    renderWithProviders(<NavBar />);

    expect(screen.getByText('Appointments')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });

  it('shows loading state in protected route', () => {
    useAuth.mockReturnValue({ user: null, isLoading: true });
    renderWithProviders(
      <Routes>
        <Route path="/" element={<ProtectedRoute>Content</ProtectedRoute>} />
      </Routes>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('redirects to login when unauthenticated', () => {
    useAuth.mockReturnValue({ user: null, isLoading: false });
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/" element={<ProtectedRoute>Content</ProtectedRoute>} />
      </Routes>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    useAuth.mockReturnValue({ user: { name: 'Test' }, isLoading: false });
    renderWithProviders(
      <Routes>
        <Route path="/" element={<ProtectedRoute><div>Content</div></ProtectedRoute>} />
      </Routes>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
