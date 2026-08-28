import { useEffect, useState } from 'react';

// Debounces a fast-changing value (e.g. search text) so expensive
// filtering only runs after the user pauses typing.
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}

export default useDebouncedValue;
