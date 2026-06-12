// Smart Recipe Generator — Frontend API Client
const API_BASE = '/api';

// ── Token helpers ────────────────────────────────────────
const getToken   = ()  => localStorage.getItem('srg_token');
const setToken   = (t) => localStorage.setItem('srg_token', t);
const clearToken = ()  => localStorage.removeItem('srg_token');

// ── Base fetch wrapper ───────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ── AUTH ─────────────────────────────────────────────────
const Auth = {
  async register(name, email, password) {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setToken(data.token);
    return data.user;
  },

  async login(email, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data.user;
  },

  async me() {
    const data = await apiFetch('/auth/me');
    return data.user;
  },

  logout() {
    clearToken();
  },
};

// ── RECIPES ──────────────────────────────────────────────
const Recipes = {
  async generate(payload) {
    const data = await apiFetch('/recipes/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data.recipe;
  },

  async getAll(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const data = await apiFetch(`/recipes${qs ? '?' + qs : ''}`);
    return data;
  },

  async getStats() {
    const data = await apiFetch('/recipes/stats');
    return data.stats;
  },

  async toggleFavourite(id) {
    const data = await apiFetch(`/recipes/${id}/favourite`, { method: 'PATCH' });
    return data.isFavourite;
  },

  async delete(id) {
    await apiFetch(`/recipes/${id}`, { method: 'DELETE' });
  },
};
