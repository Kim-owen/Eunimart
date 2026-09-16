import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
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

import { Toaster } from 'sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreSettingsProvider>
          <Toaster position="top-right" richColors />
          <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === 'dashboard' && <AnalyticsDashboard setActiveTab={setActiveTab} />}
            {activeTab === 'orders' && <OrderManager />}
            {activeTab === 'products' && <ProductCatalog />}
            {activeTab === 'categories' && <CategoryManager />}
            {activeTab === 'storefront' && <StorefrontBuilder setActiveTab={setActiveTab} />}
            {activeTab === 'hero-media' && <HeroMediaManager />}
            {activeTab === 'shipping' && <DeliveryZoneManager />}
            {activeTab === 'security' && <RolePermissions />}
            {activeTab === 'settings' && <SystemSettings />}
            {activeTab === 'live-preview' && <LiveStorefrontPreview />}
          </AdminLayout>
        </StoreSettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
