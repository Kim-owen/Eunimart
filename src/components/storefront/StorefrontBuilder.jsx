import React, { useState } from 'react';
import { ThemeBrandingEditor } from './ThemeBrandingEditor';
import { HomepageLayoutManager } from './HomepageLayoutManager';
import { HeroMediaManager } from './HeroMediaManager';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { GlassCard } from '../ui/GlassCard';
import { toast } from 'sonner';
import {
  Palette,
  LayoutGrid,
  Video,
  Megaphone,
  Eye,
  Save,
  Sparkles,
  Zap,
  ExternalLink,
  Layers
} from 'lucide-react';

export function StorefrontBuilder({ setActiveTab }) {
  const [activeSubTab, setActiveSubTab] = useState('branding');
  const { ticker, updateTicker } = useStoreSettings();
  const [tickerText, setTickerText] = useState(ticker.text);
  const [tickerBadge, setTickerBadge] = useState(ticker.badge);

  const handleSaveTicker = (e) => {
    e.preventDefault();
    updateTicker({ ...ticker, text: tickerText, badge: tickerBadge });
    toast.success("Storefront announcement ticker updated live!");
  };

  const tickerPresets = [
    { badge: 'FLASH PROMO', text: 'SAME DAY FREIGHT DELIVERY ACROSS GREATER ACCRA & TEMA | USE CODE "AKUA2026" FOR 10% OFF' },
    { badge: 'WHOLESALE RATES', text: 'DIRECT PRODUCER PRICING ON ROYAL AROMA RICE, VEGETABLE OIL & CANNED FISH | PALLET SAVINGS' },
    { badge: 'DISPATCH ALERT', text: '2-HOUR ACCRA CORRIDOR DISPATCH IS ACTIVE TODAY FOR ALL MOBILE MONEY ORDERS PLACED BEFORE 4 PM' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> No-Code Experience Studio
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono">
              Live Storefront Binding
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">No-Code Storefront Studio & Builder</h2>
          <p className="text-xs text-slate-400">
            Real-time theme customizer, section layout composer, HD ambient video showcase, and announcement ticker.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('live-preview')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto active:scale-95"
        >
          <Eye className="w-4 h-4" /> Live Storefront Preview
        </button>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-slate-800 flex-nowrap scroll-smooth touch-pan-x min-w-0 w-full">
        <button
          onClick={() => setActiveSubTab('branding')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex-shrink-0 whitespace-nowrap ${
            activeSubTab === 'branding'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Palette className="w-4 h-4" /> Theme & Branding
        </button>

        <button
          onClick={() => setActiveSubTab('sections')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex-shrink-0 whitespace-nowrap ${
            activeSubTab === 'sections'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <LayoutGrid className="w-4 h-4" /> Homepage Layout
        </button>

        <button
          onClick={() => setActiveSubTab('media')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex-shrink-0 whitespace-nowrap ${
            activeSubTab === 'media'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Video className="w-4 h-4" /> Hero Media & Video
        </button>

        <button
          onClick={() => setActiveSubTab('ticker')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex-shrink-0 whitespace-nowrap ${
            activeSubTab === 'ticker'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Megaphone className="w-4 h-4" /> Announcement Ticker
        </button>
      </div>

      {/* Sub Tab Panels */}
      {activeSubTab === 'branding' && <ThemeBrandingEditor />}
      {activeSubTab === 'sections' && <HomepageLayoutManager />}
      {activeSubTab === 'media' && <HeroMediaManager />}
      {activeSubTab === 'ticker' && (
        <GlassCard className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-400" /> Announcement Ticker Strip Configuration
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Displays at the very top of the customer storefront to broadcast promo codes and delivery updates.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Live Scrolling Strip
            </span>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              1-Click Broadcast Presets
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {tickerPresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTickerBadge(p.badge);
                    setTickerText(p.text);
                    toast.info(`Preset applied: ${p.badge}`);
                  }}
                  className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-left transition-all group"
                >
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase font-mono">
                    {p.badge}
                  </span>
                  <p className="text-xs text-slate-300 group-hover:text-white line-clamp-2 mt-2">
                    {p.text}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveTicker} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Badge Label</label>
                <input
                  type="text"
                  value={tickerBadge}
                  onChange={(e) => setTickerBadge(e.target.value)}
                  placeholder="e.g. FLASH PROMO"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-black text-amber-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Ticker Announcement Message</label>
                <input
                  type="text"
                  value={tickerText}
                  onChange={(e) => setTickerText(e.target.value)}
                  placeholder="Announcement text..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Live Preview of Ticker */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Live Storefront Customer Preview
              </label>
              <div className="p-3 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-400 text-[10px] font-black uppercase tracking-wider flex-shrink-0">
                    {tickerBadge || 'NOTICE'}
                  </span>
                  <p className="text-xs font-black truncate">
                    {tickerText || 'Announcement text goes here'}
                  </p>
                </div>
                <Zap className="w-4 h-4 flex-shrink-0 animate-bounce" />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <Save className="w-4 h-4" /> Update Ticker Live
              </button>
            </div>
          </form>
        </GlassCard>
      )}
    </div>
  );
}
