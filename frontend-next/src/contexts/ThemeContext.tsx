'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
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

  // Function to update CSS variables when theme changes
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
      updateCssVariables(theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    updateCssVariables(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
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
