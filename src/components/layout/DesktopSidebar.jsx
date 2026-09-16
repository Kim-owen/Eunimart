import React from 'react';
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
  ChevronRight
} from 'lucide-react';

export function DesktopSidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const menuItems = [
    { id: 'dashboard', label: 'Analytics & Overview', icon: LayoutDashboard, badge: null },
    { id: 'orders', label: 'Orders & Logistics', icon: ShoppingBag, badge: '3 Pending' },
    { id: 'products', label: 'Products & Inventory', icon: Package, badge: null },
    { id: 'categories', label: 'Categories & Taxonomy', icon: Layers, badge: null },
    { id: 'storefront', label: 'Storefront Builder', icon: Palette, badge: 'Live' },
    { id: 'hero-media', label: 'Hero Media Manager', icon: Video, badge: 'HD Video' },
    { id: 'shipping', label: 'Delivery Zones & Rates', icon: Truck, badge: null },
    { id: 'security', label: 'RBAC & Access Control', icon: ShieldCheck, badge: null },
    { id: 'settings', label: 'Policies & Notifications', icon: Settings, badge: null },
    { id: 'live-preview', label: 'Live Store Preview', icon: Eye, badge: 'Storefront' }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col justify-between sticky top-[65px] h-[calc(100vh-65px)] bg-slate-900/60 backdrop-blur-xl border-r border-slate-800/80 p-3.5 transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-3 py-2 mb-2">
          {!isCollapsed && (
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Management Modules
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-auto"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all relative ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {!isCollapsed && item.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!isCollapsed && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/90 border border-slate-700/60 text-center">
          <p className="text-xs font-bold text-white">Need Live Help?</p>
          <p className="text-[11px] text-slate-400 mt-1">D2C Multi-Channel Direct Engine Active</p>
        </div>
      )}
    </aside>
  );
}
