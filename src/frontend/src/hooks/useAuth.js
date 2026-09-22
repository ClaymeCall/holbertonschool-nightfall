import { useCallback, useState } from 'react';

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

/**
 * Shared login session: the JWT lives under the same 'token' key
 * ExperienceDetails.jsx already reads for member reservations, plus a
 * 'nightfall_user' key holding { email, is_admin } from the login response,
 * so the dashboard can gate on is_admin without decoding the JWT.
 */
function useAuth() {
  const [token, setTokenState] = useState(readStoredToken);
  const [user, setUserState] = useState(readStoredUser);

  const login = useCallback((nextToken, nextUser) => {
    setTokenState(nextToken);
    setUserState(nextUser || null);
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
  }, []);

  const logout = useCallback(() => {
    setTokenState('');
    setUserState(null);
    try {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    } catch {
      // See above.
    }
  }, []);

  return { token, user, isAdmin: Boolean(user?.is_admin), login, logout };
}

export default useAuth;
