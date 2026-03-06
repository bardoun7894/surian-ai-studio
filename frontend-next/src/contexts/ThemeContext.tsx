'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Always start with server-safe defaults to avoid hydration mismatch
  const [theme, setThemeState] = useState<Theme>('light');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSizeState] = useState(100);
  const [mounted, setMounted] = useState(false);

  // Sync state from DOM/localStorage after mount (client-only)
  useEffect(() => {
    // Read theme from DOM (set by blocking script in layout.tsx)
    const domTheme: Theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setThemeState(domTheme);

    // Read accessibility settings from localStorage
    const savedHighContrast = localStorage.getItem('gov_high_contrast') === 'true';
    setIsHighContrast(savedHighContrast);

    const savedFontSize = Number.parseInt(localStorage.getItem('gov_font_size') || '100', 10);
    if (!Number.isNaN(savedFontSize)) {
      setFontSizeState(Math.min(Math.max(savedFontSize, 80), 150));
    }

    setMounted(true);
  }, []);

  // Persist theme and update DOM classes
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('gov_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const colors = themeColors[theme];
    document.documentElement.style.setProperty('--background', colors.background);
    document.documentElement.style.setProperty('--foreground', colors.foreground);
  }, [theme, mounted]);

  // Persist high contrast and update DOM
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('gov_high_contrast', String(isHighContrast));
    document.documentElement.classList.toggle('high-contrast', isHighContrast);
    if (document.body) {
      document.body.classList.toggle('high-contrast', isHighContrast);
    }
  }, [isHighContrast, mounted]);

  // Persist font size and update DOM
  useEffect(() => {
    if (!mounted) return;
    const nextSize = Math.min(Math.max(fontSize, 80), 150);
    localStorage.setItem('gov_font_size', String(nextSize));
    document.documentElement.style.fontSize = `${nextSize}%`;
  }, [fontSize, mounted]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    const colors = themeColors[newTheme];
    document.documentElement.style.setProperty('--background', colors.background);
    document.documentElement.style.setProperty('--foreground', colors.foreground);
  };

  const toggleHighContrast = () => {
    setIsHighContrast(prev => !prev);
  };

  const setFontSize = (size: number) => {
    const nextSize = Math.min(Math.max(size, 80), 150);
    setFontSizeState(nextSize);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      setTheme,
      isHighContrast,
      toggleHighContrast,
      fontSize,
      setFontSize
    }}>
      {children}
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
