import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const ROLE_PERMISSIONS = {
  admin: {
    label: 'Root Administrator',
    description: 'Full root access to financial analytics, catalog, security RBAC & policies',
    modules: ['dashboard', 'orders', 'products', 'categories', 'storefront', 'hero-media', 'live-preview', 'rider-portal', 'shipping', 'security', 'settings']
  },
  manager: {
    label: 'Logistics Operations Manager',
    description: 'Manages catalog inventory, customer orders, dispatch manifests & delivery zones',
    modules: ['dashboard', 'orders', 'products', 'categories', 'shipping', 'live-preview']
  },
  staff: {
    label: 'Dispatch Rider / Courier',
    description: 'Order delivery dispatch, customer GPS zones & OTP drop-off confirmation',
    modules: ['rider-portal']
  },
  inventory: {
    label: 'Inventory & Stock Clerk',
    description: 'Restricted strictly to product catalog pricing, stock count & category taxonomy',
    modules: ['products', 'categories', 'live-preview']
  },
  wholesale: {
    label: 'Verified Wholesale Merchant',
    description: 'Direct access to Factory Pallet rates and bulk ordering',
    modules: [] // Storefront shopping only
  },
  customer: {
    label: 'Storefront Shopper',
    description: 'Standard retail consumer shopping and mobile money checkout',
    modules: [] // Storefront shopping only
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('akua_active_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      id: 'usr-admin-01',
      name: 'Akua Mansa',
      email: 'admin@akuamarket.com',
      role: 'admin',
      wholesale_tier: 'Diamond',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
  });

  useEffect(() => {
    localStorage.setItem('akua_active_user', JSON.stringify(user));
  }, [user]);

  const switchRole = (newRole) => {
    setUser(prev => ({
      ...prev,
      role: newRole,
      name: newRole === 'admin' 
        ? 'Akua Mansa (Admin)' 
        : newRole === 'manager'
        ? 'Ama Serwaa (Logistics Manager)'
        : newRole === 'staff' 
        ? 'Kofi Mensah (Dispatch Rider)' 
        : newRole === 'inventory'
        ? 'Kwesi Mensah (Inventory Clerk)'
        : 'Kwame Trading (Wholesale Buyer)'
    }));
  };

  const switchActiveUser = (newUser) => {
    if (!newUser) return;
    setUser({
      id: newUser.id || `usr-${Date.now()}`,
      name: newUser.full_name || newUser.name || 'Akua User',
      email: newUser.email || 'user@akuamarket.com',
      role: newUser.role || 'staff',
      wholesale_tier: newUser.wholesale_tier || 'Standard',
      avatar: newUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
  };

  const canAccess = (moduleKey) => {
    if (!user || !user.role) return false;
    const permissions = ROLE_PERMISSIONS[user.role];
    if (!permissions) return false;
    return permissions.modules.includes(moduleKey);
  };

  const allowedModules = ROLE_PERMISSIONS[user.role]?.modules || [];
  const isAdmin = user.role === 'admin';
  const isStaff = user.role === 'staff';
  const isManager = user.role === 'manager';
  const isInventory = user.role === 'inventory';

  return (
    <AuthContext.Provider value={{
      user,
      switchRole,
      switchActiveUser,
      canAccess,
      allowedModules,
      isAdmin,
      isStaff,
      isManager,
      isInventory,
      roleMeta: ROLE_PERMISSIONS[user.role] || ROLE_PERMISSIONS.customer
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
