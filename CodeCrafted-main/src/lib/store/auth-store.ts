// src/lib/store/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../data/mock-data';
import { authApi } from '../api/mock-api';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: { name: string; email: string; password: string; role: 'teacher' | 'student' }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(email, password);
          set({ 
            user: response.user, 
            token: response.token,
            isLoading: false 
          });

          // Store the token in cookies so middleware can access it
    Cookies.set('auth-token', response.token, { expires: 7, path: '/' });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to login', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.signup(userData);
          set({ 
            user: response.user, 
            token: response.token,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to sign up', 
            isLoading: false 
          });
          throw error;
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
          set({ user: null, token: null, isLoading: false });
          // Remove auth token from cookies
    Cookies.remove('auth-token');
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to logout', 
            isLoading: false 
          });
        }
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);