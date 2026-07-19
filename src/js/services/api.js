// ─── Central API Service ──────────────────────────────────────
// All HTTP calls to the Spring Boot backend go through this file.
// JWT token is automatically attached to every protected request.

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8183';

// ─── Token helpers ────────────────────────────────────────────

export const tokenStorage = {
  get: () => localStorage.getItem('doliuw_token'),
  set: (token) => localStorage.setItem('doliuw_token', token),
  clear: () => localStorage.removeItem('doliuw_token'),
};

export const userStorage = {
  get: () => {
    try {
      const u = localStorage.getItem('doliuw_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  },
  set: (user) => localStorage.setItem('doliuw_user', JSON.stringify(user)),
  clear: () => localStorage.removeItem('doliuw_user'),
};

// ─── Core fetch wrapper ───────────────────────────────────────

async function request(path, options = {}) {
  const token = tokenStorage.get();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // 401 → clear auth and redirect to login
  if (res.status === 401) {
    tokenStorage.clear();
    userStorage.clear();
    window.location.href = '/login';
    return;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.detail || data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

// ─── Auth API ─────────────────────────────────────────────────

export const authApi = {
  signupEmail: (name, email, password) =>
    request('/api/auth/signup/email', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  loginEmail: (email, password) =>
    request('/api/auth/login/email', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  sendOtp: (mobile, name) =>
    request('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile, ...(name ? { name } : {}) }),
    }),

  verifyOtp: (mobile, otp, name) =>
    request('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile, otp, ...(name ? { name } : {}) }),
    }),

  googleSignIn: (idToken) =>
    request('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    }),

  me: () => request('/api/auth/me'),

  logout: () =>
    request('/api/auth/logout', { method: 'POST' }),
};

// ─── Companies API ────────────────────────────────────────────

export const companiesApi = {
  getAll: (category = 'all') =>
    request(`/api/companies?category=${category}`),

  getById: (id) =>
    request(`/api/companies/${id}`),
};

// ─── Roles API ────────────────────────────────────────────────

export const rolesApi = {
  getAll: () => request('/api/roles'),
  getById: (id) => request(`/api/roles/${id}`),
};

// ─── Mock Tests API ───────────────────────────────────────────

export const mockTestsApi = {
  getAll: (type) =>
    request(`/api/mock-tests/list${type ? `?type=${type}` : ''}`),
};

// ─── Progress API (JWT required) ──────────────────────────────

export const progressApi = {
  get: () => request('/api/progress'),

  update: (progressData) =>
    request('/api/progress', {
      method: 'PUT',
      body: JSON.stringify(progressData),
    }),
};

// ─── Bookings API (JWT required) ──────────────────────────────

export const bookingsApi = {
  getMyBookings: () => request('/api/bookings'),

  create: (serviceId, serviceName, price, bookingDate, timeSlot) =>
    request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ serviceId, serviceName, price, bookingDate, timeSlot }),
    }),

  cancel: (bookingId) =>
    request(`/api/bookings/${bookingId}`, { method: 'DELETE' }),
};

// ─── Help / Complaints API (JWT required) ─────────────────────

export const helpApi = {
  submit: (subject, message) =>
    request('/api/help', {
      method: 'POST',
      body: JSON.stringify({ subject, message }),
    }),

  myComplaints: () => request('/api/help/my'),
};

// ─── Admin API (JWT required + admin role) ────────────────────

export const adminApi = {
  getStats: () => request('/api/admin/stats'),
  getUsers: () => request('/api/admin/users'),
  getBookings: () => request('/api/admin/bookings'),
  getComplaints: () => request('/api/admin/complaints'),
  updateComplaintStatus: (id, status) =>
    request(`/api/admin/complaints/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  getCourses: () => request('/api/admin/courses'),
  createCourse: (data) =>
    request('/api/admin/courses', { method: 'POST', body: JSON.stringify(data) }),
  updateCourse: (id, data) =>
    request(`/api/admin/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCourse: (id) =>
    request(`/api/admin/courses/${id}`, { method: 'DELETE' }),
  getMockCompanies: () => request('/api/admin/mock-companies'),
  createMockCompany: (data) =>
    request('/api/admin/mock-companies', { method: 'POST', body: JSON.stringify(data) }),
  deleteMockCompany: (id) =>
    request(`/api/admin/mock-companies/${id}`, { method: 'DELETE' }),
};
