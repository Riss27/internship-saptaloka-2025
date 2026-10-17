import { useEffect, useState } from "react";

/**
 * Delayed loading flag.
 *
 * Public pages fetch on mount, and on a fast local backend the response often
 * arrives in well under 300ms. Rendering the full-page spinner for that brief
 * window makes every navigation flash a spinner, which the page-transition
 * animation then makes obvious. This hook returns true only after `isLoading`
 * has stayed true for `delay` ms, so fast fetches never show the spinner at
 * all, while genuinely slow ones show it after the delay. When loading
 * finishes, the flag drops to false immediately.
 *
 * @param {boolean} isLoading - The raw loading state from the component.
 * @param {number} [delay=300] - Milliseconds to wait before showing the loader.
 * @returns {boolean} Whether the delayed loader should be rendered.
 */
export const useDelayedLoading = (isLoading, delay = 300) => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowLoader(false);
      return undefined;
    }
    const timer = setTimeout(() => setShowLoader(true), delay);
    return () => clearTimeout(timer);
  }, [isLoading, delay]);

  return showLoader;
};
