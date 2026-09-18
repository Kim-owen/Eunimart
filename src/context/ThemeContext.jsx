import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSiteSettingsApi, saveSiteSettingApi } from '../services/api';

const ThemeContext = createContext();

export const themePresets = {
  emerald: {
    id: 'emerald',
    name: 'Ghana Emerald & Gold',
    tagline: 'Fresh Supermarket & Local Agriculture',
    primary: '#10b981',
    hover: '#059669',
    glow: 'rgba(16, 185, 129, 0.35)',
    gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 55%, #047857 100%)',
    accent: '#f59e0b',
    chip: 'bg-emerald-500'
  },
  gold: {
    id: 'gold',
    name: 'Royal Ashanti Gold',
    tagline: 'Wholesale B2B & Luxury Retail',
    primary: '#f59e0b',
    hover: '#d97706',
    glow: 'rgba(245, 158, 11, 0.35)',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 55%, #b45309 100%)',
    accent: '#10b981',
    chip: 'bg-amber-500'
  },
  indigo: {
    id: 'indigo',
    name: 'Cyber Tech Mall',
    tagline: 'Smart Displays & Electronics',
    primary: '#6366f1',
    hover: '#4f46e5',
    glow: 'rgba(99, 102, 241, 0.35)',
    gradient: 'linear-gradient(135deg, #818cf8 0%, #6366f1 55%, #4338ca 100%)',
    accent: '#06b6d4',
    chip: 'bg-indigo-500'
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Coral & Crimson',
    tagline: 'High-Impact Clearance & Deals',
    primary: '#f43f5e',
    hover: '#e11d48',
    glow: 'rgba(244, 63, 94, 0.35)',
    gradient: 'linear-gradient(135deg, #fb7185 0%, #f43f5e 55%, #be123c 100%)',
    accent: '#f59e0b',
    chip: 'bg-rose-500'
  },
  amethyst: {
    id: 'amethyst',
    name: 'Royal Amethyst Purple',
    tagline: 'VIP Executive Marketplace',
    primary: '#a855f7',
    hover: '#9333ea',
    glow: 'rgba(168, 85, 247, 0.35)',
    gradient: 'linear-gradient(135deg, #c084fc 0%, #a855f7 55%, #7e22ce 100%)',
    accent: '#38bdf8',
    chip: 'bg-purple-500'
  },
  obsidian: {
    id: 'obsidian',
    name: 'Monochrome Stealth Obsidian',
    tagline: 'High-Contrast Enterprise Studio',
    primary: '#38bdf8',
    hover: '#0284c7',
    glow: 'rgba(56, 189, 248, 0.35)',
    gradient: 'linear-gradient(135deg, #7dd3fc 0%, #38bdf8 55%, #0369a1 100%)',
    accent: '#e2e8f0',
    chip: 'bg-sky-500'
  }
};

export const WALLPAPER_PRESETS = [
  {
    id: 'luxury_mall',
    name: 'Grand Luxury Mall Atrium',
    category: 'Shopping Mall Architecture',
    url: '/wallpapers/luxury_mall_atrium.jpg',
    description: 'Majestic multi-level luxury shopping mall atrium with golden ambient illumination and soaring glass dome.',
    tag: 'Flagship Mall',
    badgeColor: 'amber'
  },
  {
    id: 'wholesale_showroom',
    name: 'Accra Organics Wholesale Showroom',
    category: 'Supermarket & Wholesale',
    url: '/wallpapers/accra_wholesale_showroom.jpg',
    description: 'Modern wholesale showroom with polished wide aisles, timber shelving, and warm architectural track lighting.',
    tag: 'Wholesale Depot',
    badgeColor: 'emerald'
  },
  {
    id: 'cyber_galleria',
    name: 'Cyber Indigo Night Galleria',
    category: 'Tech & Architecture',
    url: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=2000&q=80',
    description: 'Architectural modern pavilion with glowing blue geometry and ambient glass reflective floors.',
    tag: 'Cyber Tech',
    badgeColor: 'indigo'
  },
  {
    id: 'minimal_dark',
    name: 'Obsidian Minimal Studio',
    category: 'Stealth Minimalist',
    url: 'none',
    description: 'Clean, distraction-free deep dark slate background without photographic wallpaper.',
    tag: 'Clean Minimal',
    badgeColor: 'slate'
  }
];

