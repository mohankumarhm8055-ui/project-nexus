import { motion } from 'framer-motion';
import { AreaChart, Area, RadialBarChart, RadialBar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
  ClipboardList, TrendingUp, Brain, Briefcase, Bell, Zap,
  AlertTriangle, CheckCircle, Clock, ArrowRight, Sparkles
} from 'lucide-react';
import { StatCard, Card, SectionHeader, ProgressBar } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { mockSubjects, mockNotifications, cgpaHistory, skillData } from '../../utils/mockData';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const placementReadiness = [
  { name: 'Readiness', value: 78, fill: '#4F46E5' },
];

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const shortageSubjects = mockSubjects.filter(s => s.attendancePercent < 75);
  const overallAttendance = Math.round(mockSubjects.reduce((acc, s) => acc + s.attendancePercent, 0) / mockSubjects.length);

  return (
    <PageTransition>
      <SectionHeader
        title={`Good evening, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Here's your academic snapshot for today"
        action={
          <button onClick={() => navigate('/student/ai')} className="nexus-btn-primary flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4" />
            Ask AI Assistant
          </button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={TrendingUp} label="Current CGPA" value="8.55" sub="Top 12% of batch" trend="up" trendValue="0.1" iconColor="text-indigo-400" delay={0} />
        <StatCard icon={ClipboardList} label="Attendance" value={`${overallAttendance}%`} sub="Across 6 subjects" trend="up" trendValue="3%" iconColor="text-cyan-400" delay={0.05} />
        <StatCard icon={Briefcase} label="Placement Score" value="78/100" sub="Google eligible ✓" trend="up" trendValue="5" iconColor="text-violet-400" delay={0.1} />
        <StatCard icon={Bell} label="Notifications" value="2" sub="Require attention" trend="neutral" iconColor="text-amber-400" delay={0.15} />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* CGPA Chart */}
        <Card className="lg:col-span-2" delay={0.1}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">CGPA Progression</h3>
              <p className="text-slate-500 text-xs mt-0.5">Semester-wise performance</p>
            </div>
            <span className="badge-blue">Semester 1–6</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={cgpaHistory}>
              <defs>
                <linearGradient id="cgpaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="sgpaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2A4A" vertical={false} />
              <XAxis dataKey="semester" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[7, 10]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0E1228', border: '1px solid #1E2A4A', borderRadius: '12px', color: '#F8FAFC', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="cgpa" stroke="#4F46E5" strokeWidth={2.5} fill="url(#cgpaGrad)" name="CGPA" dot={{ fill: '#4F46E5', r: 4 }} />
              <Area type="monotone" dataKey="sgpa" stroke="#06B6D4" strokeWidth={2} fill="url(#sgpaGrad)" name="SGPA" strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-indigo-500 rounded" /><span className="text-xs text-slate-500">CGPA</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-px bg-cyan-500 rounded border-t-2 border-dashed border-cyan-500" /><span className="text-xs text-slate-500">SGPA</span></div>
          </div>
        </Card>

        {/* Placement Readiness */}
        <Card delay={0.15}>
          <h3 className="text-white font-semibold mb-1">Placement Readiness</h3>
          <p className="text-slate-500 text-xs mb-4">AI-calculated score</p>
          <div className="relative">
            <ResponsiveContainer width="100%" height={140}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="90%" data={placementReadiness} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-white">78</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
          </div>
          <div className="space-y-2 mt-2">
            {[
              { label: 'Problem Solving', val: 85, color: 'from-indigo-600 to-indigo-400' },
              { label: 'Communication', val: 62, color: 'from-cyan-600 to-cyan-400' },
              { label: 'System Design', val: 54, color: 'from-violet-600 to-violet-400' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{item.label}</span>
                  <span>{item.val}%</span>
                </div>
                <ProgressBar value={item.val} color={`bg-gradient-to-r ${item.color}`} />
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/student/placement')} className="w-full mt-4 nexus-btn-ghost text-sm flex items-center justify-center gap-2">
            View Full Report <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Card>

        {/* Subject Attendance */}
        <Card delay={0.2}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Attendance</h3>
            {shortageSubjects.length > 0 && (
              <span className="badge-yellow"><AlertTriangle className="w-3 h-3" />{shortageSubjects.length} shortage</span>
            )}
          </div>
          <div className="space-y-3">
            {mockSubjects.map(subject => (
              <div key={subject.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-300 truncate max-w-[60%]">{subject.name}</span>
                  <span className={`text-xs font-semibold ${
                    subject.attendancePercent >= 85 ? 'text-emerald-400' :
                    subject.attendancePercent >= 75 ? 'text-amber-400' : 'text-red-400'
                  }`}>{subject.attendancePercent}%</span>
                </div>
                <ProgressBar
                  value={subject.attendancePercent}
                  color={
                    subject.attendancePercent >= 85 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
                    subject.attendancePercent >= 75 ? 'bg-gradient-to-r from-amber-600 to-amber-400' :
                    'bg-gradient-to-r from-red-600 to-red-400'
                  }
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Skills */}
        <Card delay={0.25}>
          <h3 className="text-white font-semibold mb-4">Skill Progression</h3>
          <div className="space-y-3">
            {skillData.map(item => (
              <div key={item.skill}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{item.skill}</span>
                  <span className="text-slate-500">{item.level}%</span>
                </div>
                <ProgressBar value={item.level} height="h-2" color="bg-gradient-to-r from-indigo-600 to-cyan-500" />
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/student/skills')} className="w-full mt-4 nexus-btn-ghost text-sm flex items-center justify-center gap-2">
            Skill Roadmap <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Card>

        {/* Notifications */}
        <Card delay={0.3}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent Activity</h3>
            <span className="badge-blue">5 items</span>
          </div>
          <div className="space-y-3">
            {mockNotifications.slice(0, 4).map(notif => (
              <div key={notif.id} className={`flex gap-3 p-3 rounded-xl transition-colors ${!notif.read ? 'bg-white/5' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  notif.type === 'warning' ? 'bg-amber-500/15 text-amber-400' :
                  notif.type === 'success' ? 'bg-emerald-500/15 text-emerald-400' :
                  notif.type === 'error' ? 'bg-red-500/15 text-red-400' :
                  'bg-indigo-500/15 text-indigo-400'
                }`}>
                  {notif.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                   notif.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                   <Bell className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium leading-tight">{notif.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{notif.message}</p>
                  <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />{notif.time}</p>
                </div>
                {!notif.read && <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1" />}
              </div>
            ))}
          </div>
        </Card>

        {/* Quick AI CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="lg:col-span-3 relative overflow-hidden rounded-2xl"
          style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.25) 0%, rgba(6,182,212,0.15) 100%)', border: '1px solid rgba(79,70,229,0.3)' }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="p-6 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center ai-glow">
                <Brain className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Your AI Study Assistant is ready</h3>
                <p className="text-slate-400 text-sm">Ask anything — concepts, doubt solving, quiz generation, study plans</p>
              </div>
            </div>
            <button onClick={() => navigate('/student/ai')} className="nexus-btn-primary flex items-center gap-2 flex-shrink-0">
              <Zap className="w-4 h-4" />
              Open AI Chat
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
