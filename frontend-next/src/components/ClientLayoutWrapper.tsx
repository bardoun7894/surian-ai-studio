'use client';

import PageTransitionLoader from './PageTransitionLoader';
import SmoothScrollProvider from './SmoothScrollProvider';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  return (
    <SmoothScrollProvider>
      <PageTransitionLoader>
        {children}
      </PageTransitionLoader>
    </SmoothScrollProvider>
  );
}
