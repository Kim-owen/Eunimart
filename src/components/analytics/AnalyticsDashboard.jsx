import React, { useState, useEffect } from 'react';
import { KpiCard } from './KpiCard';
import { RevenueChart } from './RevenueChart';
import { ActivityFeed } from './ActivityFeed';
import { fetchAnalyticsApi } from '../../services/api';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Users,
  Plus,
  Truck,
  Palette,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Store,
  ChevronRight,
  ShieldCheck,
  Zap,
  MapPin,
  RefreshCw,
  PhoneCall,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export function AnalyticsDashboard({ setActiveTab }) {
  const [analytics, setAnalytics] = useState(null);
  const [currency, setCurrency] = useState('GHS'); // 'GHS' | 'USD'
  const [isLoading, setIsLoading] = useState(false);

  const loadStats = async () => {
    setIsLoading(true);
    const data = await fetchAnalyticsApi();
    if (data) setAnalytics(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const exchangeRate = 0.082; // 1 GHS ≈ 0.082 USD
  const totalRev = analytics?.summary?.totalRevenue || 186400;
  const totalOrd = analytics?.summary?.totalOrders || 1248;
  const pendingOrd = analytics?.summary?.pendingOrders || 14;
  const activeStaff = analytics?.summary?.activeStaff || 4;
  const avgOrder = analytics?.summary?.avgOrderValue || 864.50;

  const formatMoney = (amountGHS) => {
    if (currency === 'USD') {
      return `$ ${(Number(amountGHS) * exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `GH₵ ${Number(amountGHS).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const deliveryCorridors = [
    { name: 'Central Accra Metro', activeDeliveries: 8, eta: '2-4 Hrs', successRate: '99.4%', status: 'optimal' },
    { name: 'Tema & Spintex Corridor', activeDeliveries: 4, eta: '4-6 Hrs', successRate: '98.8%', status: 'optimal' },
    { name: 'East Legon & Madina Hub', activeDeliveries: 5, eta: '3-5 Hrs', successRate: '99.1%', status: 'optimal' },
    { name: 'Kumasi & Regional Corridors', activeDeliveries: 2, eta: '24-48 Hrs', successRate: '97.5%', status: 'scheduled' }
  ];

  const departmentShares = [
    { name: 'Supermarket Express & Groceries', share: 58, revenue: formatMoney(108112), color: 'bg-emerald-500', badge: 'Fast Moving' },
    { name: 'Online Shopping Mall (Tech/Home)', share: 27, revenue: formatMoney(50328), color: 'bg-indigo-500', badge: 'High Margin' },
    { name: 'Beverages & Wholesale Water', share: 15, revenue: formatMoney(27960), color: 'bg-amber-500', badge: 'Bulk Cartons' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      
      {/* Top Telemetry & Real-Time Operational Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Paystack MoMo: Operational
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 flex-shrink-0 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Accra Logistics Depots: <strong className="text-white">4 Online</strong></span>
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 flex-shrink-0 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Avg Courier Dispatch: <strong className="text-amber-400">28 mins</strong></span>
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Currency Toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrency('GHS')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                currency === 'GHS' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              GH₵ Cedi
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                currency === 'USD' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>

          <button
            onClick={loadStats}
            title="Refresh Live Analytics"
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hero Welcome Banner & Action Shortcuts */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-emerald-950/40 p-6 md:p-8 border border-slate-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Live Production Engine
              </span>
              <span className="text-xs text-slate-400 font-mono">SQLite DB Synchronized</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              AkuaMarket Enterprise Command Center
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Real-time monitoring of direct-to-consumer sales, warehouse inventory counts, dispatch couriers, and automated Paystack Mobile Money settlements.
            </p>
          </div>

          {/* Quick Action Triggers */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setActiveTab('products')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" /> Orders & Pipeline
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all shadow-sm cursor-pointer"
            >
              <Truck className="w-4 h-4 text-indigo-400" /> Dispatch Corridors
            </button>
            <button
              onClick={() => setActiveTab('live-preview')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 font-bold text-xs transition-all shadow-sm cursor-pointer"
            >
              <Store className="w-4 h-4" /> Storefront Preview
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <KpiCard
          title="Total Gross Revenue"
          value={formatMoney(totalRev)}
          change="+24.8%"
          isPositive={true}
          icon={DollarSign}
          color="emerald"
          subtitle="Processed via Paystack MoMo"
        />
        <KpiCard
          title="Orders Completed"
          value={totalOrd.toLocaleString()}
          change="+18.2%"
          isPositive={true}
          icon={ShoppingBag}
          color="gold"
          subtitle="99.4% Fulfillment Success"
        />
        <KpiCard
          title="Pending Dispatches"
          value={`${pendingOrd} Orders`}
          change="-5.4%"
          isPositive={true}
          icon={Clock}
          color="indigo"
          subtitle="Awaiting Courier Pickup"
        />
        <KpiCard
          title="Active Couriers & Staff"
          value={`${activeStaff} Online`}
          change="+12.5%"
          isPositive={true}
          icon={Users}
          color="rose"
          subtitle="Across Accra & Tema Zones"
        />
      </div>

      {/* Interactive Charts & Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart />
        <ActivityFeed setActiveTab={setActiveTab} />
      </div>

      {/* Department Breakdown & Regional Delivery Corridors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Department Revenue Breakdown (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Department Revenue Distribution</span>
              </h3>
              <p className="text-xs text-slate-400">Split across Supermarket Express, Tech Mall, and Bulk Wholesale</p>
            </div>
            <button
              onClick={() => setActiveTab('categories')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              Taxonomy <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {departmentShares.map((dept, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/40 border border-slate-800/60 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 truncate">{dept.name}</span>
                  <span className="font-extrabold text-emerald-400 flex-shrink-0">{dept.share}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${dept.color}`} style={{ width: `${dept.share}%` }} />
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-400 font-mono">{dept.revenue}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {dept.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Dispatch Corridors SLA (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Active Delivery Corridors</span>
              </h3>
              <p className="text-xs text-slate-400">Live courier tracking across metro zones</p>
            </div>
            <button
              onClick={() => setActiveTab('shipping')}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              Manage Zones <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 pt-1">
            {deliveryCorridors.map((corridor, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800/60 flex items-center justify-between gap-3 transition-colors text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{corridor.name}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                      {corridor.eta}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    {corridor.activeDeliveries} Active Courier Trips • SLA: {corridor.successRate}
                  </span>
                </div>

                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
