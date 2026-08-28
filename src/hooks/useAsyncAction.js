import { useCallback, useState } from 'react';

// Small helper hook to simulate an async action (e.g. API calls) with
// loading / error state, used across booking & payment flows.
export function useAsyncAction(action) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await action(...args);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [action]
  );

  return { run, loading, error };
}

export default useAsyncAction;
