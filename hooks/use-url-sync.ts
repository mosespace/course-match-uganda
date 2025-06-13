// @/hooks/use-url-sync.ts
import { useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface UrlParams {
  search: string;
  level: string;
  description: string;
  year: string;
  sort: string;
  view: string;
  page: number;
}

/**
 * A custom hook to synchronize component state with URL query parameters
 * with debouncing and initial load handling.
 *
 * @param {UrlParams} currentParams - The current state values to be synced to the URL.
 * @param {number} debounceDelay - The delay in milliseconds before updating the URL.
 * @returns {void}
 */
export const useUrlSync = (currentParams: UrlParams, debounceDelay: number) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ref to track if the component has mounted and finished its initial state setup from URL
  const isMounted = useRef(false);
  // Ref to hold the debounce timeout ID
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize current params to compare against initial
  const currentParamsRef = useRef(currentParams);
  currentParamsRef.current = currentParams; // Keep ref updated with latest props

  // Effect to handle initial state load from URL on component mount
  useEffect(() => {
    // This effect runs only once on initial mount to set the component's state
    // based on the URL query parameters.
    // It also marks the component as mounted after state initialization.
    isMounted.current = true;

    // Cleanup function: clears any lingering debounce timers and resets mounted state
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      isMounted.current = false;
    };
  }, []); // Empty dependency array means it runs once on mount and cleanup on unmount

  // Effect to synchronize state changes to URL parameters with debouncing
  useEffect(() => {
    // This effect runs on subsequent changes to currentParams (from user interaction)

    if (!isMounted.current) {
      // Prevent URL update on the very first render and state initialization from URL
      return;
    }

    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Schedule a new URL update after the debounce delay
    debounceTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams();

      if (currentParamsRef.current.search)
        params.set('search', currentParamsRef.current.search);
      if (currentParamsRef.current.level)
        params.set('level', currentParamsRef.current.level);
      if (currentParamsRef.current.description)
        params.set('description', currentParamsRef.current.description);
      if (currentParamsRef.current.year)
        params.set('year', currentParamsRef.current.year);
      if (currentParamsRef.current.sort !== 'default')
        params.set('sort', currentParamsRef.current.sort);
      if (currentParamsRef.current.view !== 'grid')
        params.set('view', currentParamsRef.current.view);
      if (currentParamsRef.current.page > 1)
        params.set('page', currentParamsRef.current.page.toString());

      const newUrl = params.toString()
        ? `/courses?${params.toString()}`
        : '/courses';

      // Only navigate if the URL is actually different
      // This is crucial to prevent unnecessary navigations and potential re-renders
      if (
        typeof window !== 'undefined' &&
        window.location.search !== `?${params.toString()}`
      ) {
        router.replace(newUrl, { scroll: false });
      }
    }, debounceDelay);

    // Cleanup function for this effect: clears the timeout if dependencies change before it fires
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // The dependency array: triggers this effect when any of these values change.
    // By passing `currentParams`, we ensure the effect reacts to prop changes
    // which represent the aggregated state.
  }, [currentParams, debounceDelay, router]); // Include router as a dependency for useCallback stability
};
