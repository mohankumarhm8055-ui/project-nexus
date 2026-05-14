import { motion } from 'framer-motion';
import { Users, ClipboardList, BarChart3, Brain, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, SectionHeader, StatCard } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { useAuthStore } from '../../store/authStore';

const classPerformance = [
  { name: 'CS301-A', avgAttendance: 82, avgMarks: 78, students: 60 },
  { name: 'CS301-B', avgAttendance: 76, avgMarks: 71, students: 58 },
  { name: 'CS305-A', avgAttendance: 88, avgMarks: 84, students: 55 },
];

const riskStudents = [
  { name: 'Kiran Patel', rollNo: 'CS21B034', attendance: 62, marks: 28, risk: 'high' },
  { name: 'Ananya Shetty', rollNo: 'CS21B019', attendance: 71, marks: 34, risk: 'medium' },
  { name: 'Rohan Joshi', rollNo: 'CS21B051', attendance: 68, marks: 31, risk: 'high' },
];

const weeklyAttendance = [
  { day: 'Mon', rate: 91 }, { day: 'Tue', rate: 85 }, { day: 'Wed', rate: 78 },
  { day: 'Thu', rate: 88 }, { day: 'Fri', rate: 72 },
];

export default function FacultyDashboard() {
  const { user } = useAuthStore();

  return (
    <PageTransition>
      <SectionHeader
        title={`Welcome, ${user?.name} 👋`}
        subtitle="Your class performance overview for today"
        action={
          <button className="nexus-btn-primary text-sm flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Tools
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Students" value={173} sub="Across 3 classes" iconColor="text-indigo-400" />
        <StatCard icon={ClipboardList} label="Avg Attendance" value="82%" trend="down" trendValue="3%" iconColor="text-cyan-400" delay={0.05} />
        <StatCard icon={BarChart3} label="Avg Internal Marks" value="77.5%" trend="up" trendValue="2%" iconColor="text-violet-400" delay={0.1} />
        <StatCard icon={AlertTriangle} label="At-Risk Students" value={riskStudents.length} sub="Require intervention" iconColor="text-amber-400" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Class performance */}
        <Card delay={0.2} className="lg:col-span-2">
          <h3 className="text-white font-semibold mb-4">Class Performance Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={classPerformance} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2A4A" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0E1228', border: '1px solid #1E2A4A', borderRadius: '12px', color: '#F8FAFC', fontSize: 12 }} />
              <Bar dataKey="avgAttendance" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Avg Attendance %" />
              <Bar dataKey="avgMarks" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Avg Marks %" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2"><div className="w-3 h-2 rounded bg-indigo-500" /><span className="text-xs text-slate-500">Attendance</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-2 rounded bg-cyan-500" /><span className="text-xs text-slate-500">Marks</span></div>
          </div>
        </Card>

        {/* Weekly attendance */}
        <Card delay={0.25}>
          <h3 className="text-white font-semibold mb-4">Weekly Attendance</h3>
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

        {/* At-risk students */}
        <Card delay={0.3} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">AI-Identified Risk Students</h3>
            <span className="badge-yellow"><AlertTriangle className="w-3 h-3" />AI Alert</span>
          </div>
          <div className="space-y-3">
            {riskStudents.map((student, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-center justify-between p-3 glass rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                    student.risk === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>{student.name[0]}</div>
                  <div>
                    <p className="text-white text-sm font-medium">{student.name}</p>
                    <p className="text-slate-500 text-xs">{student.rollNo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="text-center">
                    <p className={`font-semibold ${student.attendance < 70 ? 'text-red-400' : 'text-amber-400'}`}>{student.attendance}%</p>
                    <p className="text-slate-600">Attendance</p>
                  </div>
                  <div className="text-center">
                    <p className={`font-semibold ${student.marks < 30 ? 'text-red-400' : 'text-amber-400'}`}>{student.marks}/50</p>
                    <p className="text-slate-600">Internal</p>
                  </div>
                  <span className={student.risk === 'high' ? 'badge-red' : 'badge-yellow'}>{student.risk} risk</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Quick actions */}
        <Card delay={0.35}>
          <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Mark Attendance', icon: ClipboardList, color: 'text-indigo-400', to: '/faculty/attendance' },
              { label: 'Enter Marks', icon: BarChart3, color: 'text-cyan-400', to: '/faculty/marks' },
              { label: 'Generate Quiz', icon: Brain, color: 'text-violet-400', to: '/faculty/ai-tools' },
              { label: 'View Analytics', icon: CheckCircle, color: 'text-emerald-400', to: '/faculty/analytics' },
            ].map(action => (
              <button key={action.label} className="w-full flex items-center gap-3 p-3 glass rounded-xl hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all text-left">
                <action.icon className={`w-4 h-4 ${action.color}`} />
                <span className="text-sm text-slate-300">{action.label}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
