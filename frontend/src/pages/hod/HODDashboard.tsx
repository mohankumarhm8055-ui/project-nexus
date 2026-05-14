import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, TrendingUp, Brain, Send, CheckCircle, Clock, BarChart3, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, SectionHeader } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { deptMetrics, hodStudents, facultyStatus, weeklyDeptAttendance } from '../../utils/mockData';

export default function HODDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [broadcastOpen, setBroadcastOpen] = useState(false);

  const highRisk = hodStudents.filter(s => s.riskLevel === 'high');

  return (
    <PageTransition>
      <SectionHeader
        title={`Department Command Center`}
        subtitle={`${user?.department ?? 'Department'} — Academic Monitoring Overview`}
        action={
          <button onClick={() => setBroadcastOpen(true)} className="nexus-btn-teal flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4" /> Emergency Broadcast
          </button>
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Users, label: 'Total Students', value: deptMetrics.totalStudents, sub: `${deptMetrics.activeFaculty} active faculty`, color: 'text-teal-400', bg: 'bg-teal-500/15' },
          { icon: AlertTriangle, label: 'At-Risk Students', value: deptMetrics.atRiskCount, sub: `${deptMetrics.highRiskCount} critical`, color: 'text-red-400', bg: 'bg-red-500/15' },
          { icon: TrendingUp, label: 'Avg Attendance', value: `${deptMetrics.avgAttendance}%`, sub: 'This month', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
          { icon: BarChart3, label: 'Dept Avg CGPA', value: deptMetrics.avgCGPA, sub: 'Semester 6', color: 'text-violet-400', bg: 'bg-violet-500/15' },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="glass rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{item.value}</p>
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="text-xs text-slate-600 mt-0.5">{item.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Attendance Trend */}
        <Card delay={0.1} className="lg:col-span-2">
          <h3 className="text-white font-semibold mb-4">Weekly Department Attendance</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyDeptAttendance}>
              <defs>
                <linearGradient id="deptGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2A4A" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0E1228', border: '1px solid #1E2A4A', borderRadius: '12px', color: '#F8FAFC', fontSize: 12 }} />
              <Area type="monotone" dataKey="rate" stroke="#14B8A6" strokeWidth={2.5} fill="url(#deptGrad)" name="Attendance %" dot={{ fill: '#14B8A6', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* AI Risk Summary */}
        <Card delay={0.15}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
              <Brain className="w-4 h-4 text-red-400" />
            </div>
            <h3 className="text-white font-semibold">AI Risk Summary</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-500/8 rounded-xl border border-red-500/20">
              <span className="text-sm text-slate-300">High Risk</span>
              <span className="text-lg font-bold text-red-400">{deptMetrics.highRiskCount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-amber-500/8 rounded-xl border border-amber-500/20">
              <span className="text-sm text-slate-300">Medium Risk</span>
              <span className="text-lg font-bold text-amber-400">{deptMetrics.mediumRiskCount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-500/8 rounded-xl border border-emerald-500/20">
              <span className="text-sm text-slate-300">Pending Reports</span>
              <span className="text-lg font-bold text-emerald-400">{deptMetrics.pendingReports}</span>
            </div>
          </div>
          <button onClick={() => navigate('/hod/risk')} className="w-full mt-4 nexus-btn-teal text-sm">View Risk Monitor →</button>
        </Card>

        {/* Critical Students */}
        <Card delay={0.2} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Critical Students — Immediate Action</h3>
            <span className="risk-high">{highRisk.length} Critical</span>
          </div>
          <div className="space-y-2">
            {highRisk.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
                className="flex items-center justify-between p-3 glass rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm">{s.name[0]}</div>
                  <div>
                    <p className="text-sm text-white font-medium">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.rollNumber} · Year {s.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="text-center">
                    <p className="font-semibold text-red-400">{s.attendance}%</p>
                    <p className="text-slate-600">Attend.</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-amber-400">{s.cgpa}</p>
                    <p className="text-slate-600">CGPA</p>
                  </div>
                  <button className="nexus-btn-teal text-xs px-3 py-1.5 flex items-center gap-1">
                    <Send className="w-3 h-3" /> Alert
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Faculty Submission Status */}
        <Card delay={0.25}>
          <h3 className="text-white font-semibold mb-4">Faculty Submission Status</h3>
          <div className="space-y-2.5">
            {facultyStatus.map(f => (
              <div key={f.id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs text-slate-300 font-medium truncate">{f.name}</p>
                  <p className="text-xs text-slate-600 truncate">{f.subject}</p>
                </div>
                {f.submitted
                  ? <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium flex-shrink-0"><CheckCircle className="w-3.5 h-3.5" />Done</span>
                  : <span className="flex items-center gap-1 text-xs text-amber-400 font-medium flex-shrink-0"><Clock className="w-3.5 h-3.5" />Pending</span>}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Emergency Broadcast Modal */}
      {broadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong rounded-2xl p-6 w-full max-w-md border border-red-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Emergency Broadcast</h3>
                <p className="text-slate-500 text-xs">Sends to all parents, students & faculty</p>
              </div>
            </div>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 resize-none mb-4" rows={4} placeholder="Type your emergency message..." />
            <div className="flex gap-3">
              <button className="flex-1 nexus-btn-ghost text-sm" onClick={() => setBroadcastOpen(false)}>Cancel</button>
              <button className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors" onClick={() => setBroadcastOpen(false)}>🚨 Send Now</button>
            </div>
          </motion.div>
        </div>
      )}
    </PageTransition>
  );
}
