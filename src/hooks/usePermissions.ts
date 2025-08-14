import { useAuthStore } from '../store/authStore';
import { DEFAULT_PERMISSIONS } from '../types/auth';

export const usePermissions = () => {
  const user = useAuthStore(state => state.user);

  const hasPermission = (module: string, action: 'create' | 'read' | 'update' | 'delete'): boolean => {
    if (!user) return false;
    
    const permissions = DEFAULT_PERMISSIONS[user.role];
    const modulePermissions = permissions.find(p => p.module === module);
    
    return modulePermissions ? modulePermissions[action] : false;
  };

  return { hasPermission };
};