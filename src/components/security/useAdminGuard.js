import { useAuth } from '../../context/AuthContext';

export function useAdminGuard() {
  const { user, isAdmin, isStaff } = useAuth();

  const checkPermission = (requiredRole = 'admin') => {
    if (requiredRole === 'admin') return isAdmin;
    if (requiredRole === 'staff') return isStaff;
    return true;
  };

  const assertAdminRole = () => {
    if (!isAdmin) {
      throw new Error("403 Forbidden: Administrative privilege required to perform this action.");
    }
    return true;
  };

  return {
    user,
    isAdmin,
    isStaff,
    checkPermission,
    assertAdminRole
  };
}
