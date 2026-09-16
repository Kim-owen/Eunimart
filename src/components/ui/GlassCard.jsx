import React from 'react';

export function GlassCard({ children, className = '', hover = true, glow = false }) {
  return (
    <div className={`
      relative rounded-2xl p-5 transition-all duration-300
      bg-slate-900/60 dark:bg-slate-900/70 light:bg-white/80
      backdrop-blur-xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200/80
      shadow-xl shadow-black/20
      ${hover ? 'hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10' : ''}
      ${glow ? 'before:absolute before:-inset-px before:rounded-2xl before:bg-gradient-to-r before:from-emerald-500/20 before:to-amber-500/20 before:-z-10 before:blur-md' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}
