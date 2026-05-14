import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Brain, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, SectionHeader, ProgressBar } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { mockSubjects, monthlyAttendanceTrend, parentNotifications } from '../../utils/mockData';

const childInfo = {
  name: 'Arjun Sharma',
  rollNumber: 'CS21B047',
  department: 'Computer Science Engineering',
  year: '3rd Year · Semester 6',
  cgpa: 8.55,
  overallAttendance: 80,
  riskLevel: 'medium' as const,
};

export default function ParentDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const unread = parentNotifications.filter(n => !n.read).length;

  return (
    <PageTransition>
      <SectionHeader
        title={`Welcome, ${user?.name?.split(' ').slice(1).join(' ') ?? 'Parent'} 👨‍👩‍👦`}
        subtitle="Real-time monitoring of your child's academic progress"
      />

      {/* Child Info Hero */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
        style={{ background: 'linear-gradient(135deg,rgba(244,63,94,0.15) 0%,rgba(236,72,153,0.08) 100%)', border: '1px solid rgba(244,63,94,0.2)' }}>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-glow-rose">
          {childInfo.name[0]}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">{childInfo.name}</h2>
          <p className="text-slate-400 text-sm">{childInfo.rollNumber} · {childInfo.department}</p>
          <p className="text-slate-500 text-xs mt-0.5">{childInfo.year}</p>
        </div>
        <div className="flex items-center gap-3">
          {childInfo.riskLevel === 'medium' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/25">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-amber-400">Attendance Alert</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Overall Attendance', value: `${childInfo.overallAttendance}%`, color: 'text-rose-400', bg: 'bg-rose-500/15', trend: '↓ from 88%' },
          { label: 'Current CGPA', value: childInfo.cgpa, color: 'text-pink-400', bg: 'bg-pink-500/15', trend: '↑ from 8.4' },
          { label: 'Subjects at Risk', value: mockSubjects.filter(s => s.attendancePercent < 75).length, color: 'text-amber-400', bg: 'bg-amber-500/15', trend: 'Need attention' },
          { label: 'Unread Alerts', value: unread, color: 'text-indigo-400', bg: 'bg-indigo-500/15', trend: 'From institution' },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
            className="glass rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
              <TrendingUp className={`w-4 h-4 ${item.color}`} />
            </div>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="text-xs text-slate-600 mt-0.5">{item.trend}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Attendance Trend */}
        <Card delay={0.2} className="lg:col-span-2">
          <h3 className="text-white font-semibold mb-4">6-Month Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthlyAttendanceTrend}>
              <defs>
                <linearGradient id="parentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2A4A" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0E1228', border: '1px solid #1E2A4A', borderRadius: '12px', color: '#F8FAFC', fontSize: 12 }} />
              <Area type="monotone" dataKey="percent" stroke="#F43F5E" strokeWidth={2.5} fill="url(#parentGrad)" name="Attendance %" dot={{ fill: '#F43F5E', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {mockSubjects.slice(0, 3).map(s => (
              <div key={s.id} className="glass rounded-xl p-2.5">
                <p className="text-xs text-slate-400 truncate">{s.name.split(' ')[0]}</p>
                <p className={`text-sm font-bold mt-0.5 ${s.attendancePercent < 75 ? 'text-red-400' : s.attendancePercent < 85 ? 'text-amber-400' : 'text-emerald-400'}`}>{s.attendancePercent}%</p>
                <ProgressBar value={s.attendancePercent} height="h-1" color={s.attendancePercent < 75 ? 'bg-red-500' : 'bg-emerald-500'} />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Alerts */}
        <Card delay={0.25}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent Alerts</h3>
            {unread > 0 && <span className="badge-red">{unread} new</span>}
          </div>
          <div className="space-y-2.5">
            {parentNotifications.slice(0, 4).map(n => (
              <div key={n.id} className={`p-3 rounded-xl text-xs ${!n.read ? 'bg-white/5 border border-white/8' : ''}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-slate-200 font-medium leading-snug">{n.title}</p>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0 mt-1" />}
                </div>
                <p className="text-slate-600">{n.time} · {n.from}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/parent/messages')} className="w-full mt-4 nexus-btn-ghost text-sm flex items-center justify-center gap-2">
            All Messages <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Card>

        {/* AI Summary */}
        <Card delay={0.3} className="lg:col-span-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center">
              <Brain className="w-4 h-4 text-rose-400" />
            </div>
            <h3 className="text-white font-semibold">AI Academic Summary</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Arjun is performing well overall with a CGPA of <span className="text-white font-semibold">8.55</span> and is ranked in the <span className="text-emerald-400 font-semibold">top 12%</span> of his batch.
            However, his attendance in <span className="text-red-400 font-semibold">Computer Networks (65%)</span> is below the required 75% threshold — he needs to attend
            the next <span className="text-amber-400 font-semibold">7 consecutive classes</span> to avoid a shortage.
            His placement readiness score is <span className="text-teal-400 font-semibold">78/100</span> and he has applied for the Google drive scheduled June 15.
            <span className="text-slate-500"> — Nexus AI, updated today.</span>
          </p>
        </Card>
      </div>
    </PageTransition>
  );
}
