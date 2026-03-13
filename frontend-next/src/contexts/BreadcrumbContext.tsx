'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface BreadcrumbOverrides {
  [path: string]: string;
}

interface BreadcrumbContextType {
  overrides: BreadcrumbOverrides;
  setLabel: (path: string, label: string) => void;
  clearLabel: (path: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  overrides: {},
  setLabel: () => {},
  clearLabel: () => {},
});

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<BreadcrumbOverrides>({});

  const setLabel = useCallback((path: string, label: string) => {
    setOverrides(prev => {
      if (prev[path] === label) return prev;
      return { ...prev, [path]: label };
    });
  }, []);

  const clearLabel = useCallback((path: string) => {
    setOverrides(prev => {
      if (!(path in prev)) return prev;
      const next = { ...prev };
      delete next[path];
      return next;
    });
  }, []);

  return (
    <BreadcrumbContext.Provider value={{ overrides, setLabel, clearLabel }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  return useContext(BreadcrumbContext);
}
