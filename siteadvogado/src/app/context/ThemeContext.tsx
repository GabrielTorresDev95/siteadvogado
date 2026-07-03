import React, { createContext, useContext, useEffect } from 'react';

// Mantido só por compatibilidade (caso algo no projeto ainda use)
export type ThemePalette = 'confianca';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textLight: string;
}

// 🔵 PALETA FIXA AZUL + BRANCO
const palettes: Record<ThemePalette, ThemeColors> = {
confianca: {
  primary: '#0d4b82',
  secondary: '#1b3d57',
  accent: '#446c94',

  background: '#ffffff',

  text: '#1b3d57',
  textLight: '#60798a',
},
};

interface ThemeContextType {
  palette: ThemePalette;
  colors: ThemeColors;
}

// ❌ removido setPalette
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 🔒 travado na paleta azul
  const palette: ThemePalette = 'confianca';

  const colors = palettes[palette];

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', colors.primary);
    document.documentElement.style.setProperty('--color-secondary', colors.secondary);
    document.documentElement.style.setProperty('--color-accent', colors.accent);
    document.documentElement.style.setProperty('--color-background', colors.background);
    document.documentElement.style.setProperty('--color-text', colors.text);
    document.documentElement.style.setProperty('--color-text-light', colors.textLight);
  }, []);

  return (
    <ThemeContext.Provider value={{ palette, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}