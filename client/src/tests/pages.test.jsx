import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils';
import AboutPage from '../pages/AboutPage';
import DoctorsPage from '../pages/DoctorsPage';
import AppointmentsPage from '../pages/AppointmentsPage';
import BookPage from '../pages/BookPage';
import ProfilePage from '../pages/ProfilePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import { useDoctors, useDoctor } from '../hooks/useDoctors';
import { useAppointments } from '../hooks/useAppointments';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

vi.mock('../hooks/useDoctors', () => ({
  useDoctors: vi.fn(),
  useDoctor: vi.fn()
}));
vi.mock('../hooks/useAppointments', () => ({
  useAppointments: vi.fn()
}));
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn()
}));
vi.mock('../hooks/useProfile', () => ({
  useProfile: vi.fn()
}));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ doctorId: 'doc1' })
  };
});

describe('pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders about page', () => {
    renderWithProviders(<AboutPage />);
    expect(screen.getByText('About Doctor On Demand')).toBeInTheDocument();
  });

  it('renders doctors page states', () => {
    useDoctors.mockReturnValueOnce({ isLoading: true });
    const { rerender } = renderWithProviders(<DoctorsPage />);
    expect(screen.getByText('Loading doctors...')).toBeInTheDocument();

    useDoctors.mockReturnValueOnce({ error: new Error('fail') });
    rerender(<DoctorsPage />);
    expect(screen.getByText('Unable to load doctors.')).toBeInTheDocument();

    useDoctors.mockReturnValueOnce({
      data: { doctors: [{ id: '1', user: { name: 'Dr. A' }, specialty: 'Cardio', bio: 'Bio' }] }
    });
    rerender(<DoctorsPage />);
    expect(screen.getByText('Available Doctors')).toBeInTheDocument();
    expect(screen.getByText('Dr. A')).toBeInTheDocument();
  });

  it('renders appointments page states', async () => {
    useAppointments.mockReturnValueOnce({ isLoading: true, cancelAppointment: vi.fn() });
    const { rerender } = renderWithProviders(<AppointmentsPage />);
    expect(screen.getByText('Loading appointments...')).toBeInTheDocument();

    useAppointments.mockReturnValueOnce({ error: new Error('fail'), cancelAppointment: vi.fn() });
    rerender(<AppointmentsPage />);
    expect(screen.getByText('Unable to load appointments.')).toBeInTheDocument();

    const cancelAppointment = vi.fn();
    useAppointments.mockReturnValueOnce({
      data: {
        appointments: [
          { id: '1', datetime: new Date().toISOString(), status: 'scheduled', doctor: { specialty: 'Ortho' } },
          { id: '2', datetime: new Date().toISOString(), status: 'cancelled', doctor: { specialty: 'Derm' } }
        ]
      },
      cancelAppointment
    });
    rerender(<AppointmentsPage />);
    expect(screen.getByText('Your appointments')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(cancelAppointment).toHaveBeenCalledWith('1');
  });

  it('renders book page states', async () => {
    useAppointments.mockReturnValueOnce({ createAppointment: vi.fn() });
    useDoctor.mockReturnValueOnce({ isLoading: true });
    const { rerender } = renderWithProviders(<BookPage />);
    expect(screen.getByText('Loading doctor...')).toBeInTheDocument();

    useAppointments.mockReturnValueOnce({ createAppointment: vi.fn() });
    useDoctor.mockReturnValueOnce({ error: new Error('fail') });
    rerender(<BookPage />);
    expect(screen.getByText('Unable to load doctor.')).toBeInTheDocument();

    const createAppointment = vi.fn().mockResolvedValue({});
    useDoctor.mockReturnValueOnce({ data: { doctor: { user: { name: 'Dr. B' } } } });
    useAppointments.mockReturnValueOnce({ createAppointment });
    rerender(<BookPage />);

    await userEvent.type(screen.getByLabelText('Preferred date & time'), '2030-01-01T10:00');
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    await waitFor(() => expect(createAppointment).toHaveBeenCalled());
  });

  it('handles book page error message', async () => {
    const createAppointment = vi.fn().mockRejectedValue(new Error('Failed'));
    useDoctor.mockReturnValueOnce({ data: { doctor: { user: { name: 'Dr. C' } } } });
    useAppointments.mockReturnValueOnce({ createAppointment });

    renderWithProviders(<BookPage />);

    await userEvent.type(screen.getByLabelText('Preferred date & time'), '2030-01-01T10:00');
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(await screen.findByText('Failed')).toBeInTheDocument();
  });

  it('updates profile', async () => {
    useAuth.mockReturnValue({ user: { name: 'Old', email: 'old@example.com' } });
    const updateProfile = vi.fn().mockResolvedValue({});
    useProfile.mockReturnValue({ updateProfile });

    renderWithProviders(<ProfilePage />);

    await userEvent.clear(screen.getByLabelText('Name'));
    await userEvent.type(screen.getByLabelText('Name'), 'New Name');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(updateProfile).toHaveBeenCalledWith({ name: 'New Name' }));
  });

  it('shows profile error message', async () => {
    useAuth.mockReturnValue({ user: { name: 'Old', email: 'old@example.com' } });
    const updateProfile = vi.fn().mockRejectedValue(new Error('Update failed'));
    useProfile.mockReturnValue({ updateProfile });

    renderWithProviders(<ProfilePage />);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Update failed')).toBeInTheDocument();
  });

  it('handles login and error', async () => {
    const login = vi.fn().mockResolvedValue({});
    useAuth.mockReturnValueOnce({ login, loginStatus: 'idle' });

    const { rerender } = renderWithProviders(<LoginPage />);
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'Password123!');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(login).toHaveBeenCalled());

    useAuth.mockReturnValueOnce({ login: vi.fn().mockRejectedValue(new Error('Invalid')), loginStatus: 'idle' });
    rerender(<LoginPage />);
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByText('Invalid')).toBeInTheDocument();
  });

  it('handles register and error', async () => {
    const register = vi.fn().mockResolvedValue({});
    useAuth.mockReturnValueOnce({ register, registerStatus: 'idle' });

    const { rerender } = renderWithProviders(<RegisterPage />);
    await userEvent.type(screen.getByLabelText('Name'), 'User');
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'Password123!');
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));
    await waitFor(() => expect(register).toHaveBeenCalled());

    useAuth.mockReturnValueOnce({
      register: vi.fn().mockRejectedValue(new Error('Failed')),
      registerStatus: 'idle'
    });
    rerender(<RegisterPage />);
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));
    expect(await screen.findByText('Failed')).toBeInTheDocument();
  });
});
