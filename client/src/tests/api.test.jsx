import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiRequest, authApi, appointmentsApi, doctorsApi, usersApi } from '../services/api';

describe('api service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns json for successful response', async () => {
    const json = { ok: true };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(json)
    }));

    const result = await apiRequest('/api/health');
    expect(result).toEqual(json);
  });

  it('returns null for 204 response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      json: vi.fn()
    }));

    const result = await apiRequest('/api/empty');
    expect(result).toBeNull();
  });

  it('throws error on failed response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({ error: { message: 'Bad Request' } })
    }));

    await expect(apiRequest('/api/bad')).rejects.toThrow('Bad Request');
  });

  it('handles error fallback when json fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockRejectedValue(new Error('invalid'))
    }));

    await expect(apiRequest('/api/error')).rejects.toThrow('Request failed');
  });

  it('calls auth api helpers', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ user: { id: '1' } })
    }));

    await authApi.register({ name: 'Test', email: 'test@example.com', password: 'Password123!' });
    await authApi.login({ email: 'test@example.com', password: 'Password123!' });
    await authApi.me();
    await authApi.logout();
    expect(fetch).toHaveBeenCalledWith('/api/auth/login', expect.any(Object));
  });

  it('calls doctor and appointment helpers', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ message: 'ok' })
    }));

    await doctorsApi.list();
    await doctorsApi.get('doc1');
    await appointmentsApi.list();
    await appointmentsApi.create({ doctorId: 'doc1', datetime: '2030-01-01T00:00:00.000Z' });
    await appointmentsApi.update('appt1', { status: 'cancelled' });
    await appointmentsApi.cancel('123');
    await usersApi.updateProfile({ name: 'New Name' });
    expect(fetch).toHaveBeenCalledWith('/api/appointments/123/cancel', expect.any(Object));
  });
});
