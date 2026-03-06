'use client';

import { useCallback, useEffect, useState } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

export function useRecaptcha() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Skip if no site key configured
    if (!RECAPTCHA_SITE_KEY) {
      setIsLoaded(true);
      return;
    }

    // Check if already loaded
    if (window.grecaptcha) {
      setIsLoaded(true);
      return;
    }

    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.grecaptcha.ready(() => {
        setIsLoaded(true);
      });
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(`script[src*="recaptcha"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const executeRecaptcha = useCallback(async (action: string): Promise<string | null> => {
    // If no site key, return null (backend will bypass verification)
    if (!RECAPTCHA_SITE_KEY) {
      return null;
    }

    if (!isLoaded || !window.grecaptcha) {
      console.warn('reCAPTCHA not loaded yet');
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution error:', error);
      return null;
    }
  }, [isLoaded]);

  return {
    isLoaded,
    executeRecaptcha,
  };
}
