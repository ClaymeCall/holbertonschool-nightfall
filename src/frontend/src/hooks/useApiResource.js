import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

/**
 * Fetches `path` and tracks loading/error state. Pass `enabled: false` to
 * skip fetching (e.g. while an admin token hasn't been provided yet).
 */
function useApiResource(path, { token, enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  const refetch = useCallback(() => setReloadIndex((n) => n + 1), []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    apiRequest(path, { token })
      .then((body) => {
        if (!cancelled) {
          setData(body);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, token, enabled, reloadIndex]);

  return { data, loading, error, refetch };
}

export default useApiResource;
