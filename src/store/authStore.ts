import { create } from 'zustand';
import { UserRole } from '../types/auth';

interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { firstName: string; lastName: string; email: string }) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    try {
      // In a real application, this would be an API call
      const mockUser: User = {
        id: '1',
        email,
        role: 'admin',
        firstName: 'John',
        lastName: 'Doe',
      };
      set({ user: mockUser, isAuthenticated: true });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  updateProfile: async (data) => {
    try {
      // In a real application, this would be an API call
      set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      }));
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  },
  updatePassword: async (currentPassword: string, newPassword: string) => {
    try {
      // In a real application, this would be an API call
      console.log('Password updated successfully');
    } catch (error) {
      console.error('Password update failed:', error);
      throw error;
    }
  }
}));