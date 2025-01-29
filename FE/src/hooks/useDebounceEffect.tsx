import { useEffect } from 'react';

/**
 * A hook to debounce any function execution when dependencies change.
 * @param callback - Function to execute after debounce delay.
 * @param dependencies - Dependencies that trigger the callback.
 * @param delay - Debounce delay in milliseconds.
 */
const useDebounceEffect = (
  callback: () => void,
  dependencies: any[],
  delay: number,
) => {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => clearTimeout(handler);
  }, [...dependencies, delay]);
};

export default useDebounceEffect;
