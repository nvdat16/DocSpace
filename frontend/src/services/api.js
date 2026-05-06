export const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const AUTH_TOKEN_KEY = 'docspace_auth_token';

export function getAuthToken() {
  return window.localStorage.getItem(AUTH_TOKEN_KEY) || '';
}

export function setAuthToken(token) {
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function clearAuthToken() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getAuthToken();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function apiGet(path) {
  return request(path);
}

export function apiPost(path, body) {
  return request(path, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
}

export function apiPatch(path, body) {
  return request(path, {
    method: 'PATCH',
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
}

export function apiDelete(path) {
  return request(path, { method: 'DELETE' });
}
