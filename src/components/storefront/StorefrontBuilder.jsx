import React, { useState } from 'react';
import { ThemeBrandingEditor } from './ThemeBrandingEditor';
import { HomepageLayoutManager } from './HomepageLayoutManager';
import { HeroMediaManager } from './HeroMediaManager';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { GlassCard } from '../ui/GlassCard';
import { toast } from 'sonner';
import { Palette, LayoutGrid, Video, Megaphone, Eye, Save } from 'lucide-react';

export function StorefrontBuilder({ setActiveTab }) {
  const [activeTab, setActiveSubTab] = useState('branding');
  const { ticker, updateTicker } = useStoreSettings();
  const [tickerText, setTickerText] = useState(ticker.text);
  const [tickerBadge, setTickerBadge] = useState(ticker.badge);

  const handleSaveTicker = (e) => {
    e.preventDefault();
    updateTicker({ ...ticker, text: tickerText, badge: tickerBadge });
    toast.success("Announcement Ticker updated live!");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">No-Code Live Storefront Builder</h2>
          <p className="text-xs text-slate-400 mt-1">Real-time theme customizer, section layout reorder, and HD video showcase settings.</p>
        </div>
        <button
          onClick={() => setActiveTab('live-preview')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Eye className="w-4 h-4" /> Live Storefront Preview
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        <button
          onClick={() => setActiveSubTab('branding')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'branding'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" /> Theme & Branding
        </button>
        <button
          onClick={() => setActiveSubTab('sections')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'sections'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutGrid className="w-4 h-4" /> Homepage Layout
        </button>
        <button
          onClick={() => setActiveSubTab('media')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'media'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" /> Hero Media & Video
        </button>
        <button
          onClick={() => setActiveSubTab('ticker')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'ticker'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Megaphone className="w-4 h-4" /> Announcement Ticker
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'branding' && <ThemeBrandingEditor />}
      {activeTab === 'sections' && <HomepageLayoutManager />}
      {activeTab === 'media' && <HeroMediaManager />}
      {activeTab === 'ticker' && (
        <GlassCard className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-400" /> Announcement Ticker Configuration
          </h3>
          <form onSubmit={handleSaveTicker} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Ticker Announcement Text</label>
              <input
                type="text"
                value={tickerText}
                onChange={(e) => setTickerText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Badge Tag</label>
              <input
                type="text"
                value={tickerBadge}
                onChange={(e) => setTickerBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-amber-400 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg"
            >
              <Save className="w-4 h-4" /> Update Ticker Live
            </button>
          </form>
        </GlassCard>
      )}
    </div>
  );
}
