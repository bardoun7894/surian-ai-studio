"use client";

import { useEffect, useRef } from "react";
import { useLoading } from "@/contexts/LoadingContext";

/**
 * Hook for pages that fetch data asynchronously.
 * Keeps the global loading screen visible until the page's data is ready.
 *
 * Usage:
 *   const [data, setData] = useState(null);
 *   const [loading, setLoading] = useState(true);
 *   usePageLoading(loading);
 *
 *   useEffect(() => {
 *     fetchData().then(d => { setData(d); setLoading(false); });
 *   }, []);
 */
export function usePageLoading(isDataLoading: boolean) {
  const { registerPageLoad, completePageLoad } = useLoading();
  const registeredRef = useRef(false);

  useEffect(() => {
    if (isDataLoading && !registeredRef.current) {
      registeredRef.current = true;
      registerPageLoad();
    }

    if (!isDataLoading && registeredRef.current) {
      registeredRef.current = false;
      completePageLoad();
    }

    // Cleanup: if the component unmounts while still loading, complete the load
    return () => {
      if (registeredRef.current) {
        registeredRef.current = false;
        completePageLoad();
      }
    };
  }, [isDataLoading, registerPageLoad, completePageLoad]);
}
