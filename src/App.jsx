import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreSettingsProvider } from './context/StoreSettingsContext';
import { AdminLayout } from './components/layout/AdminLayout';

import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { OrderManager } from './components/orders/OrderManager';
import { ProductCatalog } from './components/products/ProductCatalog';
import { CategoryManager } from './components/categories/CategoryManager';
import { StorefrontBuilder } from './components/storefront/StorefrontBuilder';
import { HeroMediaManager } from './components/storefront/HeroMediaManager';
import { DeliveryZoneManager } from './components/shipping/DeliveryZoneManager';
import { RolePermissions } from './components/security/RolePermissions';
import { SystemSettings } from './components/settings/SystemSettings';
import { LiveStorefrontPreview } from './components/storefront/LiveStorefrontPreview';
import { FullStorefront } from './components/storefront/FullStorefront';
import { RiderPortal } from './components/shipping/RiderPortal';
import { BackgroundWallpaper } from './components/common/BackgroundWallpaper';

import { Toaster } from 'sonner';

function AppContent() {
  const { user, switchRole, canAccess, allowedModules, roleMeta } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState(() => {
    return window.location.hash.includes('store') ? 'storefront' : 'admin';
  });

  const isAuthorized = user?.role === 'admin' || (canAccess ? canAccess(activeTab) : true);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.includes('store')) {
        setViewMode('storefront');
      } else if (window.location.hash.includes('admin')) {
        setViewMode('admin');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // When role or user changes, strictly redirect to their authorized landing tab:
  useEffect(() => {
    if (user.role === 'customer' || user.role === 'wholesale') {
      setViewMode('storefront');
    } else {
      setViewMode('admin');
      if (user.role === 'staff') {
        setActiveTab('rider-portal');
      } else if (user.role === 'inventory') {
        if (!['products', 'categories'].includes(activeTab)) {
          setActiveTab('products');
        }
      } else if (user.role === 'manager') {
        if (['security', 'settings', 'storefront', 'hero-media'].includes(activeTab)) {
          setActiveTab('orders');
        }
      } else if (!allowedModules.includes(activeTab) && allowedModules.length > 0) {
        setActiveTab(allowedModules[0]);
      }
    }
  }, [user.role]);

  const openStorefront = () => {
    window.location.hash = '#storefront';
    switchRole('customer');
    setViewMode('storefront');
  };

  const openAdmin = () => {
    window.location.hash = '#admin';
    switchRole('admin');
    setViewMode('admin');
  };

  return (
    <div className="relative min-h-screen">
      <BackgroundWallpaper currentView={viewMode} />
      {viewMode === 'storefront' || user.role === 'customer' || user.role === 'wholesale' ? (
        <FullStorefront onOpenAdmin={openAdmin} />
      ) : (
        <AdminLayout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenStorefront={openStorefront}
        >
          {!isAuthorized ? (
            <div className="p-8 max-w-lg mx-auto text-center space-y-4 my-12 bg-slate-900/90 rounded-3xl border border-rose-500/30 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <span className="text-xl font-bold">403</span>
              </div>
              <h2 className="text-lg font-bold text-white">Module Access Restricted</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your assigned role (<b className="text-amber-400 capitalize">{user.role}</b>: {roleMeta?.label}) does not have permission to access the <b>{activeTab}</b> workspace.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab(allowedModules[0] || 'dashboard')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md"
                >
                  Return to Authorized Workspace ({allowedModules[0] || 'Home'})
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'rider-portal' && <RiderPortal onSwitchToAdmin={openAdmin} />}
              {activeTab === 'dashboard' && <AnalyticsDashboard setActiveTab={setActiveTab} />}
              {activeTab === 'orders' && <OrderManager />}
              {activeTab === 'products' && <ProductCatalog />}
              {activeTab === 'categories' && <CategoryManager />}
              {activeTab === 'storefront' && <StorefrontBuilder setActiveTab={setActiveTab} />}
              {activeTab === 'hero-media' && <HeroMediaManager />}
              {activeTab === 'shipping' && <DeliveryZoneManager />}
              {activeTab === 'security' && <RolePermissions />}
              {activeTab === 'settings' && <SystemSettings />}
              {activeTab === 'live-preview' && <LiveStorefrontPreview onOpenFullStorefront={openStorefront} />}
            </>
          )}
        </AdminLayout>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreSettingsProvider>
          <Toaster position="top-right" richColors />
          <AppContent />
        </StoreSettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
