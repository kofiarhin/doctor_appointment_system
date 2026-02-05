import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils';
import { useAuth } from '../hooks/useAuth';
import { useDoctors, useDoctor } from '../hooks/useDoctors';
import { useAppointments } from '../hooks/useAppointments';
import { useProfile } from '../hooks/useProfile';

const AuthConsumer = () => {
  const { user } = useAuth();
  return <div>{user ? user.email : 'no-user'}</div>;
};

const DoctorsConsumer = () => {
  const { data } = useDoctors();
  return <div>{data?.doctors?.length || 0}</div>;
};

const DoctorConsumer = ({ doctorId }) => {
  const { data } = useDoctor(doctorId);
  return <div>{data?.doctor?.specialty || 'none'}</div>;
};

const AppointmentsConsumer = () => {
  const { data, createAppointment } = useAppointments();
  return (
    <div>
      <span>{data?.appointments?.length || 0}</span>
      <button type="button" onClick={() => createAppointment({ doctorId: 'd1', datetime: '2030-01-01T00:00:00.000Z' })}>
        Create
      </button>
    </div>
  );
};

const ProfileConsumer = () => {
  const { updateProfile } = useProfile();
  return (
    <button type="button" onClick={() => updateProfile({ name: 'New Name' })}>
      Update
    </button>
  );
};

describe('hooks', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns auth user', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ user: { email: 'user@example.com' } })
    }));

    renderWithProviders(<AuthConsumer />);

    expect(await screen.findByText('user@example.com')).toBeInTheDocument();
  });

  it('returns doctors list', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ doctors: [{ id: '1' }, { id: '2' }] })
    }));

    renderWithProviders(<DoctorsConsumer />);
    expect(await screen.findByText('2')).toBeInTheDocument();
  });

  it('returns doctor detail', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ doctor: { specialty: 'Cardiology' } })
    }));

    renderWithProviders(<DoctorConsumer doctorId="doc1" />);
    expect(await screen.findByText('Cardiology')).toBeInTheDocument();
  });

  it('creates appointment', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ appointments: [] })
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: vi.fn().mockResolvedValue({ appointment: { id: 'a1' } })
      }));

    renderWithProviders(<AppointmentsConsumer />);
    await user.click(await screen.findByRole('button', { name: 'Create' }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  });

  it('updates profile', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ user: { name: 'New Name' } })
    }));

    renderWithProviders(<ProfileConsumer />);
    await user.click(screen.getByRole('button', { name: 'Update' }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });
});
