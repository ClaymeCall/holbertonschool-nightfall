const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5080/api';

/**
 * Thin fetch wrapper: JSON in/out, throws on non-2xx with the server's
 * error message (or the status text) attached.
 */
async function apiRequest(path, { token, ...options } = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const message = body?.error || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return body;
}

export { apiRequest, API_URL };
