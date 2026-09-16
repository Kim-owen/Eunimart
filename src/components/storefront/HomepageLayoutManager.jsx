import React from 'react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { GlassCard } from '../ui/GlassCard';
import { toast } from 'sonner';
import { LayoutGrid, Eye, EyeOff, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';

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
    toast.success("Section reordered");
  };

  return (
    <GlassCard className="space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-amber-400" /> Homepage Layout Manager
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Toggle visibility and reorder storefront homepage sections.</p>
        </div>
      </div>

      <div className="space-y-3">
        {homepageSections.map((sec, idx) => (
          <div
            key={sec.id}
            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
              sec.visible
                ? 'bg-slate-800/70 border-slate-700/80 text-white'
                : 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold font-mono text-emerald-400 w-6">0{idx + 1}</span>
              <span className="text-sm font-bold">{sec.label}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => moveSection(idx, -1)}
                disabled={idx === 0}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => moveSection(idx, 1)}
                disabled={idx === homepageSections.length - 1}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleVisibility(sec.id)}
                className={`p-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                  sec.visible
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {sec.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{sec.visible ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
