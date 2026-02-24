import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
  border: string;
}

interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const lightColors: ThemeColors = {
  primary: '#2563EB',
  accent: '#F59E0B',
  background: '#FFFFFF',
  surface: '#F3F4F6',
  text: '#111827',
  textSecondary: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  border: '#E5E7EB',
};

const darkColors: ThemeColors = {
  primary: '#3B82F6',
  accent: '#FBBF24',
  background: '#111827',
  surface: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  border: '#374151',
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_MODE_KEY = 'allmightyclaw_theme_mode';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_MODE_KEY);
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
          setModeState(stored as ThemeMode);
        }
      } catch {
        // Use default
      } finally {
        setLoaded(true);
      }
    };
    loadTheme();
  }, []);

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      await AsyncStorage.setItem(THEME_MODE_KEY, newMode);
    } catch {
      // Ignore storage errors
    }
  };

  const toggleTheme = () => {
    const currentDark = mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark');
    setMode(currentDark ? 'light' : 'dark');
  };

  const isDark =
    mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark');

  const theme: Theme = {
    dark: isDark,
    colors: isDark ? darkColors : lightColors,
  };

  if (!loaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { lightColors, darkColors };
