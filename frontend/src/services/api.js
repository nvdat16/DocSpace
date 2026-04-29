export const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function apiGet(path) {
  const response = await fetch(`${apiBaseUrl}${path}`);
  return response.json();
}
