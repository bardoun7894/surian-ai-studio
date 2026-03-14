"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
} from "react";

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  /** Pages call this when they start fetching data */
  registerPageLoad: () => void;
  /** Pages call this when their essential data has loaded */
  completePageLoad: () => void;
  /** True if a page has registered and not yet completed its data load */
  isPageDataLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPageDataLoading, setIsPageDataLoading] = useState(false);
  const pendingLoadsRef = useRef(0);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const registerPageLoad = useCallback(() => {
    pendingLoadsRef.current += 1;
    setIsPageDataLoading(true);
  }, []);

  const completePageLoad = useCallback(() => {
    pendingLoadsRef.current = Math.max(0, pendingLoadsRef.current - 1);
    if (pendingLoadsRef.current === 0) {
      setIsPageDataLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    isLoading,
    startLoading,
    stopLoading,
    registerPageLoad,
    completePageLoad,
    isPageDataLoading,
  }), [isLoading, startLoading, stopLoading, registerPageLoad, completePageLoad, isPageDataLoading]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
