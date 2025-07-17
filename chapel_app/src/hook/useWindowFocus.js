// hooks/useWindowFocus.js
import { useEffect } from 'react';

export const useWindowFocus = (callback) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        callback();
      }
    };

    window.addEventListener('focus', callback);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', callback);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [callback]);
};