import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export function BackgroundWallpaper({ currentView = 'admin' }) {
  const {
    wallpaperEnabled,
    activeWallpaper,
    wallpaperOpacity,
    wallpaperBlur,
    wallpaperScope
  } = useTheme();

  if (!wallpaperEnabled || !activeWallpaper?.url || activeWallpaper.url === 'none') {
    return null;
  }

  // Check display scope
  if (wallpaperScope === 'storefront' && currentView !== 'storefront') return null;
  if (wallpaperScope === 'admin' && currentView !== 'admin') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-700">
      {/* 1. High-Resolution Atmospheric Wallpaper Canvas */}
      <div
        className="absolute inset-0 transition-all duration-700 ease-out"
        style={{
          backgroundImage: `url(${activeWallpaper.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          opacity: Math.max(wallpaperOpacity !== undefined ? wallpaperOpacity : 0.65, 0.25),
          filter: `blur(${wallpaperBlur || 0}px)`
        }}
      />

      {/* 2. Soft Ambient Gradient to guarantee text contrast without obscuring the wallpaper */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(2, 6, 23, 0.15) 0%, rgba(2, 6, 23, 0.45) 60%, rgba(2, 6, 23, 0.75) 100%)'
        }}
      />
    </div>
  );
}
