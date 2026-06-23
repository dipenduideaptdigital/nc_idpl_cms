import { useAuth } from '../context/AuthContext';

export const usePermission = () => {
  const { user } = useAuth();

  const hasPermission = (requiredPermission) => {
    if (!user) return false;
    const systemRole = typeof user.systemRole === 'string' ? user.systemRole : user.systemRole?.slug;
    if (systemRole === 'SUPER_ADMIN') return true;
    return user.permissions?.includes(requiredPermission) || false;
  };

  return { hasPermission };
};