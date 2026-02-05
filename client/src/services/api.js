export const apiRequest = async (path, options = {}) => {
  const response = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: { message: 'Error' } }));
    throw new Error(errorBody.error?.message || 'Request failed');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const authApi = {
  register: (payload) => apiRequest('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => apiRequest('/api/auth/me'),
  logout: () => apiRequest('/api/auth/logout', { method: 'POST' })
};

export const doctorsApi = {
  list: () => apiRequest('/api/doctors'),
  get: (id) => apiRequest(`/api/doctors/${id}`)
};

export const appointmentsApi = {
  list: () => apiRequest('/api/appointments'),
  create: (payload) =>
    apiRequest('/api/appointments', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) =>
    apiRequest(`/api/appointments/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  cancel: (id) => apiRequest(`/api/appointments/${id}/cancel`, { method: 'POST' })
};

export const usersApi = {
  updateProfile: (payload) =>
    apiRequest('/api/users/profile', { method: 'PUT', body: JSON.stringify(payload) })
};
