export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function getApiHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...extraHeaders };
  const email = localStorage.getItem('user_email');
  if (email) {
    headers['x-user-email'] = email;
  }
  return headers;
}

