'use client';

import React from 'react';
import { useTheme, type Theme } from '@/lib/theme';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
        Theme:
      </label>
      <div className="flex rounded-lg border" style={{ borderColor: 'var(--border-primary)' }}>
        {(['light', 'dark', 'system'] as const).map((themeOption) => (
          <button
            key={themeOption}
            onClick={() => handleThemeChange(themeOption)}
            className={`px-3 py-1 text-sm font-medium transition-colors ${
              theme === themeOption
                ? 'rounded-md'
                : 'hover:bg-opacity-50'
            }`}
            style={{
              backgroundColor: theme === themeOption ? 'var(--surface-secondary)' : 'transparent',
              color: theme === themeOption ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
          >
            {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

// Icon-based theme toggle for more compact usage
export function ThemeToggleIcon({ className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'dark':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'system':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors hover:bg-opacity-50 ${className}`}
      style={{
        backgroundColor: 'transparent',
        color: 'var(--icon-primary)',
      }}
      title={`Current theme: ${theme}. Click to cycle through themes.`}
    >
      {getIcon()}
    </button>
  );
} 