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

// Read the initial theme from the DOM to match with blocking script in layout.tsx
function getInitialTheme(): Theme {
  if (typeof window !== 'undefined') {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
  return 'light';
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('gov_high_contrast') === 'true';
  });
  const [fontSize, setFontSizeState] = useState<number>(() => {
    if (typeof window === 'undefined') return 100;
    const savedFontSize = Number.parseInt(localStorage.getItem('gov_font_size') || '100', 10);
    if (Number.isNaN(savedFontSize)) return 100;
    return Math.min(Math.max(savedFontSize, 80), 150);
  });
  const [mounted, setMounted] = useState(false);

  // Tailwind theme colors from config - FIXED with correct dark mode colors
  const themeColors = {
    light: {
      background: '#EDEBE0',  // Light Beige
      foreground: '#161616',  // Light Coal/Charcoal
    },
    dark: {
      background: '#094239',  // Dark Forest Green (the correct gov.forest color!)
      foreground: '#EDEBE0',  // Light Beige (for contrast with dark background)
    },
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('gov_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      const colors = themeColors[theme];
      document.documentElement.style.setProperty('--background', colors.background);
      document.documentElement.style.setProperty('--foreground', colors.foreground);
    }
  }, [theme, mounted]);

  // Accessibility Effects
  useEffect(() => {
    if (typeof window === 'undefined') return;

    localStorage.setItem('gov_high_contrast', String(isHighContrast));
    document.documentElement.classList.toggle('high-contrast', isHighContrast);
    if (document.body) {
      document.body.classList.toggle('high-contrast', isHighContrast);
    }
  }, [isHighContrast]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const nextSize = Math.min(Math.max(fontSize, 80), 150);
    localStorage.setItem('gov_font_size', String(nextSize));
    document.documentElement.style.fontSize = `${nextSize}%`;
  }, [fontSize]);

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
