import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themePresets = {
  emerald: {
    name: 'Emerald D2C',
    primary: '#10b981',
    hover: '#059669',
    glow: 'rgba(16, 185, 129, 0.35)',
    gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 55%, #047857 100%)'
  },
  gold: {
    name: 'Royal Gold',
    primary: '#f7c119',
    hover: '#d9a60f',
    glow: 'rgba(247, 193, 25, 0.35)',
    gradient: 'linear-gradient(135deg, #ffd452 0%, #f7c119 55%, #d99b00 100%)'
  },
  obsidian: {
    name: 'Obsidian Neon',
    primary: '#6366f1',
    hover: '#4f46e5',
    glow: 'rgba(99, 102, 241, 0.35)',
    gradient: 'linear-gradient(135deg, #818cf8 0%, #6366f1 55%, #4338ca 100%)'
  },
  sunset: {
    name: 'Sunset Coral',
    primary: '#f43f5e',
    hover: '#e11d48',
    glow: 'rgba(244, 63, 94, 0.35)',
    gradient: 'linear-gradient(135deg, #fb7185 0%, #f43f5e 55%, #be123c 100%)'
  }
};

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(true);
  const [preset, setPreset] = useState('emerald');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [borderRadius, setBorderRadius] = useState('1rem');

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const activeTheme = themePresets[preset] || themePresets.emerald;

  return (
    <ThemeContext.Provider value={{
      darkMode,
      toggleDarkMode,
      preset,
      setPreset,
      fontFamily,
      setFontFamily,
      borderRadius,
      setBorderRadius,
      activeTheme,
      themePresets
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
