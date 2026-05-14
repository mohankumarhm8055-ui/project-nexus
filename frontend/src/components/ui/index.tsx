import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  iconColor?: string;
  delay?: number;
}

export function StatCard({ icon: Icon, label, value, sub, trend, trendValue, iconColor = 'text-indigo-400', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="stat-card group"
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5" />
        </div>
        {trendValue && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
            trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' :
            trend === 'down' ? 'text-red-400 bg-red-400/10' :
            'text-slate-400 bg-slate-400/10'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '–'} {trendValue}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-400">{label}</p>
        {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function Card({ children, className = '', delay = 0, hover = true }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`nexus-card ${hover ? 'hover:shadow-glass' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
  height?: string;
}

export function ProgressBar({ value, max = 100, color = 'bg-gradient-to-r from-indigo-600 to-cyan-500', showLabel = false, height = 'h-1.5' }: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 ${height} rounded-full bg-nexus-border overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      {showLabel && <span className="text-xs text-slate-400 w-8 text-right">{Math.round(percent)}%</span>}
    </div>
  );
}
