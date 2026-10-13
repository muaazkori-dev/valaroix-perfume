'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'royal-gold',
  setTheme: () => {},
  toggleTheme: () => {},
  isSapphire: false,
  isGold: true,
  isLoading: false,
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('royal-gold');
  const [isLoading, setIsLoading] = useState(true);

  // Apply theme to DOM
  const applyThemeToDOM = (themeName) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeName);
      if (themeName === 'sapphire-blue') {
        document.documentElement.classList.add('theme-sapphire');
        document.documentElement.classList.remove('theme-gold');
        document.body.classList.add('theme-sapphire');
        document.body.classList.remove('theme-gold');
      } else {
        document.documentElement.classList.add('theme-gold');
        document.documentElement.classList.remove('theme-sapphire');
        document.body.classList.add('theme-gold');
        document.body.classList.remove('theme-sapphire');
      }
    }
  };

  useEffect(() => {
    // 1. Instant recovery from local cache
    try {
      const cached = localStorage.getItem('valaroix_theme');
      if (cached && (cached === 'royal-gold' || cached === 'sapphire-blue')) {
        setThemeState(cached);
        applyThemeToDOM(cached);
      }
    } catch (e) {}

    // 2. Fetch server source of truth
    fetch('/api/theme')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.theme && (data.theme === 'royal-gold' || data.theme === 'sapphire-blue')) {
          setThemeState(data.theme);
          applyThemeToDOM(data.theme);
          try {
            localStorage.setItem('valaroix_theme', data.theme);
          } catch (e) {}
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));

    // 3. Cross-tab sync
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel('valaroix_theme_channel');
      bc.onmessage = (event) => {
        if (event.data && (event.data === 'royal-gold' || event.data === 'sapphire-blue')) {
          setThemeState(event.data);
          applyThemeToDOM(event.data);
          try {
            localStorage.setItem('valaroix_theme', event.data);
          } catch (e) {}
        }
      };
      return () => bc.close();
    }
  }, []);

  const setTheme = async (newTheme) => {
    if (newTheme !== 'royal-gold' && newTheme !== 'sapphire-blue') return;

    // Instant local update
    setThemeState(newTheme);
    applyThemeToDOM(newTheme);

    try {
      localStorage.setItem('valaroix_theme', newTheme);
    } catch (e) {}

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('valaroix_theme_channel');
        bc.postMessage(newTheme);
        bc.close();
      } catch (e) {}
    }

    // Persist to server
    try {
      await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme }),
      });
    } catch (e) {
      console.error('Error persisting theme to server:', e);
    }
  };

  const toggleTheme = () => {
    const next = theme === 'royal-gold' ? 'sapphire-blue' : 'royal-gold';
    setTheme(next);
  };

  const isSapphire = theme === 'sapphire-blue';
  const isGold = theme === 'royal-gold';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isSapphire,
        isGold,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
