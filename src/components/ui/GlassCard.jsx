import React from 'react';

export function GlassCard({ children, className = '', hover = true, glow = false }) {
  return (
    <div
      className={`
        rounded-2xl p-5
        bg-slate-900/80 backdrop-blur-md
        border border-slate-800/80
        shadow-xl shadow-black/20
        transition-all duration-300
        ${hover ? 'hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10' : ''}
        ${glow ? 'shadow-emerald-500/10 border-emerald-500/30' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
