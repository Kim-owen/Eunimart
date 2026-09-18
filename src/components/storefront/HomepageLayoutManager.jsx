import React from 'react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { GlassCard } from '../ui/GlassCard';
import { toast } from 'sonner';
import {
  LayoutGrid,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  GripVertical,
  RotateCcw,
  Sparkles,
  Layers,
  Megaphone,
  Video,
  Grid,
  ShoppingBag,
  Percent,
  ShieldCheck
} from 'lucide-react';

const sectionMeta = {
  announcement: { icon: Megaphone, label: 'Promotional Ticker Strip', desc: 'Top scrolling broadcast ticker for flash promo codes & delivery alerts' },
  hero: { icon: Video, label: 'Hero Showcase & HD Ambient Media', desc: 'Main full-bleed video banner, headline, value proposition & primary CTAs' },
  categories: { icon: Grid, label: 'Department Taxonomy Filter Grid', desc: 'Supermarket & Shopping Mall classification badges and category cards' },
  featured: { icon: ShoppingBag, label: 'Direct Wholesale Product Catalog', desc: 'Interactive wholesale catalog with Unit, Carton & Pallet price tiers' },
  promo: { icon: Percent, label: 'Seasonal Deals & Bulk Banners', desc: 'Promotional deal banners for FMCG distributors and high-volume buyers' },
  trust: { icon: ShieldCheck, label: 'Ghana Logistics Value Propositions', desc: 'SLA guarantees: 2-hour dispatch, verified MoMo escrow & pro-forma quotes' }
};

export function HomepageLayoutManager() {
  const { homepageSections, updateHomepageSections } = useStoreSettings();

  const toggleVisibility = (id) => {
    const updated = homepageSections.map(sec => sec.id === id ? { ...sec, visible: !sec.visible } : sec);
    updateHomepageSections(updated);
    toast.success("Homepage section layout updated");
  };

  const moveSection = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= homepageSections.length) return;
    const newArr = [...homepageSections];
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    updateHomepageSections(newArr);
    toast.success("Section reordered live");
  };

  const handleReset = () => {
    const defaultOrder = [
      { id: 'announcement', label: 'Announcement Bar', visible: true },
      { id: 'hero', label: 'Hero Showcase', visible: true },
      { id: 'categories', label: 'Categories Grid', visible: true },
      { id: 'featured', label: 'Featured Products', visible: true },
      { id: 'promo', label: 'Promo Banners', visible: true },
      { id: 'trust', label: 'Value Propositions', visible: true }
    ];
    updateHomepageSections(defaultOrder);
    toast.success("Homepage layout reset to high-conversion baseline");
  };

  return (
    <GlassCard className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3 h-3" /> Section Architecture
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono">
              Live Reorder
            </span>
          </div>
          <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-amber-400" /> Storefront Homepage Section Composer
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Arrange the presentation flow and toggle modules for the customer shopping experience.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Layout</span>
        </button>
      </div>

      <div className="space-y-3">
        {homepageSections.map((sec, idx) => {
          const meta = sectionMeta[sec.id] || { icon: Layers, label: sec.label, desc: 'Storefront modular content component' };
          const IconComponent = meta.icon;

          return (
            <div
              key={sec.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all gap-4 ${
                sec.visible
                  ? 'bg-slate-800/80 border-slate-700/80 text-white shadow-lg shadow-black/20'
                  : 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="flex items-center gap-2 text-slate-500">
                  <GripVertical className="w-4 h-4" />
                  <span className="text-xs font-black font-mono text-emerald-400 w-6">0{idx + 1}</span>
                </div>

                <div className={`p-2.5 rounded-xl ${sec.visible ? 'bg-slate-700/80 text-amber-400' : 'bg-slate-800 text-slate-600'}`}>
                  <IconComponent className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">{meta.label}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      sec.visible ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {sec.visible ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 max-w-xl">{meta.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => moveSection(idx, -1)}
                  disabled={idx === 0}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-25 transition-all"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(idx, 1)}
                  disabled={idx === homepageSections.length - 1}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-25 transition-all"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleVisibility(sec.id)}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    sec.visible
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{sec.visible ? 'Visible' : 'Hidden'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
