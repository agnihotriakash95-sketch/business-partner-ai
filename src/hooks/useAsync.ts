import { useCallback, useState } from 'react';

export const useAsync = <TArgs extends unknown[], TResult>(handler: (...args: TArgs) => Promise<TResult>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (...args: TArgs) => {
      setLoading(true);
      setError(null);
      try {
        return await handler(...args);
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : 'Something went wrong';
        setError(message);
        throw caught;
      } finally {
        setLoading(false);
      }
    },
    [handler],
  );

  return { run, loading, error };
};
