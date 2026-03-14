'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import auth, { User, LoginCredentials, RegisterData, AuthResponse, TwoFactorVerifyData, TwoFactorResendData } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  verify2fa: (data: TwoFactorVerifyData) => Promise<AuthResponse>;
  resend2fa: (data: TwoFactorResendData) => Promise<{ message: string }>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (roleName: string) => boolean;
  hasPermission: (permission: string) => boolean;
  isAdmin: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session timeout in milliseconds (15 minutes)
const SESSION_TIMEOUT = (parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || '15', 10)) * 60 * 1000;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Track user activity
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Check session timeout - pause when tab is hidden to save CPU
  useEffect(() => {
    if (!user) return;

    let checkInterval: ReturnType<typeof setInterval> | null = null;

    const doCheck = () => {
      const now = Date.now();
      if (now - lastActivity > SESSION_TIMEOUT) {
        auth.logout().then(() => {
          setUser(null);
          window.location.href = '/login?expired=true';
        });
      }
    };

    const startChecking = () => {
      if (!checkInterval) {
        checkInterval = setInterval(doCheck, 60000);
      }
    };

    const stopChecking = () => {
      if (checkInterval) {
        clearInterval(checkInterval);
        checkInterval = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Reset activity timestamp on tab return to prevent false timeout
        setLastActivity(Date.now());
        startChecking();
      } else {
        stopChecking();
      }
    };

    if (document.visibilityState === 'visible') {
      startChecking();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopChecking();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, lastActivity]);

  // Track activity on user interactions
  useEffect(() => {
    if (!user) return;

    const activeEvents = ['mousedown', 'keydown'];
    const passiveEvents = ['scroll', 'touchstart'];
    activeEvents.forEach(e => window.addEventListener(e, updateActivity));
    passiveEvents.forEach(e => window.addEventListener(e, updateActivity, { passive: true }));

    return () => {
      activeEvents.forEach(e => window.removeEventListener(e, updateActivity));
      passiveEvents.forEach(e => window.removeEventListener(e, updateActivity));
    };
  }, [user, updateActivity]);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await auth.getUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await auth.login(credentials);
    // If 2FA is required, don't set the user yet
    if (!response.require_2fa && response.user) {
      setUser(response.user);
      setLastActivity(Date.now());
    }
    return response;
  }, []);

  const verify2fa = useCallback(async (data: TwoFactorVerifyData): Promise<AuthResponse> => {
    const response = await auth.verify2fa(data);
    if (response.user) {
      setUser(response.user);
      setLastActivity(Date.now());
    }
    return response;
  }, []);

  const resend2fa = useCallback(async (data: TwoFactorResendData): Promise<{ message: string }> => {
    return auth.resend2fa(data);
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<AuthResponse> => {
    const response = await auth.register(data);
    // If 2FA is required, don't set the user yet
    if (!response.require_2fa && response.user) {
      setUser(response.user);
      setLastActivity(Date.now());
    }
    return response;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await auth.logout();
    setUser(null);
    // Redirect to login page
    window.location.href = '/login';
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    const currentUser = await auth.getUser();
    setUser(currentUser);
  }, []);

  const hasRole = useCallback((roleName: string): boolean => {
    return auth.hasRole(user, roleName);
  }, [user]);

  const hasPermission = useCallback((permission: string): boolean => {
    return auth.hasPermission(user, permission);
  }, [user]);

  const isAdmin = useMemo(() => auth.isAdmin(user), [user]);
  const isStaff = useMemo(() => auth.isStaff(user), [user]);

  const value: AuthContextType = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    verify2fa,
    resend2fa,
    register,
    logout,
    refreshUser,
    hasRole,
    hasPermission,
    isAdmin,
    isStaff,
  }), [user, isLoading, login, verify2fa, resend2fa, register, logout, refreshUser, hasRole, hasPermission, isAdmin, isStaff]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
