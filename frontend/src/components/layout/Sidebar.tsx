import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, ClipboardList, BarChart3, Brain, Briefcase, Code2,
  Users, Building2, TrendingUp, Settings, LogOut, GraduationCap, Bell,
  Target, FileText, Cpu, ChevronRight, Calendar, Award,
  AlertTriangle, MessageSquare, Send, Heart
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types';
import clsx from 'clsx';

interface SidebarSection {
  label: string;
  links: { to: string; icon: React.ElementType; label: string }[];
}

const navConfig: Record<UserRole, SidebarSection[]> = {
  student: [
    {
      label: 'Overview',
      links: [
        { to: '/student', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/student/attendance', icon: ClipboardList, label: 'Attendance' },
        { to: '/student/marks', icon: BarChart3, label: 'Marks & CGPA' },
        { to: '/student/timetable', icon: Calendar, label: 'Timetable' },
      ],
    },
    {
      label: 'AI & Learning',
      links: [
        { to: '/student/ai', icon: Brain, label: 'AI Assistant' },
        { to: '/student/skills', icon: Code2, label: 'Skills' },
      ],
    },
    {
      label: 'Career',
      links: [
        { to: '/student/placement', icon: Briefcase, label: 'Placement' },
        { to: '/student/resume', icon: FileText, label: 'Resume Builder' },
      ],
    },
  ],
  faculty: [
    {
      label: 'Overview',
      links: [
        { to: '/faculty', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/faculty/attendance', icon: ClipboardList, label: 'Attendance' },
        { to: '/faculty/marks', icon: BarChart3, label: 'Marks Entry' },
        { to: '/faculty/timetable', icon: Calendar, label: 'Timetable' },
      ],
    },
    {
      label: 'AI Tools',
      links: [
        { to: '/faculty/ai-tools', icon: Cpu, label: 'AI Tools' },
        { to: '/faculty/analytics', icon: TrendingUp, label: 'Analytics' },
      ],
    },
  ],
  placement: [
    {
      label: 'Overview',
      links: [
        { to: '/placement', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/placement/companies', icon: Building2, label: 'Companies' },
        { to: '/placement/students', icon: Users, label: 'Students' },
      ],
    },
    {
      label: 'Insights',
      links: [
        { to: '/placement/analytics', icon: TrendingUp, label: 'Analytics' },
        { to: '/placement/drives', icon: Target, label: 'Drive Schedule' },
      ],
    },
  ],
  admin: [
    {
      label: 'Overview',
      links: [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/users', icon: Users, label: 'User Management' },
        { to: '/admin/departments', icon: BookOpen, label: 'Departments' },
      ],
    },
    {
      label: 'Reports',
      links: [
        { to: '/admin/analytics', icon: TrendingUp, label: 'Analytics' },
        { to: '/admin/reports', icon: Award, label: 'Reports' },
      ],
    },
    {
      label: 'System',
      links: [
        { to: '/admin/settings', icon: Settings, label: 'Settings' },
      ],
    },
  ],
  hod: [
    {
      label: 'Command Center',
      links: [
        { to: '/hod', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/hod/risk', icon: AlertTriangle, label: 'Risk Monitor' },
        { to: '/hod/analytics', icon: BarChart3, label: 'Student Analytics' },
      ],
    },
    {
      label: 'Actions',
      links: [
        { to: '/hod/communication', icon: MessageSquare, label: 'Communication' },
        { to: '/hod/reports', icon: FileText, label: 'Reports' },
      ],
    },
  ],
  parent: [
    {
      label: 'My Child',
      links: [
        { to: '/parent', icon: LayoutDashboard, label: 'Overview' },
        { to: '/parent/attendance', icon: Calendar, label: 'Attendance' },
        { to: '/parent/performance', icon: TrendingUp, label: 'Performance' },
      ],
    },
    {
      label: 'Communication',
      links: [
        { to: '/parent/messages', icon: Bell, label: 'Messages' },
      ],
    },
  ],
};

const roleColors: Record<UserRole, string> = {
  student: 'from-indigo-600 to-cyan-500',
  faculty: 'from-violet-600 to-indigo-500',
  placement: 'from-emerald-600 to-cyan-500',
  admin: 'from-orange-500 to-red-500',
  hod: 'from-teal-600 to-emerald-500',
  parent: 'from-rose-600 to-pink-500',
};

const roleLabels: Record<UserRole, string> = {
  student: 'Student',
  faculty: 'Faculty',
  placement: 'Placement Officer',
  admin: 'Administrator',
  hod: 'Head of Department',
  parent: 'Parent',
};

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return null;

  const sections = navConfig[user.role];
  const colorGradient = roleColors[user.role];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const RoleIcon = user.role === 'parent' ? Heart : user.role === 'hod' ? Send : GraduationCap;

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-screen w-64 glass border-r border-white/5 flex flex-col z-30"
    >
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colorGradient} flex items-center justify-center shadow-glow-indigo`}>
            <RoleIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight">Nexus</span>
            <span className="text-gradient font-bold text-base tracking-tight"> Intellect</span>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorGradient} flex items-center justify-center text-white font-bold text-sm shadow-glow-indigo flex-shrink-0`}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user.name}</p>
            <p className="text-slate-500 text-xs truncate">{roleLabels[user.role]}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="text-xs text-slate-600 font-semibold uppercase tracking-widest mb-2 px-2">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.links.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to.split('/').length <= 2}
                  className={({ isActive }) =>
                    clsx('sidebar-link', { active: isActive })
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{label}</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Notifications & Logout */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <NavLink to={`/${user.role}/notifications`} className={({ isActive }) => clsx('sidebar-link', { active: isActive })}>
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
          <span className="ml-auto w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">2</span>
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.aside>
  );
}
