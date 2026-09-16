import React from 'react';

export function OrderStatusTabs({ activeFilter, setActiveFilter, counts }) {
  const tabs = [
    { id: 'All', label: 'All Orders', count: counts.All || 0 },
    { id: 'pending', label: 'Pending', count: counts.pending || 0 },
    { id: 'processing', label: 'Processing', count: counts.processing || 0 },
    { id: 'out_for_delivery', label: 'Out for Delivery', count: counts.out_for_delivery || 0 },
    { id: 'delivered', label: 'Delivered', count: counts.delivered || 0 },
    { id: 'cancelled', label: 'Cancelled', count: counts.cancelled || 0 },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {tabs.map(tab => {
        const isActive = activeFilter === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              isActive
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
