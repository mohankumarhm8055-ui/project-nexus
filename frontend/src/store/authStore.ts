import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '../types';
import { authAPI } from '../services/apiServices';
import { tokenStorage } from '../services/api';

type AuthUserPayload = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  identifier?: string;
  department?: { name?: string } | string;
};

type AuthProfilePayload = {
  _id?: string;
  usn?: string;
  department?: { name?: string } | string;
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const departmentName = (department?: { name?: string } | string) =>
  typeof department === 'string' ? department : department?.name;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      loginWithCredentials: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authAPI.login({ email, password });
          const payload = res.data as {
            token: string;
            refreshToken: string;
            user: AuthUserPayload;
            profile?: AuthProfilePayload | null;
          };

          tokenStorage.set(payload.token, payload.refreshToken);

          const appId = payload.user.role === 'student' && payload.profile?._id
            ? payload.profile._id
            : payload.user._id || payload.user.id || '';

          const mappedUser: User = {
            id: appId,
            name: payload.user.name,
            email: payload.user.email,
            role: payload.user.role,
            department: departmentName(payload.profile?.department) || departmentName(payload.user.department),
            employeeId: payload.user.identifier,
            rollNumber: payload.profile?.usn || payload.user.identifier,
            profileId: payload.profile?._id,
          };

          set({ user: mappedUser, isAuthenticated: true, isLoading: false, error: null });
        } catch (err: unknown) {
          const message =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            'Login failed. Check your credentials.';
          set({ isLoading: false, error: message, isAuthenticated: false });
          throw err;
        }
      },

      logout: () => {
        tokenStorage.clear();
        set({ user: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'nexus-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
