import { create } from 'zustand';
import type { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const mockUsers: Record<UserRole, User> = {
  student: {
    id: '1',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@nexus.edu',
    role: 'student',
    department: 'Computer Science Engineering',
    year: 3,
    rollNumber: 'CS21B047',
  },
  faculty: {
    id: '2',
    name: 'Dr. Priya Nair',
    email: 'priya.nair@nexus.edu',
    role: 'faculty',
    department: 'Computer Science Engineering',
    employeeId: 'FAC2019034',
  },
  placement: {
    id: '3',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@nexus.edu',
    role: 'placement',
    department: 'Training & Placement Cell',
    employeeId: 'PLC2017011',
  },
  admin: {
    id: '4',
    name: 'Dr. Meena Iyer',
    email: 'meena.iyer@nexus.edu',
    role: 'admin',
    department: 'Administration',
    employeeId: 'ADM2015001',
  },
  hod: {
    id: '5',
    name: 'Dr. Ramesh Babu',
    email: 'ramesh.babu@nexus.edu',
    role: 'hod',
    department: 'Computer Science Engineering',
    employeeId: 'HOD2016001',
  },
  parent: {
    id: '6',
    name: 'Mr. Suresh Sharma',
    email: 'suresh.sharma@gmail.com',
    role: 'parent',
    department: 'Parent — CSE Dept.',
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (role: UserRole) => {
    set({ user: mockUsers[role], isAuthenticated: true });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
