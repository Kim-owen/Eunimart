import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import { ShieldCheck, Lock, UserCheck, Smartphone, Store, KeyRound, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export function RolePermissions() {
  const { user, switchRole } = useAuth();

  const matrix = [
    { module: 'Analytics & Revenue Chart', admin: true, staff: true, customer: false },
    { module: 'Order Management & Dispatch', admin: true, staff: true, customer: false },
    { module: 'Product Catalog Create/Edit', admin: true, staff: false, customer: false },
    { module: 'Storefront Live Builder & Theme', admin: true, staff: false, customer: false },
    { module: 'Hero Media Video Showcase', admin: true, staff: false, customer: false },
    { module: 'Delivery Zones & Fee Rates', admin: true, staff: false, customer: false },
    { module: 'System Settings & Multi-Channel Alerts', admin: true, staff: false, customer: false },
    { module: 'Public Shopping & MoMo Checkout', admin: true, staff: true, customer: true },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Role-Based Access Control (RBAC) & Security</h2>
          <p className="text-xs text-slate-400 mt-1">Manage user permissions and security assertion guards.</p>
        </div>
      </div>

      {/* Active Role Simulator */}
      <GlassCard className="space-y-4 border-emerald-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Current Active Session: {user.name}</h3>
              <p className="text-xs text-slate-400">Authenticated Role: <span className="font-mono text-emerald-400 font-bold uppercase">{user.role}</span></p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            RLS Enforcement Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => { switchRole('admin'); toast.success("Role switched to Administrator"); }}
            className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              user.role === 'admin' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold' : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <div>
              <p className="text-xs">Administrator</p>
              <p className="text-[10px] text-slate-400">Full system access</p>
            </div>
          </button>

          <button
            onClick={() => { switchRole('staff'); toast.info("Role switched to Staff/Rider"); }}
            className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              user.role === 'staff' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold' : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <div>
              <p className="text-xs">Staff / Dispatch Rider</p>
              <p className="text-[10px] text-slate-400">Orders & dispatch only</p>
            </div>
          </button>

          <button
            onClick={() => { switchRole('customer'); toast.info("Role switched to Customer View"); }}
            className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              user.role === 'customer' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold' : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            <Store className="w-4 h-4" />
            <div>
              <p className="text-xs">Customer</p>
              <p className="text-[10px] text-slate-400">Storefront shopping only</p>
            </div>
          </button>
        </div>
      </GlassCard>

      {/* Security Permission Matrix */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 bg-slate-900 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" /> Module Permission Assertion Matrix
          </h3>
        </div>
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-bold">System Feature Module</th>
              <th className="py-3 px-4 font-bold text-center">Admin Role</th>
              <th className="py-3 px-4 font-bold text-center">Staff / Rider</th>
              <th className="py-3 px-4 font-bold text-center">Customer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {matrix.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-bold text-white">{row.module}</td>
                <td className="py-3.5 px-4 text-center">
                  {row.admin ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-rose-500 mx-auto" />}
                </td>
                <td className="py-3.5 px-4 text-center">
                  {row.staff ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-rose-500 mx-auto" />}
                </td>
                <td className="py-3.5 px-4 text-center">
                  {row.customer ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-rose-500 mx-auto" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
