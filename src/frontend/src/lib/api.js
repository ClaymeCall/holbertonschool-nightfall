import { NETWORK_ERROR_MESSAGE, translateApiError } from './apiErrors';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5080/api';
// Backend origin without the /api suffix, used to build static asset URLs (e.g. experience images).
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

async function doFetch(path, { token, body: requestBody, ...options } = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fetchOptions = { ...options, headers };
  // Some fetch implementations reject GET/HEAD requests that carry a `body`
  // key at all, even when its value is undefined, so only set it when there
  // really is one.
  if (requestBody !== undefined) {
    fetchOptions.body = requestBody;
  }

  const res = await fetch(`${API_URL}${path}`, fetchOptions);

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
 * error message (translated to French, see apiErrors.js) attached.
 */
async function apiRequest(path, options = {}) {
  let result;
  try {
    result = await doFetch(path, options);
  } catch {
    // fetch itself rejects (server down, no network) with an English message.
    throw new Error(NETWORK_ERROR_MESSAGE);
  }
  const { res, body } = result;

  if (!res.ok) {
    const message = translateApiError(body?.error || body?.message, res.status);
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

export { apiRequest, rawRequest, API_URL, API_ORIGIN };
