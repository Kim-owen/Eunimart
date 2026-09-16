import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ShoppingBag, AlertTriangle, CheckCircle, Truck, Zap } from 'lucide-react';

export function ActivityFeed({ setActiveTab }) {
  const activities = [
    {
      id: 1,
      type: 'order',
      title: 'New Order #GH-WH-9482',
      desc: 'Kwame & Sons Supermarket ordered 5x Royal Aroma Rice',
      time: '2 mins ago',
      amount: 'GH₵ 4,620.00',
      icon: ShoppingBag,
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 2,
      type: 'stock',
      title: 'Low Stock Alert: Smart 4K TV',
      desc: 'Stock count dropped to 5 units in Tema Warehouse',
      time: '14 mins ago',
      amount: 'Action Required',
      icon: AlertTriangle,
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    {
      id: 3,
      type: 'dispatch',
      title: 'Rider Assigned to #GH-WH-8831',
      desc: 'Kofi Mensah dispatched for East Legon delivery zone',
      time: '35 mins ago',
      amount: 'In Transit',
      icon: Truck,
      iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
    },
    {
      id: 4,
      type: 'payment',
      title: 'Paystack MoMo Confirmed',
      desc: 'GH₵ 2,150.00 verified via MTN Mobile Money API',
      time: '1 hour ago',
      amount: 'Verified',
      icon: CheckCircle,
      iconBg: 'bg-teal-500/20 text-teal-400 border-teal-500/30'
    }
  ];

  return (
    <GlassCard className="col-span-full lg:col-span-1">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Live Activity Feed</h3>
          <p className="text-xs text-slate-400">Real-time system events & alerts</p>
        </div>
        <button
          onClick={() => setActiveTab('orders')}
          className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
        >
          View All <Zap className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-4">
        {activities.map(act => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/40 hover:bg-slate-800/80 transition-colors">
              <div className={`p-2.5 rounded-xl border ${act.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white truncate">{act.title}</h4>
                  <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">{act.time}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{act.desc}</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {act.amount}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
