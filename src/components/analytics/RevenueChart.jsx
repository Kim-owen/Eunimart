import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data7d = [
  { day: 'Mon', revenue: 14200, orders: 42 },
  { day: 'Tue', revenue: 18500, orders: 58 },
  { day: 'Wed', revenue: 16800, orders: 50 },
  { day: 'Thu', revenue: 24500, orders: 74 },
  { day: 'Fri', revenue: 31200, orders: 92 },
  { day: 'Sat', revenue: 42800, orders: 128 },
  { day: 'Sun', revenue: 38400, orders: 110 }
];

const data30d = [
  { day: 'W1', revenue: 98000, orders: 310 },
  { day: 'W2', revenue: 124000, orders: 420 },
  { day: 'W3', revenue: 145000, orders: 510 },
  { day: 'W4', revenue: 186400, orders: 640 }
];

export function RevenueChart() {
  const [timeframe, setTimeframe] = useState('7d');
  const chartData = timeframe === '7d' ? data7d : data30d;

  return (
    <GlassCard className="col-span-full lg:col-span-2">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Interactive Revenue Analytics</h3>
          <p className="text-xs text-slate-400">Direct-to-Consumer Gross Transaction Volume (GHC)</p>
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setTimeframe('7d')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              timeframe === '7d' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeframe('30d')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              timeframe === '30d' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(v) => `GH₵${v / 1000}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff' }}
              formatter={(val) => [`GH₵${Number(val).toLocaleString()}`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
