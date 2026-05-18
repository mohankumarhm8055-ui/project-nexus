import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '../types';
import { authAPI } from '../services/apiServices';
import { tokenStorage } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Real API login
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  // Mock login (dev fallback — works without backend)
  login: (role: UserRole) => void;
  logout: () => void;
  clearError: () => void;
}

const mockUsers: Record<UserRole, User> = {
  student: {
    id: '1', name: 'Arjun Sharma', email: 'arjun.sharma@nexus.edu',
    role: 'student', department: 'Computer Science Engineering', year: 3, rollNumber: 'CS21B047',
  },
  faculty: {
    id: '2', name: 'Dr. Priya Nair', email: 'priya.nair@nexus.edu',
    role: 'faculty', department: 'Computer Science Engineering', employeeId: 'FAC001',
  },
  placement: {
    id: '3', name: 'Rajesh Kumar', email: 'placement@nexus.edu',
    role: 'placement', department: 'Training & Placement Cell', employeeId: 'PLC001',
  },
  admin: {
    id: '4', name: 'Dr. Meena Iyer', email: 'admin@nexus.edu',
    role: 'admin', department: 'Administration', employeeId: 'ADM001',
  },
  hod: {
    id: '5', name: 'Dr. Ramesh Babu', email: 'hod.cse@nexus.edu',
    role: 'hod', department: 'Computer Science Engineering', employeeId: 'HOD001',
  },
  parent: {
    id: '6', name: 'Mr. Suresh Sharma', email: 'suresh.sharma@gmail.com',
    role: 'parent', department: 'Parent — CSE Dept.',
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ── Real API login ─────────────────────────────────────────────────
      loginWithCredentials: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authAPI.login({ email, password });
          const { accessToken, refreshToken, user } = res.data;

          tokenStorage.set(accessToken, refreshToken);

          // Map API user to frontend User type
          const mappedUser: User = {
            id: user._id || user.id,
            name: user.name,
            email: user.email,
            role: user.role as UserRole,
            department: user.department?.name || user.department,
            employeeId: user.identifier,
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

      // ── Mock login (works without backend) ─────────────────────────────
      login: (role: UserRole) => {
        set({ user: mockUsers[role], isAuthenticated: true, error: null });
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
