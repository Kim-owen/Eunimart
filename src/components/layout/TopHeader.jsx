import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  Sun,
  Moon,
  Search,
  Bell,
  Shield,
  Store,
  UserCheck,
  Smartphone,
  Check,
  ChevronDown,
  Sparkles,
  Zap,
  Globe,
  ExternalLink,
  Briefcase,
  Bike,
  Package,
  Palette
} from 'lucide-react';

export function TopHeader({ activeTab, setActiveTab, onOpenStorefront }) {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, switchRole } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const notifications = [
    { id: 1, title: 'Rider Assigned to #GH-WH-8831', time: '5 mins ago', tag: 'Logistics', unread: true },
    { id: 2, title: 'Paystack MoMo Confirmed (GH₵ 2,150.00)', time: '18 mins ago', tag: 'Finance', unread: true },
    { id: 3, title: 'Low Stock Alert: Royal Aroma Rice 5kg', time: '1 hr ago', tag: 'Inventory', unread: false }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-colors">
      <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-[1680px] mx-auto">
        
        {/* Brand Identity */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all overflow-hidden">
            <img src="/factory_mall_logo.jpg" alt="Factory Mall Shopping Cart Logo" className="w-full h-full object-cover rounded-[9px]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg text-white tracking-tight leading-none">
                Factory<span className="text-emerald-400">Mall</span>
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Direct Wholesale
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5 hidden sm:inline-block">
              Factory Direct Supermarket & Mall Engine
            </span>
          </div>
        </div>


        {/* Universal Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-lg mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search orders, SKUs, inventory, or customer phone..."
              className="w-full pl-10 pr-12 py-2 text-xs rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          
          {/* Live Store View Quick Shortcut */}
          <button
            onClick={onOpenStorefront || (() => setActiveTab('live-preview'))}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-black transition-all shadow-sm active:scale-95"
            title="Open Live Customer Storefront"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Customer Storefront</span>
            <ExternalLink className="w-3 h-3 text-emerald-400" />
          </button>

          {/* RBAC Role Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="capitalize hidden sm:inline font-bold">{user.role} View</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowRoleDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-60 max-w-[calc(100vw-32px)] py-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 animate-fadeIn space-y-1">
                  <div className="px-3.5 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Switch Active Simulator Role
                  </div>
                  
                  <button
                    onClick={() => { switchRole('admin'); setShowRoleDropdown(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                      user.role === 'admin'
                        ? 'bg-emerald-500/15 text-emerald-400 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <UserCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Administrator</p>
                        <p className="text-[10px] text-slate-400">All 10 Modules Unlocked</p>
                      </div>
                    </div>
                    {user.role === 'admin' && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                  </button>

                  <button
                    onClick={() => { switchRole('manager'); setShowRoleDropdown(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                      user.role === 'manager'
                        ? 'bg-emerald-500/15 text-emerald-400 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Logistics Manager</p>
                        <p className="text-[10px] text-slate-400">Orders, Stock & Zones</p>
                      </div>
                    </div>
                    {user.role === 'manager' && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                  </button>

                  <button
                    onClick={() => { switchRole('staff'); setShowRoleDropdown(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                      user.role === 'staff'
                        ? 'bg-emerald-500/15 text-emerald-400 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Bike className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Dispatch Rider</p>
                        <p className="text-[10px] text-slate-400">Courier Portal Only</p>
                      </div>
                    </div>
                    {user.role === 'staff' && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                  </button>

                  <button
                    onClick={() => { switchRole('inventory'); setShowRoleDropdown(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                      user.role === 'inventory'
                        ? 'bg-emerald-500/15 text-emerald-400 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Package className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Inventory Clerk</p>
                        <p className="text-[10px] text-slate-400">Products & Catalog Only</p>
                      </div>
                    </div>
                    {user.role === 'inventory' && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                  </button>

                  <button
                    onClick={() => { switchRole('customer'); setShowRoleDropdown(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                      user.role === 'customer'
                        ? 'bg-emerald-500/15 text-emerald-400 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Store className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Customer Storefront</p>
                        <p className="text-[10px] text-slate-400">Public Shopping Only</p>
                      </div>
                    </div>
                    {user.role === 'customer' && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Theme & Wallpaper Studio Quick Access */}
          <button
            onClick={() => setActiveTab('storefront')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all shadow-sm active:scale-95"
            title="Theme & Luxury Wallpaper Studio"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline text-xs font-semibold">Theme Studio</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all shadow-sm"
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Notifications Bell Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all shadow-sm"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
            </button>

            {showNotifDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-32px)] py-3 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 animate-fadeIn space-y-2">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Direct Activity Feed
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      2 Unread
                    </span>
                  </div>
                  <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-3 hover:bg-slate-800/50 transition-colors cursor-pointer space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                            {n.tag}
                          </span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium">{n.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-emerald-500/50 bg-slate-800 flex-shrink-0">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                }}
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <p className="text-xs font-bold text-white leading-none truncate max-w-[130px]">{user.name}</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate max-w-[130px]">{user.email}</p>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
