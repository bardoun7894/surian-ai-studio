'use client';

import PageTransitionLoader from './PageTransitionLoader';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  return (
    <PageTransitionLoader>
      {children}
    </PageTransitionLoader>
  );
}
