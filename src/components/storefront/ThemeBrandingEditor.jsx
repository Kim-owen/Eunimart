import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { GlassCard } from '../ui/GlassCard';
import { Palette, Check, Sparkles, Sliders } from 'lucide-react';
import { toast } from 'sonner';

export function ThemeBrandingEditor() {
  const { preset, setPreset, themePresets, activeTheme, fontFamily, setFontFamily, borderRadius, setBorderRadius } = useTheme();

  const handleSelectPreset = (key) => {
    setPreset(key);
    toast.success(`Active Brand Color Theme updated to ${themePresets[key].name}`);
  };

  return (
    <GlassCard className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-400" /> Theme & Branding Editor
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Customize real-time brand color palettes, typography, and border radius.</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Live Realtime Engine
        </span>
      </div>

      {/* Brand Color Presets */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          Brand Color Palette Presets
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(themePresets).map(([key, t]) => {
            const isSelected = preset === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectPreset(key)}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80'
                }`}
              >
                <div
                  className="w-full h-8 rounded-xl mb-3 shadow-md"
                  style={{ background: t.gradient }}
                />
                <p className="text-xs font-bold text-white">{t.name}</p>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                    <Check className="w-3 h-3 font-bold" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Typography Pairings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Heading & Body Typography Pairing
          </label>
          <select
            value={fontFamily}
            onChange={(e) => { setFontFamily(e.target.value); toast.success(`Font updated to ${e.target.value}`); }}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="Inter">Inter + Poppins (Modern Clean)</option>
            <option value="Roboto">Roboto + Outfit (Tech Enterprise)</option>
            <option value="Plus Jakarta Sans">Plus Jakarta Sans (Sleek D2C)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Border Radius Style
          </label>
          <select
            value={borderRadius}
            onChange={(e) => { setBorderRadius(e.target.value); toast.success("Border radius updated"); }}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="1rem">Rounded 2XL (Modern Soft)</option>
            <option value="0.5rem">Rounded MD (Classic Sharp)</option>
            <option value="1.5rem">Rounded 3XL (Ultra Pill)</option>
          </select>
        </div>
      </div>
    </GlassCard>
  );
}
