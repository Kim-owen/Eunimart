import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 'usr-admin-01',
    name: 'Akua Mansa',
    email: 'admin@akuamarket.com',
    role: 'admin', // 'admin' | 'staff' | 'customer'
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  });

  const switchRole = (newRole) => {
    setUser(prev => ({
      ...prev,
      role: newRole,
      name: newRole === 'admin' ? 'Akua Mansa (Admin)' : newRole === 'staff' ? 'Kofi Mensah (Dispatch Rider)' : 'Ama Serwaa (Customer)'
    }));
  };

  const hasRole = (roleToCheck) => user.role === roleToCheck;
  const isAdmin = user.role === 'admin';
  const isStaff = user.role === 'staff' || user.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      switchRole,
      hasRole,
      isAdmin,
      isStaff
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
