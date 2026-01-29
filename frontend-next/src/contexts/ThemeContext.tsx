'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Tailwind theme colors from config
  const themeColors = {
    light: {
      background: '#EDEBE0',
      foreground: '#161616',
    },
    dark: {
      background: '#094239',
      foreground: '#EDEBE0',
    },
  };

  useEffect(() => {
    // Check for saved theme or system preference
    const saved = localStorage.getItem('gov_theme') as Theme | null;
    if (saved) {
      setThemeState(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
    }
    setMounted(true);
  }, []);

  // New: Function to update CSS variables when theme changes
  const updateCssVariables = (theme: Theme) => {
    const root = document.documentElement;
    const colors = themeColors[theme];
    
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', colors.foreground);
  };

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('gov_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // New: Update CSS variables when theme changes
    updateCssVariables(theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    // New: Update CSS variables when theme is explicitly set
    updateCssVariables(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div className={mounted ? 'opacity-100 transition-opacity duration-300' : 'opacity-0'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
