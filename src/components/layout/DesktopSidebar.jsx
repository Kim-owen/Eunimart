import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Palette,
  Video,
  Truck,
  ShieldCheck,
  Settings,
  Eye,
  ChevronLeft,
  ChevronRight,
  Headphones,
  CheckCircle2,
  Bike,
  UserCheck,
  ShieldAlert
} from 'lucide-react';

export function DesktopSidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const { user, canAccess, roleMeta } = useAuth();

  const rawSections = [
    {
      group: 'Overview',
      items: [
        { id: 'dashboard', label: 'Analytics & Overview', icon: LayoutDashboard, badge: null }
      ]
    },
    {
      group: 'Commerce & Stock',
      items: [
        { id: 'orders', label: 'Orders & Logistics', icon: ShoppingBag, badge: '3 Pending' },
        { id: 'products', label: 'Products & Inventory', icon: Package, badge: null },
        { id: 'categories', label: 'Categories & Taxonomy', icon: Layers, badge: null }
      ]
    },
    {
      group: 'D2C Storefront',
      items: [
        { id: 'storefront', label: 'Storefront Builder', icon: Palette, badge: 'Live' },
        { id: 'hero-media', label: 'Hero Media Manager', icon: Video, badge: 'HD Video' },
        { id: 'live-preview', label: 'Live Store Preview', icon: Eye, badge: 'Preview' }
      ]
    },
    {
      group: 'Logistics & Config',
      items: [
        { id: 'rider-portal', label: 'Rider Courier Portal', icon: Bike, badge: 'Staff' },
        { id: 'shipping', label: 'Delivery Zones & Rates', icon: Truck, badge: null },
        { id: 'security', label: 'RBAC & Access Control', icon: ShieldCheck, badge: null },
        { id: 'settings', label: 'Policies & Notifications', icon: Settings, badge: null }
      ]
    }
  ];

  // Filter sections and items strictly based on user's assigned role permissions
  const sections = rawSections
    .map(section => ({
      ...section,
      items: section.items.filter(item => canAccess(item.id))
    }))
    .filter(section => section.items.length > 0);

  return (
    <aside
      className={`hidden md:flex flex-col justify-between sticky top-[65px] h-[calc(100vh-65px)] bg-slate-900/90 backdrop-blur-xl border-r border-slate-800/80 py-4 px-3 transition-all duration-300 z-30 select-none flex-shrink-0 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Navigation Sections */}
      <div className="space-y-4 overflow-y-auto no-scrollbar flex-1 pr-1">
        {/* Collapse / Expand Button */}
        <div className="flex items-center justify-between px-2 pb-1 border-b border-slate-800/60">
          {!isCollapsed && (
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Modules & Engine
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-auto border border-transparent hover:border-slate-700"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                {section.group}
              </p>
            )}

            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />

                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="truncate text-left">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700 ml-2 flex-shrink-0 whitespace-nowrap shadow-sm">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Active Indicator Line */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Active User Role Scoping Card */}
      {!isCollapsed && (
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-left mt-3 shadow-lg flex-shrink-0 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Active User Scope
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase font-bold">
              {user.role}
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-slate-400 leading-tight truncate mt-0.5">{roleMeta.label}</p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Access Modules:</span>
            <span className="font-bold text-emerald-400">
              {sections.reduce((acc, s) => acc + s.items.length, 0)} authorized
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
