import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function KpiCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  color = 'emerald',
  subtitle = 'vs last month'
}) {
  const colorThemes = {
    emerald: {
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10',
      gradient: 'from-emerald-500/10 via-transparent to-transparent'
    },
    gold: {
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-amber-500/10',
      gradient: 'from-amber-500/10 via-transparent to-transparent'
    },
    indigo: {
      badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25',
      iconBg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30 shadow-indigo-500/10',
      gradient: 'from-indigo-500/10 via-transparent to-transparent'
    },
    rose: {
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-rose-500/10',
      gradient: 'from-rose-500/10 via-transparent to-transparent'
    }
  };

  const theme = colorThemes[color] || colorThemes.emerald;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 p-5 hover:border-slate-700/80 transition-all duration-300 hover:-translate-y-0.5 shadow-lg group">
      <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${theme.gradient} blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-center justify-between relative z-10">
        <div className={`p-3 rounded-xl border ${theme.iconBg} shadow-md`}>
          <Icon className="w-5 h-5" />
        </div>

        <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
          isPositive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{change}</span>
        </div>
      </div>

      <div className="mt-4 relative z-10 space-y-1">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
          {value}
        </h3>
        <p className="text-[11px] text-slate-500 font-medium">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
