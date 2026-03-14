'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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

  // Check session timeout
  useEffect(() => {
    if (!user) return;

    const checkTimeout = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > SESSION_TIMEOUT) {
        // Session expired
        auth.logout().then(() => {
          setUser(null);
          window.location.href = '/login?expired=true';
        });
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkTimeout);
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

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await auth.login(credentials);
    // If 2FA is required, don't set the user yet
    if (!response.require_2fa && response.user) {
      setUser(response.user);
      setLastActivity(Date.now());
    }
    return response;
  };

  const verify2fa = async (data: TwoFactorVerifyData): Promise<AuthResponse> => {
    const response = await auth.verify2fa(data);
    if (response.user) {
      setUser(response.user);
      setLastActivity(Date.now());
    }
    return response;
  };

  const resend2fa = async (data: TwoFactorResendData): Promise<{ message: string }> => {
    return auth.resend2fa(data);
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await auth.register(data);
    // If 2FA is required, don't set the user yet
    if (!response.require_2fa && response.user) {
      setUser(response.user);
      setLastActivity(Date.now());
    }
    return response;
  };

  const logout = async (): Promise<void> => {
    await auth.logout();
    setUser(null);
    // Redirect to login page
    window.location.href = '/login';
  };

  const refreshUser = async (): Promise<void> => {
    const currentUser = await auth.getUser();
    setUser(currentUser);
  };

  const hasRole = (roleName: string): boolean => {
    return auth.hasRole(user, roleName);
  };

  const hasPermission = (permission: string): boolean => {
    return auth.hasPermission(user, permission);
  };

  const value: AuthContextType = {
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
    isAdmin: auth.isAdmin(user),
    isStaff: auth.isStaff(user),
  };

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
