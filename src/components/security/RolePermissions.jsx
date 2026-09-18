import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import { Modal } from '../ui/Modal';
import { fetchStaffMembersApi, saveStaffMemberApi, updateStaffRoleApi, deleteStaffMemberApi } from '../../services/api';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Smartphone,
  Store,
  KeyRound,
  Check,
  X,
  Plus,
  Trash2,
  Mail,
  Phone,
  Users,
  Search,
  Activity,
  ShieldAlert,
  Fingerprint,
  CheckCircle2,
  Award,
  Crown,
  Briefcase,
  Bike,
  Package,
  Edit2,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

export const ROLE_DEFINITIONS = [
  { id: 'admin', label: 'Administrator', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: Crown, desc: 'Full root access to all financial, catalog & security studios', modulesSummary: 'All 10 Core Modules' },
  { id: 'manager', label: 'Logistics Manager', badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Briefcase, desc: 'Manages catalog inventory, dispatch manifests & delivery zones', modulesSummary: 'Orders, Inventory, Zones, Analytics' },
  { id: 'staff', label: 'Dispatch Rider / Courier', badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30', icon: Bike, desc: 'Order fulfillment, rider mobile navigation & OTP delivery', modulesSummary: 'Rider Courier Portal Only' },
  { id: 'inventory', label: 'Inventory & Stock Clerk', badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30', icon: Package, desc: 'Restricted strictly to product catalog pricing, stock count & categories', modulesSummary: 'Products & Categories Only' },
  { id: 'wholesale', label: 'Verified Wholesale Buyer', badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Package, desc: 'Direct access to Carton & Pallet wholesale price tiers', modulesSummary: 'Storefront Pallet Wholesale' },
  { id: 'customer', label: 'Storefront Customer', badgeColor: 'bg-slate-800 text-slate-300 border-slate-700', icon: Store, desc: 'Standard shopping and Paystack Mobile Money checkout', modulesSummary: 'Storefront Shopping' }
];

export const WHOLESALE_TIERS = [
  { id: 'Standard', label: 'Standard Retail (0%)', discount: '0%', color: 'text-slate-400 border-slate-700' },
  { id: 'Silver', label: 'Silver Wholesaler (5% OFF)', discount: '5%', color: 'text-slate-300 border-slate-600 bg-slate-800' },
  { id: 'Gold', label: 'Gold Distributor (15% OFF)', discount: '15%', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
  { id: 'Diamond', label: 'Diamond Enterprise (25% OFF)', discount: '25%', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' }
];

export function RolePermissions() {
  const { user, switchRole, switchActiveUser } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', role: 'staff', wholesale_tier: 'Standard' });
  const [twoFactorEnforced, setTwoFactorEnforced] = useState(true);

  const loadStaff = async () => {
    const data = await fetchStaffMembersApi();
    if (data && data.length > 0) {
      setStaffList(data);
    } else {
      // Fallback default staff
      setStaffList([
        { id: "usr-admin-01", full_name: 'Akua Osei (CEO)', email: 'akua@akuamarket.com', phone: '+233 24 100 2000', role: 'admin', wholesale_tier: 'Diamond', status: 'active' },
        { id: "usr-staff-02", full_name: 'Kofi Mensah', email: 'kofi.mensah@akuamarket.com', phone: '+233 20 099 8877', role: 'staff', wholesale_tier: 'Standard', status: 'active' },
        { id: "usr-staff-03", full_name: 'Ama Serwaa', email: 'ama.serwaa@akuamarket.com', phone: '+233 50 112 3344', role: 'manager', wholesale_tier: 'Gold', status: 'active' },
        { id: "usr-staff-04", full_name: 'Kwame Trading Ltd', email: 'kwame@ghanafood.com', phone: '+233 24 411 2233', role: 'wholesale', wholesale_tier: 'Diamond', status: 'active' }
      ]);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  // Quick Inline Role Assignment
  const handleAssignRole = async (staffId, newRole) => {
    const current = staffList.find(s => s.id === staffId);
    await updateStaffRoleApi(staffId, newRole, current?.wholesale_tier || 'Standard');
    setStaffList(prev => prev.map(s => s.id === staffId ? { ...s, role: newRole } : s));
    const roleObj = ROLE_DEFINITIONS.find(r => r.id === newRole);
    toast.success(`Role for ${current?.full_name || 'user'} updated to: ${roleObj?.label || newRole}`);
  };

  // Quick Inline Wholesale Tier Assignment
  const handleAssignWholesaleTier = async (staffId, newTier) => {
    const current = staffList.find(s => s.id === staffId);
    await updateStaffRoleApi(staffId, current?.role || 'staff', newTier);
    setStaffList(prev => prev.map(s => s.id === staffId ? { ...s, wholesale_tier: newTier } : s));
    toast.success(`Wholesale Tier for ${current?.full_name || 'user'} assigned to: ${newTier}`);
  };

  const handleOpenEdit = (staff) => {
    setEditingStaff({ ...staff, wholesale_tier: staff.wholesale_tier || 'Standard' });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingStaff) return;
    await saveStaffMemberApi(editingStaff);
    await loadStaff();
    toast.success(`User '${editingStaff.full_name}' updated successfully!`);
    setIsEditModalOpen(false);
    setEditingStaff(null);
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email) {
      toast.error('Please enter full name and email');
      return;
    }
    await saveStaffMemberApi(formData);
    await loadStaff();
    toast.success(`User '${formData.full_name}' created with role '${formData.role.toUpperCase()}'!`);
    setIsModalOpen(false);
    setFormData({ full_name: '', email: '', phone: '', role: 'staff', wholesale_tier: 'Standard' });
  };

  const handleDeleteStaff = async (id, name) => {
    if (window.confirm(`Revoke enterprise system access for ${name}?`)) {
      await deleteStaffMemberApi(id);
      setStaffList(prev => prev.filter(s => s.id !== id));
      toast.success(`Access credentials revoked for ${name}`);
    }
  };

  const filteredStaff = staffList.filter(s => {
    const matchesSearch = s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.phone && s.phone.includes(searchQuery));
    const matchesRole = roleFilter === 'all' || s.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const matrix = [
    { module: 'Executive Analytics & Revenue Insights', desc: 'Real-time GMV, GHS/USD metrics & daily corridor targets', admin: true, manager: true, staff: true, wholesale: false, customer: false },
    { module: 'Order Management & Dispatch Control', desc: 'Order verification, delivery status updates & dispatch manifest printing', admin: true, manager: true, staff: true, wholesale: false, customer: false },
    { module: 'Product Catalog & Inventory Valuation', desc: 'Create products, set wholesale carton/pallet pricing, manage stock levels', admin: true, manager: true, staff: false, wholesale: false, customer: false },
    { module: 'Storefront Live Builder & Theme Engine', desc: 'Customize brand colors, typography, and reorder homepage layout modules', admin: true, manager: false, staff: false, wholesale: false, customer: false },
    { module: 'Hero Media HD Video Showcase Studio', desc: 'Configure cinematic 4K ambient video, posters, vignettes & CTAs', admin: true, manager: false, staff: false, wholesale: false, customer: false },
    { module: 'Freight Zones & Corridor Tariff Rates', desc: 'Configure regional delivery zones, base courier fees, and SLA guarantees', admin: true, manager: true, staff: false, wholesale: false, customer: false },
    { module: 'System Settings & Multi-Channel SMS Alerts', desc: 'TxtConnect / Twilio SMS alerts, Paystack MoMo webhooks & store policies', admin: true, manager: false, staff: false, wholesale: false, customer: false },
    { module: 'Wholesale B2B Carton & Pallet Rates', desc: 'Factory direct bulk ordering, volume RFQs, and deferred settlement', admin: true, manager: true, staff: false, wholesale: true, customer: false },
    { module: 'Public Storefront Shopping & MoMo Checkout', desc: 'Browse wholesale items, add to cart, generate pro-forma RFQ quotes', admin: true, manager: true, staff: true, wholesale: true, customer: true },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" /> Enterprise Zero-Trust Security
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono">
              RBAC & Wholesale Tier Engine
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Identity, Role Assignment & Security Access</h2>
          <p className="text-xs text-slate-400">
            Assign and modify user roles, designate wholesale discount tiers, and manage permissions across internal studios.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add User / Assign Role
        </button>
      </div>

      {/* Security Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <GlassCard className="p-3.5 sm:p-4 flex items-center gap-3.5 border-slate-800">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Total Managed Accounts</p>
            <p className="text-lg font-black text-white truncate">{staffList.length} Authenticated</p>
          </div>
        </GlassCard>

        <GlassCard className="p-3.5 sm:p-4 flex items-center gap-3.5 border-slate-800">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">2FA Multi-Factor Policy</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">{twoFactorEnforced ? 'Enforced' : 'Optional'}</span>
              <button
                onClick={() => {
                  setTwoFactorEnforced(!twoFactorEnforced);
                  toast.success(`2FA policy updated to: ${!twoFactorEnforced ? 'Enforced' : 'Optional'}`);
                }}
                className="text-[10px] font-bold text-indigo-400 underline hover:text-indigo-300"
              >
                Toggle
              </button>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-3.5 sm:p-4 flex items-center gap-3.5 border-slate-800">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">B2B Wholesale Accounts</p>
            <p className="text-sm font-black text-amber-400 flex items-center gap-1 truncate">
              {staffList.filter(s => s.role === 'wholesale' || s.wholesale_tier !== 'Standard').length} Active Tiers
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-3.5 sm:p-4 flex items-center gap-3.5 border-slate-800">
          <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex-shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Active Role Simulator</p>
            <p className="text-sm font-black font-mono uppercase text-emerald-400 truncate">{user.role}</p>
          </div>
        </GlassCard>
      </div>

      {/* Role Simulator & Persona Preview */}
      <GlassCard className="space-y-4 border-emerald-500/30 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-emerald-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Active Simulation Session: {user.name}</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Click any role persona to preview the interface through that user's permission scope.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto">
            Live Simulator Engine
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <button
            onClick={() => { switchRole('admin'); toast.success("Role switched to Administrator. All root modules unlocked."); }}
            className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
              user.role === 'admin'
                ? 'bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/20 text-white shadow-lg'
                : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className={`p-2 rounded-xl flex-shrink-0 ${user.role === 'admin' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              <Crown className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white">Administrator</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">All 10 Core Modules Unlocked</p>
            </div>
          </button>

          <button
            onClick={() => { switchRole('manager'); toast.info("Role switched to Logistics Manager. Orders, inventory & zones active."); }}
            className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
              user.role === 'manager'
                ? 'bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/20 text-white shadow-lg'
                : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className={`p-2 rounded-xl flex-shrink-0 ${user.role === 'manager' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white">Logistics Manager</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">Orders, Stock, Zones & Analytics</p>
            </div>
          </button>

          <button
            onClick={() => { switchRole('staff'); toast.info("Role switched to Dispatch Rider. Rider Courier Portal active."); }}
            className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
              user.role === 'staff'
                ? 'bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/20 text-white shadow-lg'
                : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className={`p-2 rounded-xl flex-shrink-0 ${user.role === 'staff' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              <Bike className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white">Dispatch Rider</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">Rider Courier Portal Only</p>
            </div>
          </button>

          <button
            onClick={() => { switchRole('inventory'); toast.info("Role switched to Inventory Clerk. Products & Categories active."); }}
            className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
              user.role === 'inventory'
                ? 'bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/20 text-white shadow-lg'
                : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className={`p-2 rounded-xl flex-shrink-0 ${user.role === 'inventory' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              <Package className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-white">Inventory Clerk</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">Products & Taxonomy Only</p>
            </div>
          </button>
        </div>
      </GlassCard>

      {/* Staff & User Directory with Interactive Role Assignment */}
      <GlassCard className="p-0 overflow-hidden border-slate-800">
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" /> User Accounts & Role Assignment Studio ({filteredStaff.length})
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Change user roles, assign wholesale discount tiers, or revoke access with instant persistence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-56"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 flex-1 sm:flex-initial"
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="manager">Logistics Managers</option>
              <option value="staff">Staff / Riders</option>
              <option value="wholesale">Wholesale Buyers</option>
              <option value="customer">Customers</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-bold">User / Account</th>
                <th className="py-3 px-4 font-bold">Contact</th>
                <th className="py-3 px-4 font-bold">Assigned Role</th>
                <th className="py-3 px-4 font-bold">Permitted Modules Scope</th>
                <th className="py-3 px-4 font-bold">Wholesale Tier</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No users match the search criteria "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredStaff.map((s) => {
                  const roleObj = ROLE_DEFINITIONS.find(r => r.id === s.role) || ROLE_DEFINITIONS[2];
                  const currentTier = s.wholesale_tier || 'Standard';
                  const isCurrentSession = user.id === s.id;

                  return (
                    <tr key={s.id} className={`hover:bg-slate-800/40 transition-colors ${isCurrentSession ? 'bg-emerald-500/5' : ''}`}>
                      {/* Name & ID */}
                      <td className="py-3.5 px-4 font-bold text-white">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            isCurrentSession ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-800 border-slate-700 text-emerald-400'
                          }`}>
                            {s.full_name ? s.full_name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                                {s.full_name}
                                {s.role === 'admin' && <Crown className="w-3 h-3 text-amber-400 inline" />}
                              </p>
                              {isCurrentSession && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  Current User
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono">ID: #{s.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-slate-300">
                            <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span className="truncate max-w-[160px]">{s.email}</span>
                          </div>
                          {s.phone && (
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                              <Phone className="w-3 h-3 text-slate-500 flex-shrink-0" />
                              <span>{s.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Interactive Role Assignment Dropdown */}
                      <td className="py-3.5 px-4">
                        <div className="relative inline-block">
                          <select
                            value={s.role}
                            onChange={(e) => handleAssignRole(s.id, e.target.value)}
                            className="appearance-none pl-3 pr-8 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-800/90 border border-slate-700 text-white hover:border-emerald-500 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-sm transition-all"
                          >
                            {ROLE_DEFINITIONS.map(r => (
                              <option key={r.id} value={r.id} className="bg-slate-900 text-white normal-case">
                                {r.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </td>

                      {/* Permitted Modules Limitation Pill */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block w-fit ${roleObj.badgeColor}`}>
                            {roleObj.modulesSummary || 'Limited Scope'}
                          </span>
                          <span className="text-[9px] text-slate-400 truncate max-w-[200px]">
                            {roleObj.desc}
                          </span>
                        </div>
                      </td>

                      {/* Interactive Wholesale Tier Assignment Dropdown */}
                      <td className="py-3.5 px-4">
                        <div className="relative inline-block">
                          <select
                            value={currentTier}
                            onChange={(e) => handleAssignWholesaleTier(s.id, e.target.value)}
                            className="appearance-none pl-3 pr-8 py-1.5 rounded-xl text-xs font-bold bg-slate-800/90 border border-slate-700 text-slate-200 hover:border-amber-400 focus:outline-none focus:border-amber-400 cursor-pointer shadow-sm transition-all"
                          >
                            {WHOLESALE_TIERS.map(t => (
                              <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                                {t.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              switchActiveUser(s);
                              toast.success(`Active session switched to ${s.full_name} (${s.role.toUpperCase()})`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold transition-all flex items-center gap-1 active:scale-95"
                            title="Test / Switch into this user's restricted view"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span className="hidden xl:inline">Test View</span>
                          </button>
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                            title="Edit User Details & Permissions"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(s.id, s.full_name)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors"
                            title="Revoke Access"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Security Capability Assertion Matrix */}
      <GlassCard className="p-0 overflow-hidden border-slate-800">
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" /> Granular Capability Assertion Matrix
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Enforcement matrix across Administrator, Manager, Dispatch Staff, and Wholesale Buyer roles.</p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {matrix.length} Capabilities Mapped
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-bold">System Feature Module & Capability</th>
                <th className="py-3 px-4 font-bold text-center w-24">Admin</th>
                <th className="py-3 px-4 font-bold text-center w-24">Manager</th>
                <th className="py-3 px-4 font-bold text-center w-24">Rider/Staff</th>
                <th className="py-3 px-4 font-bold text-center w-24">Wholesale</th>
                <th className="py-3 px-4 font-bold text-center w-24">Customer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white text-xs">{row.module}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{row.desc}</p>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.admin ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/10 text-rose-500">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.manager ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/10 text-rose-500">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.staff ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/10 text-rose-500">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.wholesale ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/10 text-rose-500">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.customer ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/10 text-rose-500">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Edit User & Role Assignment Modal */}
      {isEditModalOpen && editingStaff && (
        <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingStaff(null); }} title={`Edit User & Assign Role: ${editingStaff.full_name}`}>
          <form onSubmit={handleEditSubmit} className="space-y-4 text-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={editingStaff.full_name}
                onChange={(e) => setEditingStaff(prev => ({ ...prev, full_name: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Official Email</label>
              <input
                type="email"
                required
                value={editingStaff.email}
                onChange={(e) => setEditingStaff(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingStaff.phone || ''}
                  onChange={(e) => setEditingStaff(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Assign Role</label>
                <select
                  value={editingStaff.role}
                  onChange={(e) => setEditingStaff(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {ROLE_DEFINITIONS.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Assign Wholesale Pricing Tier</label>
              <select
                value={editingStaff.wholesale_tier || 'Standard'}
                onChange={(e) => setEditingStaff(prev => ({ ...prev, wholesale_tier: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {WHOLESALE_TIERS.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => { setIsEditModalOpen(false); setEditingStaff(null); }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                Save Role & Tier
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add / Invite User Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Invite User & Assign Initial Role">
        <form onSubmit={handleAddStaff} className="space-y-4 text-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="e.g. Kwame Adjei"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Official Work Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="kwame.adjei@akuamarket.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Contact (Ghana)</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+233 24 000 0000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Assign Security Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {ROLE_DEFINITIONS.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Assign Wholesale Pricing Tier</label>
            <select
              value={formData.wholesale_tier}
              onChange={(e) => setFormData(prev => ({ ...prev, wholesale_tier: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {WHOLESALE_TIERS.map(t => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              The user will automatically inherit the permissions and wholesale discount rate associated with this role.
            </span>
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
              Create Account & Assign Role
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
