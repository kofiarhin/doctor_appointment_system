import { describe, expect, it, vi } from 'vitest';
import { baseUrl, getHealth } from '../../src/api';

describe('client api configuration', () => {
  it('points to local backend in development', () => {
    expect(baseUrl).toBe('http://localhost:5000');
  });

  it('fetches health status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok' })
    }));

    await expect(getHealth()).resolves.toEqual({ status: 'ok' });
  });
});
