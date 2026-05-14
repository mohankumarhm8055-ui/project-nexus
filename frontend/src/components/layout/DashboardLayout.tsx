import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-nexus-bg flex">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(79,70,229,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6,182,212,0.06) 0%, transparent 50%)',
        }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <Sidebar />

      {/* Main content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <motion.header
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="sticky top-0 z-20 glass border-b border-white/5 px-6 py-3 flex items-center gap-4"
        >
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Notification bell */}
            <button className="relative w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 rounded-full text-white text-[10px] font-bold flex items-center justify-center">2</span>
            </button>

            {/* AI status indicator */}
            <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
              <span className="text-xs text-emerald-400 font-medium">AI Online</span>
            </div>

            {/* Avatar */}
            {user && (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-glow-indigo">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            )}
          </div>
        </motion.header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
