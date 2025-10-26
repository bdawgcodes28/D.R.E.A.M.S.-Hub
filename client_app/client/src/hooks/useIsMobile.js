import { useState, useEffect } from 'react';

/**
 * Custom hook to detect mobile and tablet screen sizes
 * Returns true for screens that are tablet size or smaller (typically <= 768px)
 * Continuously listens for window resize events
 * 
 * @returns {boolean} true if screen is mobile/tablet size, false otherwise
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    // Initialize with current window size
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false; // Default for SSR
  });

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on mount
    checkIsMobile();

    // Listen for resize events
    window.addEventListener('resize', checkIsMobile);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
