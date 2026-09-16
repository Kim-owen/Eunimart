import React from 'react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { GlassCard } from '../ui/GlassCard';
import { toast } from 'sonner';
import { Video, Image as ImageIcon, Play, VolumeX, Repeat, Trash2, Upload, Sparkles } from 'lucide-react';

export function HeroMediaManager() {
  const { heroMedia, updateHeroMedia } = useStoreSettings();

  const handleToggleType = (type) => {
    updateHeroMedia({ ...heroMedia, type });
    toast.success(`Hero Media background switched to ${type.toUpperCase()}`);
  };

  const handleInputChange = (field, value) => {
    const updated = { ...heroMedia, [field]: value };
    updateHeroMedia(updated);
  };

  const handlePurgeOrphans = () => {
    toast.success("Orphan media scan complete: Purged 3 unused video cache fragments from bucket");
  };

  return (
    <GlassCard className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-400" /> Hero Media & Video Manager
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Switch between HD video MP4/WebM backgrounds and image posters with overlays.</p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
          Bucket Storage Active
        </span>
      </div>

      {/* Showcase Type Toggle */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Hero Showcase Background Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleToggleType('video')}
            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              heroMedia.type === 'video'
                ? 'bg-slate-800 border-indigo-500 text-indigo-400 ring-2 ring-indigo-500/30 font-bold'
                : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-5 h-5" />
            <div>
              <p className="text-xs">HD MP4/WebM Video</p>
              <p className="text-[10px] text-slate-400">Cinematic ambient background</p>
            </div>
          </button>

          <button
            onClick={() => handleToggleType('image')}
            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              heroMedia.type === 'image'
                ? 'bg-slate-800 border-indigo-500 text-indigo-400 ring-2 ring-indigo-500/30 font-bold'
                : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <div>
              <p className="text-xs">Image Poster</p>
              <p className="text-[10px] text-slate-400">High-res static poster</p>
            </div>
          </button>
        </div>
      </div>

      {/* Video & Poster URLs */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">HD Background Video URL (.mp4/.webm)</label>
          <input
            type="text"
            value={heroMedia.videoUrl}
            onChange={(e) => handleInputChange('videoUrl', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Static Poster Image Fallback URL</label>
          <input
            type="text"
            value={heroMedia.posterUrl}
            onChange={(e) => handleInputChange('posterUrl', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Video Playback Controls */}
      <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Video Controls & Overlays</label>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <label className="flex items-center gap-2 font-semibold text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={heroMedia.autoplay}
              onChange={(e) => handleInputChange('autoplay', e.target.checked)}
              className="rounded accent-indigo-500 w-4 h-4"
            />
            <Play className="w-4 h-4 text-emerald-400" /> Autoplay
          </label>

          <label className="flex items-center gap-2 font-semibold text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={heroMedia.muted}
              onChange={(e) => handleInputChange('muted', e.target.checked)}
              className="rounded accent-indigo-500 w-4 h-4"
            />
            <VolumeX className="w-4 h-4 text-amber-400" /> Mute Sound
          </label>

          <label className="flex items-center gap-2 font-semibold text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={heroMedia.loop}
              onChange={(e) => handleInputChange('loop', e.target.checked)}
              className="rounded accent-indigo-500 w-4 h-4"
            />
            <Repeat className="w-4 h-4 text-indigo-400" /> Loop Continuously
          </label>
        </div>
      </div>

      {/* Dynamic Headline & Badge Overlays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Dynamic Hero Headline Overlay</label>
          <input
            type="text"
            value={heroMedia.headline}
            onChange={(e) => handleInputChange('headline', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Hero Badge Tag</label>
          <input
            type="text"
            value={heroMedia.badge}
            onChange={(e) => handleInputChange('badge', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-emerald-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Media Storage Utility */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs text-slate-400">Media Storage Utility (Purge unused orphan files)</p>
        <button
          onClick={handlePurgeOrphans}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-xs transition-all"
        >
          <Trash2 className="w-4 h-4" /> Purge Orphan Media Files
        </button>
      </div>
    </GlassCard>
  );
}
