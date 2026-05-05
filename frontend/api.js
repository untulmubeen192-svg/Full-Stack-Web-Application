/**
 * api.js — Glow Reeba Beauty
 * Central API helper. Import in any page that needs backend calls.
 * Usage: <script src="api.js"></script>
 */

const API_BASE = 'http://localhost:5000/api';

/* ─── Token helpers ─── */
const Auth = {
  setToken(token) { localStorage.setItem('gb_token', token); },
  getToken()      { return localStorage.getItem('gb_token'); },
  removeToken()   { localStorage.removeItem('gb_token'); localStorage.removeItem('gb_user'); },
  setUser(user)   { localStorage.setItem('gb_user', JSON.stringify(user)); },
  getUser()       { const u = localStorage.getItem('gb_user'); return u ? JSON.parse(u) : null; },
  isLoggedIn()    { return !!this.getToken(); },
  isAdmin()       { const u = this.getUser(); return u && u.role === 'admin'; },
};

/* ─── Base fetch wrapper ─── */
async function apiFetch(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token   = Auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API error');
  return data;
}

/* ─── Auth API ─── */
const AuthAPI = {
  async signup(name, email, phone, password) {
    const data = await apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password }),
    });
    Auth.setToken(data.token);
    Auth.setUser(data.user);
    return data;
  },

  async login(email, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    Auth.setToken(data.token);
    Auth.setUser(data.user);
    return data;
  },

  logout() {
    Auth.removeToken();
    window.location.href = 'index.html';
  },

  async forgotPassword(email) {
    return apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token, password) {
    const data = await apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
    Auth.setToken(data.token);
    Auth.setUser(data.user);
    return data;
  },

  async getProfile() {
    return apiFetch('/auth/profile');
  },
};

/* ─── Products API ─── */
const ProductsAPI = {
  async getAll(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/products${qs ? '?' + qs : ''}`);
  },

  async getOne(id) {
    return apiFetch(`/products/${id}`);
  },

  async create(formData) {
    const token = Auth.getToken();
    const res = await fetch(`${API_BASE}/products`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}` },
      body:    formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async update(id, formData) {
    const token = Auth.getToken();
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method:  'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body:    formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async delete(id) {
    return apiFetch(`/products/${id}`, { method: 'DELETE' });
  },

  imageUrl(filename) {
    return `http://localhost:5000/uploads/products/${filename}`;
  },
};

/* ─── Inquiry API ─── */
const InquiryAPI = {
  async submit(payload) {
    return apiFetch('/inquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

/* ─── WhatsApp API ─── */
const WhatsAppAPI = {
  async productLink(productName, price, productId, name, email, phone) {
    const data = await apiFetch('/whatsapp/product', {
      method: 'POST',
      body: JSON.stringify({ productName, price, productId, name, email, phone }),
    });
    return data.link;
  },

  async cartLink(items) {
    const data = await apiFetch('/whatsapp/cart', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
    return data.link;
  },

  async generalLink(message) {
    const data = await apiFetch('/whatsapp/general', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    return data.link;
  },
};

/* ─── Nav: update header based on login state ─── */
function updateNav() {
  const loginLink = document.getElementById('nav-login');
  const logoutLink = document.getElementById('nav-logout');
  const adminLink  = document.getElementById('nav-admin');
  if (!loginLink) return;

  if (Auth.isLoggedIn()) {
    loginLink.style.display  = 'none';
    logoutLink.style.display = 'inline';
    if (adminLink) adminLink.style.display = Auth.isAdmin() ? 'inline' : 'none';
  } else {
    loginLink.style.display  = 'inline';
    logoutLink.style.display = 'none';
    if (adminLink) adminLink.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', updateNav);
