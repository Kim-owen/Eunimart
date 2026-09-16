import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Store,
  Menu as MenuIcon,
  Layers,
  Video,
  Truck,
  ShieldCheck,
  Settings,
  Eye,
  X
} from 'lucide-react';

export function MobileBottomNav({ activeTab, setActiveTab }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: '3' },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'storefront', label: 'Storefront', icon: Store },
  ];

  const extraMenuItems = [
    { id: 'categories', label: 'Categories Taxonomy', icon: Layers },
    { id: 'hero-media', label: 'Hero Video Manager', icon: Video },
    { id: 'shipping', label: 'Delivery Zones', icon: Truck },
    { id: 'security', label: 'RBAC Security', icon: ShieldCheck },
    { id: 'settings', label: 'Store Settings', icon: Settings },
    { id: 'live-preview', label: 'Live Store Preview', icon: Eye }
  ];

  const handleExtraClick = (tabId) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Touch Menu Drawer Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fadeIn">
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-lg text-white">Full Admin Navigation</h3>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {extraMenuItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleExtraClick(item.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl text-left font-medium transition-all ${
                      activeTab === item.id
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-2xl border-t border-slate-800/90 px-3 py-2">
        <div className="flex items-center justify-around">
          {mainTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 min-w-[64px] py-1 transition-all relative ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-emerald-400' : ''}`} />
                <span className="text-[11px] leading-none">{tab.label}</span>
                {tab.badge && (
                  <span className="absolute -top-1 right-2 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => setIsMenuOpen(true)}
            className={`flex flex-col items-center gap-1 min-w-[64px] py-1 transition-all ${
              isMenuOpen ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MenuIcon className="w-5 h-5" />
            <span className="text-[11px] leading-none">Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
}
