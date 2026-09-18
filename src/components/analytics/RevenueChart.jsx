import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';

const data7D = [
  { day: 'Mon', revenue: 14200, orders: 12 },
  { day: 'Tue', revenue: 16800, orders: 15 },
  { day: 'Wed', revenue: 15500, orders: 14 },
  { day: 'Thu', revenue: 21400, orders: 22 },
  { day: 'Fri', revenue: 29800, orders: 31 },
  { day: 'Sat', revenue: 42500, orders: 48 },
  { day: 'Sun', revenue: 38200, orders: 39 }
];

const data30D = [
  { day: 'Week 1', revenue: 84000, orders: 92 },
  { day: 'Week 2', revenue: 96500, orders: 110 },
  { day: 'Week 3', revenue: 112000, orders: 135 },
  { day: 'Week 4', revenue: 145000, orders: 168 }
];

const data90D = [
  { day: 'Jul', revenue: 295000, orders: 340 },
  { day: 'Aug', revenue: 360000, orders: 420 },
  { day: 'Sep', revenue: 437700, orders: 512 }
];

export function RevenueChart() {
  const [timeRange, setTimeRange] = useState('7D');

  const chartData = timeRange === '7D' ? data7D : timeRange === '30D' ? data30D : data90D;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl shadow-2xl space-y-1">
          <p className="text-xs font-bold text-slate-400">{label}</p>
          <p className="text-sm font-black text-emerald-400">
            GH₵ {payload[0].value.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">
            {payload[0].payload.orders} Completed Orders
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 p-5 lg:p-6 shadow-lg flex flex-col justify-between">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-white tracking-tight">
              Interactive Gross Revenue Pipeline
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Paystack MoMo Verified
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Direct-to-Consumer Gross Transaction Volume (GHC) across Accra & Regional Corridors
          </p>
        </div>

        {/* Time Filter Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto">
          {['7D', '30D', '90D'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                timeRange === range
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range === '7D' ? 'Last 7 Days' : range === '30D' ? '30 Days' : 'Quarter'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `GH₵ ${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 mt-4 border-t border-slate-800/80">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            Average Order Value
          </span>
          <p className="text-sm font-extrabold text-white mt-0.5">GH₵ 864.50</p>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            Peak Day Volume
          </span>
          <p className="text-sm font-extrabold text-emerald-400 mt-0.5">Saturday (GH₵ 42.5k)</p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            MoMo Settlement SLA
          </span>
          <p className="text-sm font-extrabold text-amber-400 mt-0.5">Instant Automated T+0</p>
        </div>
      </div>
    </div>
  );
}