export function ThemeProvider({ children }) {
  // Theme state
  const [darkMode, setDarkMode] = useState(true);
  const [preset, setPreset] = useState('emerald');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [borderRadius, setBorderRadius] = useState('1rem');

  // Background Wallpaper State - High Clarity Defaults
  const [wallpaperEnabled, setWallpaperEnabled] = useState(true);
  const [activeWallpaperId, setActiveWallpaperId] = useState('luxury_mall');
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState('');
  const [wallpaperOpacity, setWallpaperOpacity] = useState(0.65);
  const [wallpaperBlur, setWallpaperBlur] = useState(0);
  const [wallpaperScope, setWallpaperScope] = useState('all'); // 'all' | 'storefront' | 'admin'

  // Load saved theme and wallpaper settings on mount
  useEffect(() => {
    async function loadThemeSettings() {
      // 1. Try local storage for instantaneous load
      try {
        const cached = localStorage.getItem('akua_theme_settings');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.preset && themePresets[parsed.preset]) setPreset(parsed.preset);
          if (parsed.fontFamily) setFontFamily(parsed.fontFamily);
          if (parsed.borderRadius) setBorderRadius(parsed.borderRadius);
          if (parsed.wallpaperEnabled !== undefined) setWallpaperEnabled(parsed.wallpaperEnabled);
          if (parsed.activeWallpaperId) setActiveWallpaperId(parsed.activeWallpaperId);
          if (parsed.customWallpaperUrl !== undefined) setCustomWallpaperUrl(parsed.customWallpaperUrl);
          if (parsed.wallpaperOpacity !== undefined) {
            // Upgrade low opacity if previously saved with dark default
            setWallpaperOpacity(parsed.wallpaperOpacity < 0.35 ? 0.65 : parsed.wallpaperOpacity);
          }
          if (parsed.wallpaperBlur !== undefined) setWallpaperBlur(parsed.wallpaperBlur);
          if (parsed.wallpaperScope) setWallpaperScope(parsed.wallpaperScope);
        }
      } catch (err) {
        console.warn("Could not read local theme cache:", err);
      }

      // 2. Fetch server site settings
      const data = await fetchSiteSettingsApi();
      if (data && data.site_theme) {
        const st = data.site_theme;
        if (st.preset && themePresets[st.preset]) setPreset(st.preset);
        if (st.fontFamily) setFontFamily(st.fontFamily);
        if (st.borderRadius) setBorderRadius(st.borderRadius);
        if (st.wallpaperEnabled !== undefined) setWallpaperEnabled(st.wallpaperEnabled);
        if (st.activeWallpaperId) setActiveWallpaperId(st.activeWallpaperId);
        if (st.customWallpaperUrl !== undefined) setCustomWallpaperUrl(st.customWallpaperUrl);
        if (st.wallpaperOpacity !== undefined) {
          setWallpaperOpacity(st.wallpaperOpacity < 0.35 ? 0.65 : st.wallpaperOpacity);
        }
        if (st.wallpaperBlur !== undefined) setWallpaperBlur(st.wallpaperBlur);
        if (st.wallpaperScope) setWallpaperScope(st.wallpaperScope);
      }
    }
    loadThemeSettings();
  }, []);

  // Update HTML root for dark mode & dynamic tokens
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    const active = themePresets[preset] || themePresets.emerald;
    root.style.setProperty('--primary-color', active.primary);
    root.style.setProperty('--primary-glow', active.glow);
    root.style.setProperty('--border-radius', borderRadius);
  }, [darkMode, preset, borderRadius]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Active theme object
  const activeTheme = themePresets[preset] || themePresets.emerald;

  // Active wallpaper object
  const activeWallpaper = activeWallpaperId === 'custom' && customWallpaperUrl
    ? {
        id: 'custom',
        name: 'Custom Admin Wallpaper',
        category: 'Custom Upload',
        url: customWallpaperUrl,
        description: 'Custom uploaded high-resolution background asset',
        tag: 'Custom',
        badgeColor: 'emerald'
      }
    : WALLPAPER_PRESETS.find((w) => w.id === activeWallpaperId) || WALLPAPER_PRESETS[0];

  // Save changes permanently to SQLite backend & LocalStorage
  const saveThemeSettings = async (updates = {}) => {
    const combined = {
      preset,
      fontFamily,
      borderRadius,
      wallpaperEnabled,
      activeWallpaperId,
      customWallpaperUrl,
      wallpaperOpacity,
      wallpaperBlur,
      wallpaperScope,
      ...updates
    };

    try {
      localStorage.setItem('akua_theme_settings', JSON.stringify(combined));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }

    await saveSiteSettingApi('site_theme', combined);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        preset,
        setPreset,
        fontFamily,
        setFontFamily,
        borderRadius,
        setBorderRadius,
        activeTheme,
        themePresets,
        // Wallpaper State & Functions
        wallpaperEnabled,
        setWallpaperEnabled,
        activeWallpaperId,
        setActiveWallpaperId,
        customWallpaperUrl,
        setCustomWallpaperUrl,
        wallpaperOpacity,
        setWallpaperOpacity,
        wallpaperBlur,
        setWallpaperBlur,
        wallpaperScope,
        setWallpaperScope,
        activeWallpaper,
        WALLPAPER_PRESETS,
        saveThemeSettings
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
