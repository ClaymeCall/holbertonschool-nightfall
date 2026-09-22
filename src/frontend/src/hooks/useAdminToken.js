import { useCallback, useState } from 'react';

const STORAGE_KEY = 'nightfall_admin_token';

function readStoredToken() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

/**
 * Holds the admin's JWT in localStorage until the login page (#33) and
 * POST /api/auth/login (#20) exist. Until then, an admin pastes a token
 * minted via the API directly.
 */
function useAdminToken() {
  const [token, setTokenState] = useState(readStoredToken);

  const setToken = useCallback((next) => {
    setTokenState(next);
    try {
      if (next) {
        window.localStorage.setItem(STORAGE_KEY, next);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage may be unavailable (private mode, blocked storage); the
      // token still works for the current page render.
    }
  }, []);

  const clearToken = useCallback(() => setToken(''), [setToken]);

  return { token, setToken, clearToken };
}

export default useAdminToken;
