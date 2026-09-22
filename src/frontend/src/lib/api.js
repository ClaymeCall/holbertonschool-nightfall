const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5080/api';

async function doFetch(path, { token, ...options } = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  let body = null;
  let parseError = null;
  try {
    body = await res.json();
  } catch (err) {
    parseError = err;
  }

  return { res, body, parseError };
}

/**
 * Thin fetch wrapper: JSON in/out, throws on non-2xx with the server's
 * error message (or the status text) attached.
 */
async function apiRequest(path, options = {}) {
  const { res, body } = await doFetch(path, options);

  if (!res.ok) {
    const message = body?.error || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return body;
}

/**
 * Fires an arbitrary request and always resolves (never throws for
 * HTTP-level errors) with the raw status/body, for the endpoint
 * catalog's "Try it" console where the point is to inspect any
 * response, including error ones or non-JSON bodies.
 */
async function rawRequest(path, options = {}) {
  const { res, body, parseError } = await doFetch(path, options);
  return {
    status: res.status,
    ok: res.ok,
    body,
    bodyIsUnparseable: Boolean(parseError),
  };
}

export { apiRequest, rawRequest, API_URL };
