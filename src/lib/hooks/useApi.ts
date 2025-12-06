/**
 * useApi Hook
 * Custom hook for API calls with loading and error states
 */

import { useState, useCallback } from 'react';
import type { AxiosError } from 'axios';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T = any, P = any>(
  apiFunction: (params: P) => Promise<T>,
  options?: UseApiOptions<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (params: P) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction(params);
        setData(result);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err as AxiosError;
        const errorMessage = error.response?.data 
          ? JSON.stringify(error.response.data)
          : error.message;
        const finalError = new Error(errorMessage);
        setError(finalError);
        options?.onError?.(finalError);
        throw finalError;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}


