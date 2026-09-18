import React, { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { GlassCard } from '../ui/GlassCard';
import {
  Palette,
  Check,
  Sparkles,
  Sliders,
  Type,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Image as ImageIcon,
  Eye,
  Save,
  Upload,
  RefreshCw,
  Monitor,
  Store,
  Layers,
  SlidersHorizontal,
  ChevronDown,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

export function ThemeBrandingEditor() {
  const {
    preset,
    setPreset,
    themePresets,
    activeTheme,
    fontFamily,
    setFontFamily,
    borderRadius,
    setBorderRadius,
    // Wallpaper state
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
  } = useTheme();

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('wallpaper'); // 'wallpaper' | 'palette' | 'geometry'
  const fileInputRef = useRef(null);

  const handleSelectPreset = (key) => {
    setPreset(key);
    toast.success(`Active brand palette switched to: ${themePresets[key].name}`);
  };

  const handleSelectWallpaper = (id) => {
    setActiveWallpaperId(id);
    if (!wallpaperEnabled) setWallpaperEnabled(true);
    const found = WALLPAPER_PRESETS.find((w) => w.id === id);
    toast.success(`Atmospheric wallpaper set to: ${found?.name || id}`);
  };

  const handleCustomFileUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setCustomWallpaperUrl(dataUrl);
      setActiveWallpaperId('custom');
      setWallpaperEnabled(true);
      toast.success(`Custom wallpaper "${file.name}" uploaded and active!`);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    await saveThemeSettings();
    setIsSaving(false);
    toast.success('Brand theme & luxury wallpaper configuration published live!');
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 p-6 md:p-8 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Real-Time CSS Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                Wallpaper: {activeWallpaper?.name || 'Grand Mall'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 text-[10px] font-mono font-bold">
                Theme: {activeTheme.name}
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              Theme Changer & Luxury Wallpaper Studio
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Curate high-end architectural wallpapers, opulent shopping mall atriums, Ghana flagship color palettes, and surface geometry that elevate the storefront and admin experience.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Publishing Changes...' : 'Save & Publish Live'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Mode Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('wallpaper')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'wallpaper'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Luxury Mall Wallpapers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('palette')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'palette'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Brand Color Palettes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('geometry')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'geometry'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Typography & Geometry</span>
        </button>
      </div>

      {/* TAB 1: LUXURY WALLPAPER STUDIO */}
      {activeTab === 'wallpaper' && (
        <div className="space-y-6">
          
          {/* Featured Wallpaper Spotlight Banner */}
          <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl bg-slate-900 group">
            <div className="h-64 sm:h-80 w-full relative overflow-hidden bg-slate-950">
              <img
                src={activeWallpaper?.url && activeWallpaper.url !== 'none' ? activeWallpaper.url : '/wallpapers/luxury_mall_atrium.jpg'}
                alt="Active Wallpaper"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-400/40 text-amber-400 text-xs font-black uppercase flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" /> Active Wallpaper Canvas
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono">
                  {Math.round(wallpaperOpacity * 100)}% Opacity • {wallpaperBlur}px Blur
                </span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
                    {activeWallpaper?.name || 'Grand Luxury Mall Atrium'}
                  </h3>
                  <p className="text-xs text-slate-300 drop-shadow line-clamp-2 leading-relaxed">
                    {activeWallpaper?.description || 'Opulent multi-level shopping mall atrium with ambient golden illumination.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-bold text-white cursor-pointer backdrop-blur-md">
                    <input
                      type="checkbox"
                      checked={wallpaperEnabled}
                      onChange={(e) => setWallpaperEnabled(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                    <span>Wallpaper Active</span>
                  </label>

                  {wallpaperEnabled && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to completely remove and disable the background wallpaper?")) {
                          setWallpaperEnabled(false);
                          setActiveWallpaperId('minimal_dark');
                          setCustomWallpaperUrl('');
                          saveThemeSettings({ wallpaperEnabled: false, activeWallpaperId: 'minimal_dark', customWallpaperUrl: '' });
                          toast.success("Background wallpaper removed completely.");
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold backdrop-blur-md transition-all cursor-pointer"
                      title="Completely remove the background wallpaper"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Wallpaper
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Curated Wallpaper Presets Grid */}
          <GlassCard className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Curated Architectural Wallpapers</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Select a wallpaper to immediately bathe both the storefront and admin panels in atmosphere.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">4 Master Designs</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {WALLPAPER_PRESETS.map((w) => {
                const isSelected = activeWallpaperId === w.id;
                return (
                  <div
                    key={w.id}
                    onClick={() => handleSelectWallpaper(w.id)}
                    className={`group relative p-3 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-400 ring-2 ring-emerald-400/30 shadow-xl'
                        : 'bg-slate-950/70 hover:bg-slate-850/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="relative h-28 rounded-xl overflow-hidden mb-3 bg-slate-900">
                      {w.url && w.url !== 'none' ? (
                        <img
                          src={w.url}
                          alt={w.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center text-slate-600">
                          <Sliders className="w-8 h-8 opacity-40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                      <span className={`absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full backdrop-blur-md border ${
                        w.badgeColor === 'amber'
                          ? 'bg-amber-500/25 text-amber-300 border-amber-500/40'
                          : w.badgeColor === 'emerald'
                          ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
                          : w.badgeColor === 'indigo'
                          ? 'bg-indigo-500/25 text-indigo-300 border-indigo-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {w.tag}
                      </span>

                      {isSelected && (
                        <span className="absolute top-2 right-2 p-1 rounded-full bg-emerald-500 text-slate-950 shadow-md">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-white group-hover:text-emerald-400 transition-colors truncate">
                        {w.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {w.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Granular Wallpaper Opacity, Blur & Scope Customization */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* 1. Opacity Slider */}
            <GlassCard className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Wallpaper Opacity</span>
                </label>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {Math.round(wallpaperOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.15"
                max="0.95"
                step="0.01"
                value={wallpaperOpacity}
                onChange={(e) => setWallpaperOpacity(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Subtle (25%)</span>
                <span>Balanced (65%)</span>
                <span>Vivid HD (95%)</span>
              </div>
            </GlassCard>

            {/* 2. Blur / Depth of Field */}
            <GlassCard className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Cinematic Depth Blur</span>
                </label>
                <span className="text-xs font-mono font-bold text-indigo-400">
                  {wallpaperBlur}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={wallpaperBlur}
                onChange={(e) => setWallpaperBlur(parseInt(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Pin-Sharp (0px)</span>
                <span>Soft (2px)</span>
                <span>Frosted (8px)</span>
              </div>
            </GlassCard>

            {/* 3. Scope / Destination View */}
            <GlassCard className="space-y-3">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Wallpaper Display Scope</span>
              </label>
              <select
                value={wallpaperScope}
                onChange={(e) => setWallpaperScope(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Pages (Storefront & Admin)</option>
                <option value="storefront">Customer Storefront Only</option>
                <option value="admin">Admin Dashboard Only</option>
              </select>
              <p className="text-[10px] text-slate-400">
                Choose which environments display the atmospheric backdrop.
              </p>
            </GlassCard>

          </div>

          {/* Custom Wallpaper Upload / URL Studio */}
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Upload Custom High-Res Wallpaper</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">PNG, JPG, WEBP up to 20MB</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Device File Picker */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleCustomFileUpload(e.target.files?.[0])}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-5 rounded-2xl border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-950/60 hover:bg-slate-900 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white">Browse Local Device for Wallpaper</span>
                  <span className="text-[11px] text-slate-400">Supports 4K/8K architectural photos</span>
                </button>
              </div>

              {/* Direct URL Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Or Paste Direct Image URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={customWallpaperUrl}
                    onChange={(e) => setCustomWallpaperUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!customWallpaperUrl) return;
                      setActiveWallpaperId('custom');
                      setWallpaperEnabled(true);
                      toast.success('Applied custom wallpaper URL!');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
                  >
                    Apply URL
                  </button>
                  {customWallpaperUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomWallpaperUrl('');
                        if (activeWallpaperId === 'custom') {
                          setActiveWallpaperId('luxury_mall');
                        }
                        toast.info('Custom wallpaper URL cleared.');
                      }}
                      className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 transition-all cursor-pointer"
                      title="Clear custom wallpaper URL"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>

        </div>
      )}

      {/* TAB 2: BRAND COLOR PALETTES */}
      {activeTab === 'palette' && (
        <div className="space-y-6">
          <GlassCard className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-emerald-400" />
                  <span>Primary Brand Color Themes</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Select a tailored brand color theme to update primary buttons, badges, glows, and navigation accents.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Current: {activeTheme.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(themePresets).map(([key, t]) => {
                const isSelected = preset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectPreset(key)}
                    className={`p-4 rounded-2xl border text-left transition-all relative group cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xl shadow-emerald-500/10'
                        : 'bg-slate-950/70 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    {/* Gradient Swatch Banner */}
                    <div
                      className="w-full h-12 rounded-xl mb-3 shadow-md transition-transform group-hover:scale-[1.02] relative overflow-hidden"
                      style={{ background: t.gradient }}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-black text-white">{t.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{t.tagline}</p>
                        <div className="flex items-center gap-2 mt-2 font-mono text-[10px] text-slate-300">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">{t.primary}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">Accent: {t.accent}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md flex-shrink-0">
                          <Check className="w-3.5 h-3.5 font-black" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>
      )}

      {/* TAB 3: TYPOGRAPHY & GEOMETRY */}
      {activeTab === 'geometry' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Type className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Typography Hierarchy Stack</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Select Google Font Pairing</label>
              <select
                value={fontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  toast.success(`Font stack switched to: ${e.target.value}`);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Inter">Inter + Poppins (Modern Enterprise Clean)</option>
                <option value="Outfit">Outfit + Plus Jakarta Sans (Luxury D2C Modern)</option>
                <option value="Roboto">Roboto + Space Grotesk (Tech & Logistics)</option>
              </select>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                Rendered with high legibility on retina screens and mobile responsive viewports.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">UI Surface Geometry</h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Border Radius Curvature</label>
              <select
                value={borderRadius}
                onChange={(e) => {
                  setBorderRadius(e.target.value);
                  toast.success('Border radius updated across components');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="1rem">Rounded 2XL (16px Modern Soft - Recommended)</option>
                <option value="0.5rem">Rounded MD (8px Classic Industrial)</option>
                <option value="1.5rem">Rounded 3XL (24px Ultra Pill)</option>
              </select>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                Controls curvature on product cards, category badges, modals, and buttons.
              </p>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Live Interactive Token & Wallpaper Composite Preview */}
      <GlassCard className="space-y-4 border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Live Storefront Composite Preview</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Interactive demonstration of your selected brand theme and luxury wallpaper working together in harmony.
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Real-Time Composite
          </span>
        </div>

        {/* Mock Glass Container over Wallpaper */}
        <div className="relative rounded-3xl overflow-hidden p-6 md:p-8 border border-slate-800 bg-slate-950">
          {/* Background Wallpaper Inside Mock Preview */}
          {wallpaperEnabled && activeWallpaper?.url && activeWallpaper.url !== 'none' && (
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-500"
              style={{
                backgroundImage: `url(${activeWallpaper.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: wallpaperOpacity * 1.5,
                filter: `blur(${wallpaperBlur}px)`
              }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-slate-950/60 pointer-events-none" />

          {/* Foreground Mock UI Cards */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
            
            {/* 1. Primary Action Button */}
            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 space-y-2.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Action Button</p>
              <button
                type="button"
                className="w-full py-3 px-4 font-black text-xs text-slate-950 flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
                style={{
                  background: activeTheme.gradient,
                  borderRadius: borderRadius,
                  boxShadow: `0 8px 24px ${activeTheme.glow}`
                }}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart (GH₵ 115.00)</span>
              </button>
            </div>

            {/* 2. Product Badge & Price Pill */}
            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 space-y-2.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Tags & Highlights</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="px-3 py-1 text-[11px] font-black uppercase text-slate-950 shadow-md"
                  style={{ background: activeTheme.primary, borderRadius: borderRadius }}
                >
                  Direct Wholesale
                </span>
                <span className="px-3 py-1 text-[11px] font-bold text-white bg-slate-800 rounded-full border border-slate-700">
                  Pallet Pack
                </span>
              </div>
            </div>

            {/* 3. Value Proposition Pill */}
            <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 space-y-2.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Theme Atmosphere</p>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: activeTheme.primary, boxShadow: `0 0 12px ${activeTheme.primary}` }}
                />
                <span className="text-xs font-bold text-white">{activeTheme.name}</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Wallpaper: {activeWallpaper?.name}
              </p>
            </div>

          </div>
        </div>
      </GlassCard>

    </div>
  );
}
