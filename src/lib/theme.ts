import React from 'react';

// Theme management utilities
export type Theme = 'light' | 'dark' | 'system';

// Design token types based on the JSON structure
export interface DesignTokens {
  surface: {
    primary: string;
    minimal: string;
    secondary: string;
    contrast: string;
    'heavy contrast': string;
    invert: string;
    brand: string;
    'brand-secondary': string;
    'brand-contrast': string;
    'brand-heavy-contrast': string;
    positive: string;
    negative: string;
    'user-orange-1': string;
    'user-purple-1': string;
    'user-blue-1': string;
    'primary-lowopacity': string;
  };
  components: {
    primary: {
      'button-primary': string;
      'button-primary-hover': string;
      'button-primary-focused': string;
      'button-primary-pressed': string;
    };
    secondary: {
      'button-secondary': string;
      'button-secondary-hover': string;
      'button-secondary-focused': string;
      'button-secondary-pressed': string;
    };
    universal: {
      disabled: string;
    };
  };
  text: {
    primary: string;
    secondary: string;
    contrast: string;
    'text-brand': string;
  };
  borders: {
    primary: string;
    secondary: string;
    invert: string;
    brand: string;
  };
  icon: {
    primary: string;
    invert: string;
    positive: string;
    brand: string;
    secondary: string;
  };
  spacing: {
    none: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
}

// CSS Custom Properties mapping
export const CSS_VARS = {
  // Surface
  '--surface-primary': 'var(--surface-primary)',
  '--surface-minimal': 'var(--surface-minimal)',
  '--surface-secondary': 'var(--surface-secondary)',
  '--surface-contrast': 'var(--surface-contrast)',
  '--surface-heavy-contrast': 'var(--surface-heavy-contrast)',
  '--surface-invert': 'var(--surface-invert)',
  '--surface-brand': 'var(--surface-brand)',
  '--surface-brand-secondary': 'var(--surface-brand-secondary)',
  '--surface-brand-contrast': 'var(--surface-brand-contrast)',
  '--surface-brand-heavy-contrast': 'var(--surface-brand-heavy-contrast)',
  '--surface-positive': 'var(--surface-positive)',
  '--surface-negative': 'var(--surface-negative)',
  '--surface-user-orange-1': 'var(--surface-user-orange-1)',
  '--surface-user-purple-1': 'var(--surface-user-purple-1)',
  '--surface-user-blue-1': 'var(--surface-user-blue-1)',
  '--surface-primary-lowopacity': 'var(--surface-primary-lowopacity)',

  // Components
  '--button-primary': 'var(--button-primary)',
  '--button-primary-hover': 'var(--button-primary-hover)',
  '--button-primary-focused': 'var(--button-primary-focused)',
  '--button-primary-pressed': 'var(--button-primary-pressed)',
  '--button-secondary': 'var(--button-secondary)',
  '--button-secondary-hover': 'var(--button-secondary-hover)',
  '--button-secondary-focused': 'var(--button-secondary-focused)',
  '--button-secondary-pressed': 'var(--button-secondary-pressed)',
  '--disabled': 'var(--disabled)',

  // Text
  '--text-primary': 'var(--text-primary)',
  '--text-secondary': 'var(--text-secondary)',
  '--text-contrast': 'var(--text-contrast)',
  '--text-brand': 'var(--text-brand)',

  // Borders
  '--border-primary': 'var(--border-primary)',
  '--border-secondary': 'var(--border-secondary)',
  '--border-invert': 'var(--border-invert)',
  '--border-brand': 'var(--border-brand)',

  // Icons
  '--icon-primary': 'var(--icon-primary)',
  '--icon-invert': 'var(--icon-invert)',
  '--icon-positive': 'var(--icon-positive)',
  '--icon-brand': 'var(--icon-brand)',
  '--icon-secondary': 'var(--icon-secondary)',

  // Spacing
  '--spacing-none': 'var(--spacing-none)',
  '--spacing-xs': 'var(--spacing-xs)',
  '--spacing-sm': 'var(--spacing-sm)',
  '--spacing-md': 'var(--spacing-md)',
  '--spacing-lg': 'var(--spacing-lg)',
  '--spacing-xl': 'var(--spacing-xl)',
  '--spacing-2xl': 'var(--spacing-2xl)',
  '--spacing-3xl': 'var(--spacing-3xl)',
} as const;

// Theme management functions
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  
  // Remove existing theme attributes
  root.removeAttribute('data-theme');
  
  if (theme === 'system') {
    // Let CSS handle it via media queries
    return;
  }
  
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  }
  // For light theme, we don't need to set anything as it's the default
}

export function getCurrentTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  
  const root = document.documentElement;
  const dataTheme = root.getAttribute('data-theme');
  
  if (dataTheme === 'dark') return 'dark';
  if (dataTheme === 'light') return 'light';
  
  return 'system';
}

// Utility function to get CSS variable value
export function getCSSVar(varName: keyof typeof CSS_VARS): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(varName);
}

// Hook for React components (if needed)
export function useTheme() {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    return getCurrentTheme();
  });

  const updateTheme = React.useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    setThemeState(newTheme);
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (getCurrentTheme() === 'system') {
        setThemeState(getSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return { theme, setTheme: updateTheme };
} 