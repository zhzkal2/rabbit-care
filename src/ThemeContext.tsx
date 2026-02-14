import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  subText: string;
  border: string;
  inputBg: string;
  accent: string;
}

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

const lightColors: ThemeColors = {
  background: '#F5F5F7',
  card: '#FFFFFF',
  text: '#1A1A2E',
  subText: '#8E8E93',
  border: '#E5E5EA',
  inputBg: '#F2F2F7',
  accent: '#6C63FF',
};

const darkColors: ThemeColors = {
  background: '#1A1A2E',
  card: '#2A2A3E',
  text: '#F5F5F7',
  subText: '#8E8E93',
  border: '#3A3A4E',
  inputBg: '#2A2A3E',
  accent: '#6C63FF',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
