import React from 'react';
import { KpiCard } from './KpiCard';
import { RevenueChart } from './RevenueChart';
import { ActivityFeed } from './ActivityFeed';
import { DollarSign, ShoppingBag, Clock, Users, ArrowUpRight, Plus, Package, Truck, Palette } from 'lucide-react';

export function AnalyticsDashboard({ setActiveTab }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Quick Shortcuts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Overview Dashboard 👋
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Real-time analytics and logistics performance monitoring for AkuaMarket D2C Storefront.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setActiveTab('products')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" /> Manage Orders
          </button>
          <button
            onClick={() => setActiveTab('storefront')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all"
          >
            <Palette className="w-4 h-4 text-amber-400" /> Live Store Builder
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <KpiCard
          title="Total Gross Revenue"
          value="GH₵ 186,400.00"
          change="+24.8%"
          isPositive={true}
          icon={DollarSign}
          color="emerald"
        />
        <KpiCard
          title="Total Orders Processed"
          value="1,248"
          change="+18.2%"
          isPositive={true}
          icon={ShoppingBag}
          color="gold"
        />
        <KpiCard
          title="Pending Fulfillments"
          value="14 Orders"
          change="-5.4%"
          isPositive={true}
          icon={Clock}
          color="indigo"
        />
        <KpiCard
          title="Active Customer Base"
          value="4,820"
          change="+12.5%"
          isPositive={true}
          icon={Users}
          color="rose"
        />
      </div>

      {/* Interactive Charts & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart />
        <ActivityFeed setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
