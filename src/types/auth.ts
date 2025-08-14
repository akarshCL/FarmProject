export type UserRole = 'superadmin' | 'admin' | 'supervisor';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface ModulePermission {
  module: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export const DEFAULT_PERMISSIONS: Record<UserRole, ModulePermission[]> = {
  superadmin: [
    { module: 'dashboard', create: true, read: true, update: true, delete: true },
    { module: 'inventory', create: true, read: true, update: true, delete: true },
    { module: 'workforce', create: true, read: true, update: true, delete: true },
    { module: 'livestock', create: true, read: true, update: true, delete: true },
    { module: 'crops', create: true, read: true, update: true, delete: true },
    { module: 'fuel', create: true, read: true, update: true, delete: true },
    { module: 'vehicles', create: true, read: true, update: true, delete: true },
    { module: 'cctv', create: true, read: true, update: true, delete: true },
    { module: 'gps', create: true, read: true, update: true, delete: true },
    { module: 'vendors', create: true, read: true, update: true, delete: true },
    { module: 'whatsapp', create: true, read: true, update: true, delete: true },
    { module: 'ai', create: true, read: true, update: true, delete: true },
    { module: 'news', create: true, read: true, update: true, delete: true },
    { module: 'finance', create: true, read: true, update: true, delete: true },
  ],
  admin: [
    { module: 'dashboard', create: true, read: true, update: true, delete: false },
    { module: 'inventory', create: true, read: true, update: true, delete: false },
    { module: 'workforce', create: true, read: true, update: true, delete: false },
    { module: 'livestock', create: true, read: true, update: true, delete: false },
    { module: 'crops', create: true, read: true, update: true, delete: false },
    { module: 'fuel', create: true, read: true, update: true, delete: false },
    { module: 'vehicles', create: true, read: true, update: true, delete: false },
    { module: 'cctv', create: false, read: true, update: false, delete: false },
    { module: 'gps', create: false, read: true, update: false, delete: false },
    { module: 'vendors', create: true, read: true, update: true, delete: false },
    { module: 'whatsapp', create: true, read: true, update: true, delete: false },
    { module: 'ai', create: false, read: true, update: false, delete: false },
    { module: 'news', create: false, read: true, update: false, delete: false },
    { module: 'finance', create: true, read: true, update: true, delete: false },
  ],
  supervisor: [
    { module: 'dashboard', create: false, read: true, update: false, delete: false },
    { module: 'inventory', create: false, read: true, update: true, delete: false },
    { module: 'workforce', create: false, read: true, update: true, delete: false },
    { module: 'livestock', create: false, read: true, update: true, delete: false },
    { module: 'crops', create: false, read: true, update: true, delete: false },
    { module: 'fuel', create: false, read: true, update: true, delete: false },
    { module: 'vehicles', create: false, read: true, update: false, delete: false },
    { module: 'cctv', create: false, read: true, update: false, delete: false },
    { module: 'gps', create: false, read: true, update: false, delete: false },
    { module: 'vendors', create: false, read: true, update: false, delete: false },
    { module: 'whatsapp', create: false, read: true, update: false, delete: false },
    { module: 'ai', create: false, read: true, update: false, delete: false },
    { module: 'news', create: false, read: true, update: false, delete: false },
    { module: 'finance', create: false, read: true, update: false, delete: false },
  ],
};