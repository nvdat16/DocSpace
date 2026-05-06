import { apiPost } from './api';

export function register(payload) {
  return apiPost('/api/auth/register', payload);
}

export function login(payload) {
  return apiPost('/api/auth/login', payload);
}
