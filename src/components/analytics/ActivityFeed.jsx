import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { fetchOrdersApi } from '../../services/api';

export function ActivityFeed({ setActiveTab }) {
  const [liveActivities, setLiveActivities] = useState([
    {
      id: 1,
      type: 'order',
      title: 'Wholesale Order #GH-WH-9482',
      description: 'Kwame & Sons Supermarket ordered 5x Royal Aroma Rice',
      amount: 'GH₵ 4,620.00',
      time: 'Live Sync',
      icon: CheckCircle2,
      color: 'emerald'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Low Stock Alert: Smart 4K TV',
      description: 'Stock count dropped to 5 units in Tema Central Hub',
      amount: 'Action Required',
      time: '14 mins ago',
      icon: AlertTriangle,
      color: 'amber'
    },
    {
      id: 3,
      type: 'dispatch',
      title: 'Rider Dispatched: #GH-WH-8831',
      description: 'Kofi Mensah on Motorbike dispatched to East Legon',
      amount: 'In Transit',
      time: '35 mins ago',
      icon: Truck,
      color: 'indigo'
    },
    {
      id: 4,
      type: 'payment',
      title: 'Paystack MoMo Confirmed',
      description: 'Verified via MTN Mobile Money API',
      amount: 'Settled',
      time: '1 hour ago',
      icon: ShieldCheck,
      color: 'emerald'
    }
  ]);

  useEffect(() => {
    async function loadRealOrders() {
      const orders = await fetchOrdersApi();
      if (orders && orders.length > 0) {
        const mappedOrders = orders.slice(0, 3).map((o, idx) => ({
          id: `order-${o.id || idx}`,
          type: 'order',
          title: `Order #${o.order_number || o.id}`,
          description: `${o.customer_name || o.buyer_name || 'Customer'} - ${o.shipping_address || o.location || 'Accra'}`,
          amount: `GH₵ ${Number(o.total_amount || 0).toLocaleString()}`,
          time: o.created_at || 'Recent',
          icon: o.status === 'delivered' ? CheckCircle2 : Truck,
          color: o.status === 'delivered' ? 'emerald' : 'indigo'
        }));

        setLiveActivities([
          ...mappedOrders,
          {
            id: 'stock-alert',
            type: 'warning',
            title: 'Live Inventory Guard',
            description: 'Warehouse stock thresholds monitored in real-time',
            amount: 'Optimal',
            time: 'Active',
            icon: ShieldCheck,
            color: 'emerald'
          }
        ]);
      }
    }
    loadRealOrders();
  }, []);

  return (
    <div className="rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 p-5 lg:p-6 shadow-lg flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              Live Operations Feed
            </h3>
            <p className="text-xs text-slate-400">Real-time system events, orders & dispatches</p>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* List of Activities */}
        <div className="space-y-3">
          {liveActivities.map(act => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800/60 transition-colors flex items-start gap-3"
              >
                <div className={`p-2 rounded-lg flex-shrink-0 mt-0.5 ${
                  act.color === 'emerald' ? 'bg-emerald-500/15 text-emerald-400' :
                  act.color === 'amber' ? 'bg-amber-500/15 text-amber-400' :
                  'bg-indigo-500/15 text-indigo-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-100 truncate">
                      {act.title}
                    </p>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {act.description}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      act.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
                      act.color === 'amber' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-indigo-500/10 text-indigo-400'
                    }`}>
                      {act.amount}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-800/80">
        <button
          onClick={() => setActiveTab('orders')}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
        >
          <span>Open Full Logistics Dispatch Center</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
        </button>
      </div>
    </div>
  );
}
