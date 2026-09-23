import { useCallback, useSyncExternalStore } from 'react';

const TOKEN_KEY = 'token';
const USER_KEY = 'nightfall_user';

function readStoredToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

function readStoredUser() {
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Module-level store shared by every useAuth() call, so login()/logout() in
// one component (e.g. Login.jsx) is immediately reflected in every other
// mounted component (e.g. Navbar.jsx) — plain per-component useState can't do
// this, since sibling components never re-render just because localStorage
// changed underneath them.
let authState = { token: readStoredToken(), user: readStoredUser() };
const listeners = new Set();

function setAuthState(next) {
  authState = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return authState;
}

/**
 * Shared login session: the JWT lives under the same 'token' key
 * ExperienceDetails.jsx already reads for member reservations, plus a
 * 'nightfall_user' key holding { email, is_admin } from the login response,
 * so the dashboard can gate on is_admin without decoding the JWT.
 */
function useAuth() {
  const { token, user } = useSyncExternalStore(subscribe, getSnapshot);

  const login = useCallback((nextToken, nextUser) => {
    try {
      window.localStorage.setItem(TOKEN_KEY, nextToken);
      if (nextUser) {
        window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      } else {
        window.localStorage.removeItem(USER_KEY);
      }
    } catch {
      // localStorage may be unavailable (private mode, blocked storage); the
      // session still works for the current page render.
    }
    setAuthState({ token: nextToken, user: nextUser || null });
  }, []);

  const logout = useCallback(() => {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    } catch {
      // See above.
    }
    setAuthState({ token: '', user: null });
  }, []);

  return { token, user, isAdmin: Boolean(user?.is_admin), login, logout };
}

export default useAuth;
