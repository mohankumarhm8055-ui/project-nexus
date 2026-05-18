import { motion } from 'framer-motion';
import { Users, ClipboardList, BarChart3, Brain, AlertTriangle, CheckCircle, TrendingDown, Wifi, WifiOff, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, SectionHeader, StatCard } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useFacultyProfile, useWeakStudents } from '../../hooks/useApiData';

const weeklyAttendance = [
  { day: 'Mon', rate: 91 }, { day: 'Tue', rate: 85 }, { day: 'Wed', rate: 78 },
  { day: 'Thu', rate: 88 }, { day: 'Fri', rate: 72 },
];

export default function FacultyDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: profile, isFromAPI } = useFacultyProfile();
  const { data: atRiskStudents } = useWeakStudents();

  const subjects = profile?.subjects || [];
  const riskStudents = Array.isArray(atRiskStudents)
    ? atRiskStudents.filter((r: { student?: { name: string } }) => r.student).slice(0, 5)
    : [];

  // Build class performance from subjects
  const classPerformance = subjects.slice(0, 4).map((sub: { name: string; code: string }) => ({
    name: sub.code || sub.name?.substring(0, 8),
    avgAttendance: Math.floor(Math.random() * 20 + 70),
    avgMarks: Math.floor(Math.random() * 20 + 65),
  }));

  return (
    <PageTransition>
      <SectionHeader
        title={`Welcome, ${profile?.name || user?.name} 👋`}
        subtitle={`${profile?.designation || 'Faculty'} — ${profile?.department?.name || user?.department || 'Department'}`}
        action={
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full ${isFromAPI ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
              {isFromAPI ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isFromAPI ? 'Live Data' : 'Demo Mode'}
            </span>
            <button onClick={() => navigate('/faculty/ai-tools')} className="nexus-btn-primary text-sm flex items-center gap-2">
              <Brain className="w-4 h-4" /> AI Tools
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users}         label="My Subjects"       value={subjects.length || '—'}  sub="Assigned this semester"  iconColor="text-indigo-400" />
        <StatCard icon={ClipboardList} label="Avg Attendance"    value="82%"   trend="down" trendValue="3%"   iconColor="text-cyan-400"    delay={0.05} />
        <StatCard icon={BarChart3}     label="Avg Internal Marks" value="77.5%" trend="up"   trendValue="2%"  iconColor="text-violet-400"  delay={0.1} />
        <StatCard icon={AlertTriangle} label="At-Risk Students"  value={riskStudents.length}    sub="Need intervention"        iconColor="text-amber-400"   delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Class performance */}
        <Card delay={0.2} className="lg:col-span-2">
          <h3 className="text-white font-semibold mb-4">Subject Performance Overview</h3>
          {classPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={classPerformance} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2A4A" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0E1228', border: '1px solid #1E2A4A', borderRadius: '12px', color: '#F8FAFC', fontSize: 12 }} />
                <Bar dataKey="avgAttendance" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Avg Attendance %" />
                <Bar dataKey="avgMarks"      fill="#06B6D4" radius={[4, 4, 0, 0]} name="Avg Marks %" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-600 text-sm">No subjects assigned yet</div>
          )}
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2"><div className="w-3 h-2 rounded bg-indigo-500" /><span className="text-xs text-slate-500">Attendance</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-2 rounded bg-cyan-500" /><span className="text-xs text-slate-500">Marks</span></div>
          </div>
        </Card>

        {/* Weekly attendance */}
        <Card delay={0.25}>
          <h3 className="text-white font-semibold mb-4">Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={weeklyAttendance}>
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0E1228', border: '1px solid #1E2A4A', borderRadius: '12px', color: '#F8FAFC', fontSize: 12 }} />
              <Line type="monotone" dataKey="rate" stroke="#8B5CF6" strokeWidth={2.5} dot={{ fill: '#8B5CF6', r: 4 }} name="Rate %" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 glass rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">Friday dip detected</span>
            <span className="badge-yellow text-xs"><TrendingDown className="w-3 h-3" />-13%</span>
          </div>
        </Card>

        {/* My Subjects — REAL */}
        <Card delay={0.3}>
          <h3 className="text-white font-semibold mb-4">My Assigned Subjects</h3>
          <div className="space-y-2">
            {subjects.length === 0 && <p className="text-slate-500 text-xs text-center py-6">No subjects assigned</p>}
            {subjects.map((sub: { _id?: string; name: string; code: string; semester?: number; credits?: number }, i: number) => (
              <div key={sub._id || i} className="flex items-center justify-between p-3 glass rounded-xl">
                <div>
                  <p className="text-sm text-white font-medium">{sub.name}</p>
                  <p className="text-xs text-slate-500">{sub.code} · Sem {sub.semester} · {sub.credits} Credits</p>
                </div>
                <span className="badge-blue text-xs">Active</span>
              </div>
            ))}
          </div>
        </Card>

        {/* At-risk students — REAL */}
        <Card delay={0.3} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">AI-Identified Risk Students</h3>
            <span className="badge-yellow"><AlertTriangle className="w-3 h-3" />AI Alert</span>
          </div>
          <div className="space-y-3">
            {riskStudents.length === 0 && <p className="text-slate-500 text-sm text-center py-6">No at-risk students 🎉</p>}
            {riskStudents.map((r: { student?: { name: string; usn?: string }; riskScore?: number; riskLevel?: string; attendanceTrend?: { current?: number } }, i: number) => {
              const s = r.student;
              if (!s) return null;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-center justify-between p-3 glass rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${r.riskLevel === 'critical' || r.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {s.name[0]}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{s.name}</p>
                      <p className="text-slate-500 text-xs">{s.usn}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-center">
                      <p className={`font-semibold ${(r.attendanceTrend?.current ?? 100) < 70 ? 'text-red-400' : 'text-amber-400'}`}>
                        {r.attendanceTrend?.current?.toFixed(0) ?? '—'}%
                      </p>
                      <p className="text-slate-600">Attend.</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-amber-400">{r.riskScore ?? 0}</p>
                      <p className="text-slate-600">Risk</p>
                    </div>
                    <span className={r.riskLevel === 'critical' || r.riskLevel === 'high' ? 'badge-red' : 'badge-yellow'}>{r.riskLevel}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Quick actions */}
        <Card delay={0.35}>
          <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Mark Attendance', icon: ClipboardList, color: 'text-indigo-400', to: '/faculty/attendance' },
              { label: 'Enter Marks',     icon: BarChart3,     color: 'text-cyan-400',   to: '/faculty/marks' },
              { label: 'Generate Quiz',  icon: Brain,          color: 'text-violet-400', to: '/faculty/ai-tools' },
              { label: 'View Analytics', icon: CheckCircle,    color: 'text-emerald-400',to: '/faculty/analytics' },
            ].map(action => (
              <button key={action.label} onClick={() => navigate(action.to)}
                className="w-full flex items-center justify-between p-3 glass rounded-xl hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all text-left group">
                <div className="flex items-center gap-3">
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                  <span className="text-sm text-slate-300">{action.label}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
