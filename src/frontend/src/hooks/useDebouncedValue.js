import { useEffect, useState } from 'react';

/**
 * Returns a version of `value` that only updates after `delay` ms have
 * passed without `value` changing again.
 */
function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebouncedValue;
