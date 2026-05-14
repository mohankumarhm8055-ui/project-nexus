import { motion } from 'framer-motion';
import { Users, BookOpen, Building2, TrendingUp, Shield, Settings, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, SectionHeader, StatCard } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { departmentPlacementData } from '../../utils/mockData';

const systemActivity = [
  { time: '8AM', students: 340, faculty: 45 },
  { time: '10AM', students: 980, faculty: 89 },
  { time: '12PM', students: 720, faculty: 76 },
  { time: '2PM', students: 1100, faculty: 92 },
  { time: '4PM', students: 860, faculty: 68 },
  { time: '6PM', students: 420, faculty: 32 },
];

const recentActivity = [
  { action: 'New student registered', user: 'CS24B089 — Kiran Menon', time: '2 min ago', type: 'info' },
  { action: 'Attendance marked', user: 'Dr. Priya Nair — CS301', time: '15 min ago', type: 'success' },
  { action: 'Placement drive added', user: 'Google — SWE Role', time: '1 hour ago', type: 'success' },
  { action: 'Faculty login anomaly', user: 'EEE Dept — Unusual IP', time: '2 hours ago', type: 'warning' },
  { action: 'System backup completed', user: 'Automated — DB Snapshot', time: '6 hours ago', type: 'success' },
];

export default function AdminDashboard() {
  return (
    <PageTransition>
      <SectionHeader
        title="Admin Control Center"
        subtitle="System-wide analytics and institutional management"
        action={
          <button className="nexus-btn-primary text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" />
            System Settings
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Users" value="2,847" sub="Active this month" trend="up" trendValue="124" iconColor="text-indigo-400" />
        <StatCard icon={BookOpen} label="Departments" value="8" sub="All operational" iconColor="text-cyan-400" delay={0.05} />
        <StatCard icon={Building2} label="Placement Rate" value="68.5%" trend="up" trendValue="5.2%" iconColor="text-emerald-400" delay={0.1} />
        <StatCard icon={Activity} label="System Uptime" value="99.98%" sub="Last 30 days" iconColor="text-violet-400" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* System activity */}
        <Card delay={0.2} className="lg:col-span-2">
          <h3 className="text-white font-semibold mb-4">Daily Active Users</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={systemActivity}>
              <defs>
                <linearGradient id="studGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="facGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2A4A" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0E1228', border: '1px solid #1E2A4A', borderRadius: '12px', color: '#F8FAFC', fontSize: 12 }} />
              <Area type="monotone" dataKey="students" stroke="#4F46E5" strokeWidth={2} fill="url(#studGrad)" name="Students" />
              <Area type="monotone" dataKey="faculty" stroke="#06B6D4" strokeWidth={2} fill="url(#facGrad)" name="Faculty" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* System health */}
        <Card delay={0.25}>
          <h3 className="text-white font-semibold mb-4">System Health</h3>
          <div className="space-y-4">
            {[
              { label: 'API Response Time', val: '94ms', status: 'good' },
              { label: 'Database Load', val: '23%', status: 'good' },
              { label: 'Storage Used', val: '61%', status: 'warn' },
              { label: 'Cache Hit Rate', val: '98.2%', status: 'good' },
              { label: 'Error Rate', val: '0.02%', status: 'good' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/3 last:border-0">
                <span className="text-xs text-slate-400">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{item.val}</span>
                  <div className={`w-2 h-2 rounded-full ${item.status === 'good' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* User breakdown */}
        <Card delay={0.3}>
          <h3 className="text-white font-semibold mb-4">User Distribution</h3>
          <div className="space-y-3">
            {[
              { role: 'Students', count: 2640, total: 2847, color: 'from-indigo-600 to-indigo-400' },
              { role: 'Faculty', count: 148, total: 2847, color: 'from-violet-600 to-violet-400' },
              { role: 'Placement Officers', count: 12, total: 2847, color: 'from-emerald-600 to-emerald-400' },
              { role: 'Administrators', count: 47, total: 2847, color: 'from-orange-600 to-orange-400' },
            ].map(item => (
              <div key={item.role}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{item.role}</span>
                  <span className="text-slate-500">{item.count.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-nexus-border overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / item.total) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Department placement */}
        <Card delay={0.35}>
          <h3 className="text-white font-semibold mb-4">Placement by Department</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={departmentPlacementData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="dept" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: '#0E1228', border: '1px solid #1E2A4A', borderRadius: '12px', color: '#F8FAFC', fontSize: 12 }}
                formatter={(val) => [`${val}%`, 'Placement Rate']} />
              <Bar dataKey="percent" fill="url(#adminDeptGrad)" radius={[0, 4, 4, 0]} name="%" />
              <defs>
                <linearGradient id="adminDeptGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Audit log */}
        <Card delay={0.4}>
          <h3 className="text-white font-semibold mb-4">Audit Log</h3>
          <div className="space-y-3">
            {recentActivity.map((log, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.05 }}
                className="flex gap-3 py-2 border-b border-white/3 last:border-0">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  log.type === 'success' ? 'bg-emerald-500/15 text-emerald-400' :
                  log.type === 'warning' ? 'bg-amber-500/15 text-amber-400' :
                  'bg-indigo-500/15 text-indigo-400'
                }`}>
                  {log.type === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> :
                   log.type === 'warning' ? <AlertCircle className="w-3.5 h-3.5" /> :
                   <Activity className="w-3.5 h-3.5" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-300 font-medium">{log.action}</p>
                  <p className="text-xs text-slate-600 truncate">{log.user}</p>
                  <p className="text-xs text-slate-700">{log.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
