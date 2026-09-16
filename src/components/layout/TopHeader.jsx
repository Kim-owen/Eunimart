import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, Search, Bell, Shield, Store, UserCheck, Smartphone } from 'lucide-react';

export function TopHeader({ activeTab, setActiveTab, toggleSidebar, isSidebarCollapsed }) {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, switchRole } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-emerald-400 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg leading-tight tracking-tight text-white flex items-center gap-1.5">
                Akua<span className="text-emerald-400">Market</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  D2C Admin
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Direct-to-Consumer Enterprise</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search orders, SKU, products, or customers..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
        </div>

        {/* Status Shortcuts, Role Selector & Theme Toggle */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* RBAC Role Selector Simulation */}
          <div className="relative group">
            <button className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200 hover:border-emerald-500/50 transition-all">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="capitalize">{user.role}</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl hidden group-hover:block z-50">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Switch Active Role</div>
              <button
                onClick={() => switchRole('admin')}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 ${user.role === 'admin' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <UserCheck className="w-3.5 h-3.5" /> Admin (Full Control)
              </button>
              <button
                onClick={() => switchRole('staff')}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 ${user.role === 'staff' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Staff / Dispatch Rider
              </button>
              <button
                onClick={() => switchRole('customer')}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 ${user.role === 'customer' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <Store className="w-3.5 h-3.5" /> Customer View
              </button>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all"
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Notifications Bell */}
          <button className="relative p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-emerald-500/40"
            />
            <div className="hidden lg:block">
              <p className="text-xs font-bold text-slate-100 leading-none">{user.name}</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
