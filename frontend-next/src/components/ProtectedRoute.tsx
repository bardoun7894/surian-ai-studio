'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  fallbackUrl?: string;
}

/**
 * Client-side route protection component
 * Use this to wrap pages that require authentication or specific roles
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallbackUrl = '/login',
}) => {
  const { user, isLoading, isAuthenticated, hasRole, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Not authenticated
    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`${fallbackUrl}?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Check role requirement
    if (requiredRole && !hasRole(requiredRole)) {
      router.push('/unauthorized');
      return;
    }

    // Check permission requirement
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push('/unauthorized');
      return;
    }
  }, [isLoading, isAuthenticated, hasRole, hasPermission, requiredRole, requiredPermission, router, fallbackUrl]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dm-bg">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Don't render if role check fails
  if (requiredRole && !hasRole(requiredRole)) {
    return null;
  }

  // Don't render if permission check fails
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null;
  }

  return <>{children}</>;
};

/**
 * HOC version for wrapping entire page components
 */
export function withProtectedRoute<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: {
    requiredRole?: string;
    requiredPermission?: string;
    fallbackUrl?: string;
  }
) {
  const ProtectedComponent: React.FC<P> = (props) => {
    return (
      <ProtectedRoute {...options}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };

  ProtectedComponent.displayName = `Protected(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ProtectedComponent;
}

/**
 * Admin-only route protection
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="admin" fallbackUrl="/unauthorized">
      {children}
    </ProtectedRoute>
  );
};

/**
 * Staff-only route protection (admin or staff roles)
 */
export const StaffRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isStaff } = useAuth();

  if (!isAdmin && !isStaff) {
    return (
      <ProtectedRoute requiredPermission="complaints.*" fallbackUrl="/unauthorized">
        {children}
      </ProtectedRoute>
    );
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default ProtectedRoute;
