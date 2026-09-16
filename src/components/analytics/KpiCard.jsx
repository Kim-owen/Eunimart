import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function KpiCard({ title, value, change, isPositive = true, icon: Icon, color = 'emerald' }) {
  const colorMap = {
    emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30',
    gold: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30',
    indigo: 'from-indigo-500/20 to-indigo-500/5 text-indigo-400 border-indigo-500/30',
    rose: 'from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/30'
  };

  return (
    <GlassCard hover glow>
      <div className="flex items-center justify-between">
        <div className={`p-3.5 rounded-2xl bg-gradient-to-br border ${colorMap[color] || colorMap.emerald}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
          isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}>
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{change}</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl md:text-3xl font-black text-white mt-1 tracking-tight">{value}</h3>
      </div>
    </GlassCard>
  );
}
