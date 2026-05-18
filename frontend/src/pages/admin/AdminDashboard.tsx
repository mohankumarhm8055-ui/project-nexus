import { motion } from 'framer-motion';
import { Users, BookOpen, Building2, Settings, AlertCircle, CheckCircle, Activity, Wifi, WifiOff, Shield, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, SectionHeader, StatCard } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { departmentPlacementData } from '../../utils/mockData';
import { useAdminDashboard, useNotifications } from '../../hooks/useApiData';

const systemActivity = [
  { time: '8AM', students: 340, faculty: 45 },
  { time: '10AM', students: 980, faculty: 89 },
  { time: '12PM', students: 720, faculty: 76 },
  { time: '2PM', students: 1100, faculty: 92 },
  { time: '4PM', students: 860, faculty: 68 },
  { time: '6PM', students: 420, faculty: 32 },
];

export default function AdminDashboard() {
  const { data: dash, isFromAPI } = useAdminDashboard();
  const { data: notifData } = useNotifications();

  const recentNotifs = (notifData?.notifications || []).slice(0, 5);

  return (
    <PageTransition>
      <SectionHeader
        title="Admin Control Center"
        subtitle="System-wide analytics and institutional management"
        action={
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full ${isFromAPI ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
              {isFromAPI ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isFromAPI ? 'Live Data' : 'Demo Mode'}
            </span>
            <button className="nexus-btn-primary text-sm flex items-center gap-2">
              <Settings className="w-4 h-4" /> System Settings
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users}      label="Total Users"      value={dash?.totalUsers?.toLocaleString() ?? '—'}    sub="Active accounts"      trend="up" trendValue="12" iconColor="text-indigo-400" />
        <StatCard icon={BookOpen}   label="Total Students"   value={dash?.totalStudents?.toLocaleString() ?? '—'} sub="Enrolled"             iconColor="text-cyan-400"   delay={0.05} />
        <StatCard icon={Building2}  label="Departments"      value={dash?.totalDepts ?? '—'}                      sub="All operational"       iconColor="text-emerald-400" delay={0.1} />
        <StatCard icon={Activity}   label="Activity (24h)"   value={dash?.activityLast24h ?? '—'}                 sub="Actions logged"        trend="up" trendValue="8" iconColor="text-violet-400" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* System activity */}
        <Card delay={0.2} className="lg:col-span-2">
          <h3 className="text-white font-semibold mb-4">Daily Active Users (Estimated)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={systemActivity}>
              <defs>
                <linearGradient id="studGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} /><stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="facGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} /><stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2A4A" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0E1228', border: '1px solid #1E2A4A', borderRadius: '12px', color: '#F8FAFC', fontSize: 12 }} />
              <Area type="monotone" dataKey="students" stroke="#4F46E5" strokeWidth={2} fill="url(#studGrad)" name="Students" />
              <Area type="monotone" dataKey="faculty"  stroke="#06B6D4" strokeWidth={2} fill="url(#facGrad)"  name="Faculty" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* System Health */}
        <Card delay={0.25}>
          <h3 className="text-white font-semibold mb-4">System Health</h3>
          <div className="space-y-4">
            {[
              { label: 'API Response',   val: '< 100ms', status: 'good' },
              { label: 'Database',       val: 'MongoDB ✓', status: 'good' },
              { label: 'Cache (Redis)',  val: 'Mock Mode',  status: 'warn' },
              { label: 'Auth Service',   val: 'JWT Active', status: 'good' },
              { label: 'Notifications', val: 'Dry Run',    status: 'warn' },
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

        {/* User Distribution — REAL */}
        <Card delay={0.3}>
          <h3 className="text-white font-semibold mb-4">User Distribution</h3>
          <div className="space-y-3">
            {[
              { role: 'Students',    count: dash?.totalStudents ?? 0,  total: dash?.totalUsers ?? 1, color: 'from-indigo-600 to-indigo-400' },
              { role: 'Faculty',     count: dash?.totalFaculty  ?? 0,  total: dash?.totalUsers ?? 1, color: 'from-violet-600 to-violet-400' },
              { role: 'At-Risk',     count: dash?.atRiskStudents ?? 0, total: dash?.totalStudents ?? 1, color: 'from-red-600 to-red-400' },
            ].map(item => (
              <div key={item.role}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{item.role}</span>
                  <span className="text-slate-500">{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-nexus-border overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((item.count / item.total) * 100, 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 glass rounded-xl">
            <p className="text-xs text-slate-500">At-Risk Students (AI)</p>
            <p className="text-2xl font-bold text-red-400 mt-1">{dash?.atRiskStudents ?? 0}</p>
          </div>
        </Card>

        {/* Department Placement Chart */}
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
                  <stop offset="0%" stopColor="#4F46E5" /><stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Live Audit Log — REAL */}
        <Card delay={0.4}>
          <h3 className="text-white font-semibold mb-4">Live Audit / Notifications</h3>
          <div className="space-y-3">
            {recentNotifs.length === 0 && (
              <p className="text-slate-500 text-xs text-center py-4">No recent activity</p>
            )}
            {recentNotifs.map((n: { _id?: string; title: string; body?: string; category?: string; isRead?: boolean; createdAt?: string }, i: number) => (
              <motion.div key={n._id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.05 }}
                className="flex gap-3 py-2 border-b border-white/3 last:border-0">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  n.category === 'attendance' ? 'bg-amber-500/15 text-amber-400' :
                  n.category === 'placement'  ? 'bg-emerald-500/15 text-emerald-400' :
                  n.category === 'ai_alert'   ? 'bg-red-500/15 text-red-400' :
                  'bg-indigo-500/15 text-indigo-400'
                }`}>
                  {n.category === 'ai_alert' ? <AlertCircle className="w-3.5 h-3.5" /> :
                   n.category === 'placement' ? <CheckCircle className="w-3.5 h-3.5" /> :
                   n.isRead ? <CheckCircle className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-300 font-medium">{n.title}</p>
                  <p className="text-xs text-slate-600 truncate">{n.body}</p>
                  <p className="text-xs text-slate-700">{n.createdAt ? new Date(n.createdAt).toLocaleTimeString('en-IN') : '—'}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Quick Admin Actions */}
        <Card delay={0.45} className="lg:col-span-3">
          <h3 className="text-white font-semibold mb-4">Quick Admin Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Manage Users',        icon: Users,      color: 'text-indigo-400', to: '/admin/users' },
              { label: 'View Departments',    icon: Building2,  color: 'text-cyan-400',   to: '/admin/departments' },
              { label: 'Audit Logs',          icon: Shield,     color: 'text-amber-400',  to: '/admin/reports' },
              { label: 'System Analytics',    icon: TrendingUp, color: 'text-emerald-400',to: '/admin/analytics' },
            ].map(action => (
              <button key={action.label} className="flex items-center gap-3 p-4 glass rounded-xl hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all text-left">
                <action.icon className={`w-5 h-5 ${action.color}`} />
                <span className="text-sm text-slate-300">{action.label}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
