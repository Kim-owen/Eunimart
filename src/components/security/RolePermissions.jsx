import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import { Modal } from '../ui/Modal';
import { fetchStaffMembersApi, saveStaffMemberApi, deleteStaffMemberApi } from '../../services/api';
import { ShieldCheck, Lock, UserCheck, Smartphone, Store, KeyRound, Check, X, Plus, Trash2, Mail, Phone, Users } from 'lucide-react';
import { toast } from 'sonner';

export function RolePermissions() {
  const { user, switchRole } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', role: 'staff' });

  const loadStaff = async () => {
    const data = await fetchStaffMembersApi();
    if (data) setStaffList(data);
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    await saveStaffMemberApi(formData);
    await loadStaff();
    toast.success(`Staff user '${formData.full_name}' added`);
    setIsModalOpen(false);
    setFormData({ full_name: '', email: '', phone: '', role: 'staff' });
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm("Revoke system access for this staff member?")) {
      await deleteStaffMemberApi(id);
      setStaffList(prev => prev.filter(s => s.id !== id));
      toast.success("Staff access revoked");
    }
  };

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
          <p className="text-xs text-slate-400 mt-1">Manage system staff users, roles, and security assertion guards.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
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

      {/* Staff User Management Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" /> Active System Staff & Team Members ({staffList.length})
          </h3>
        </div>
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-bold">Staff Name</th>
              <th className="py-3 px-4 font-bold">Email</th>
              <th className="py-3 px-4 font-bold">Role</th>
              <th className="py-3 px-4 font-bold">Phone</th>
              <th className="py-3 px-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {staffList.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-bold text-white">{s.full_name}</td>
                <td className="py-3.5 px-4 font-mono text-slate-400">{s.email}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    s.role === 'admin' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {s.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-300">{s.phone || 'N/A'}</td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => handleDeleteStaff(s.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400"
                    title="Revoke Access"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

      {/* Add Staff Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Invite New Staff Member">
        <form onSubmit={handleAddStaff} className="space-y-4 text-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="e.g. Ama Serwaa"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="staff@akuamarket.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+233241234567"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Assign Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="staff">Staff / Dispatch Rider</option>
                <option value="admin">Administrator</option>
                <option value="manager">Logistics Manager</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
            >
              Save Staff Access
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
