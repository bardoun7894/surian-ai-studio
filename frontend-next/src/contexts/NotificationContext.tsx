'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getAuthToken } from '@/lib/api';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  created_at: string;
  read_at: string | null;
  data?: Record<string, any>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch('/api/v1/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const items = data.data || data;
        setNotifications(Array.isArray(items) ? items : []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`/api/v1/notifications/${id}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('/api/v1/notifications/read-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
        );
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`/api/v1/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Fetch notifications on mount and when user logs in
  // Pause polling when tab is hidden to save CPU/network
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    fetchNotifications();

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startPolling = () => {
      if (!intervalId) {
        intervalId = setInterval(fetchNotifications, 30000);
      }
    };

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchNotifications(); // Fetch immediately on tab return
        startPolling();
      } else {
        stopPolling();
      }
    };

    // Start polling only if tab is visible
    if (document.visibilityState === 'visible') {
      startPolling();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, user]);

  const unreadCount = notifications.filter(n => !n.read_at).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
