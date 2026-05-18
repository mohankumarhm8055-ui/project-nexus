import { motion } from 'framer-motion';
import { AreaChart, Area, RadialBarChart, RadialBar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
  ClipboardList, TrendingUp, Brain, Briefcase, Bell, Zap,
  AlertTriangle, CheckCircle, Clock, ArrowRight, Sparkles, Wifi, WifiOff
} from 'lucide-react';
import { StatCard, Card, SectionHeader, ProgressBar } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { cgpaHistory, skillData } from '../../utils/mockData';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useAttendanceSummary, useMarksSummary, useAIAnalytics, useNotifications } from '../../hooks/useApiData';

const placementReadiness = [{ name: 'Readiness', value: 78, fill: '#4F46E5' }];

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: attendanceSummary, isFromAPI: attFromAPI } = useAttendanceSummary();
  const { data: marksSummary, isFromAPI: marksFromAPI } = useMarksSummary();
  const { data: aiData } = useAIAnalytics();
  const { data: notifData } = useNotifications();

  const subjects = attendanceSummary?.subjects || [];
  const overall = attendanceSummary?.overall?.percentage ?? 80;
  const shortageSubjects = subjects.filter((s: { isLow?: boolean }) => s.isLow);
  const cgpa = user?.role === 'student' ? '—' : '8.55';

  // Build notification list from API or mock
  const notifications = (notifData?.notifications || []).slice(0, 4);

  // Marks overall
  const marksOverall = marksSummary?.overallPercentage ?? 82;

  const isLive = attFromAPI || marksFromAPI;

  return (
    <PageTransition>
      <SectionHeader
        title={`Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, ${user?.name?.split(' ')[0] || 'Student'} 👋`}
        subtitle="Here's your academic snapshot for today"
        action={
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full ${isLive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
              {isLive ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isLive ? 'Live Data' : 'Demo Mode'}
            </span>
            <button onClick={() => navigate('/student/ai')} className="nexus-btn-primary flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4" />
              Ask AI Assistant
            </button>
          </div>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={TrendingUp} label="Current CGPA" value={cgpa} sub="Academic performance" trend="up" trendValue="0.1" iconColor="text-indigo-400" delay={0} />
        <StatCard icon={ClipboardList} label="Attendance" value={`${Math.round(overall)}%`} sub={`${subjects.length} subjects tracked`} trend={overall >= 75 ? 'up' : 'down'} trendValue="3%" iconColor="text-cyan-400" delay={0.05} />
        <StatCard icon={Briefcase} label="Internal Marks" value={`${marksOverall.toFixed(1)}%`} sub="Avg across subjects" trend="up" trendValue="5" iconColor="text-violet-400" delay={0.1} />
        <StatCard icon={Bell} label="Notifications" value={notifData?.unreadCount ?? 2} sub="Require attention" trend="neutral" iconColor="text-amber-400" delay={0.15} />
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
              <Tooltip contentStyle={{ background: '#0E1228', border: '1px solid #1E2A4A', borderRadius: '12px', color: '#F8FAFC', fontSize: 12 }} />
              <Area type="monotone" dataKey="cgpa" stroke="#4F46E5" strokeWidth={2.5} fill="url(#cgpaGrad)" name="CGPA" dot={{ fill: '#4F46E5', r: 4 }} />
              <Area type="monotone" dataKey="sgpa" stroke="#06B6D4" strokeWidth={2} fill="url(#sgpaGrad)" name="SGPA" strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
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
                  <span>{item.label}</span><span>{item.val}%</span>
                </div>
                <ProgressBar value={item.val} color={`bg-gradient-to-r ${item.color}`} />
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/student/placement')} className="w-full mt-4 nexus-btn-ghost text-sm flex items-center justify-center gap-2">
            View Full Report <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Card>

        {/* Subject Attendance — REAL DATA */}
        <Card delay={0.2}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Attendance</h3>
            {shortageSubjects.length > 0 && (
              <span className="badge-yellow"><AlertTriangle className="w-3 h-3" />{shortageSubjects.length} shortage</span>
            )}
          </div>
          <div className="space-y-3">
            {subjects.length === 0 && (
              <p className="text-slate-600 text-xs text-center py-4">No attendance data yet</p>
            )}
            {subjects.map((subject: { subject?: { name: string; code: string }; percentage: number; isLow?: boolean }, idx: number) => {
              const name = subject.subject?.name || 'Subject';
              const pct = subject.percentage;
              return (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-300 truncate max-w-[60%]">{name}</span>
                    <span className={`text-xs font-semibold ${pct >= 85 ? 'text-emerald-400' : pct >= 75 ? 'text-amber-400' : 'text-red-400'}`}>{pct.toFixed(1)}%</span>
                  </div>
                  <ProgressBar value={pct} color={pct >= 85 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : pct >= 75 ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 'bg-gradient-to-r from-red-600 to-red-400'} />
                </div>
              );
            })}
          </div>
        </Card>

        {/* AI Risk Status */}
        <Card delay={0.25}>
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-indigo-400" />
            <h3 className="text-white font-semibold">AI Risk Assessment</h3>
          </div>
          <div className={`p-4 rounded-xl mb-3 ${
            aiData?.riskLevel === 'critical' ? 'bg-red-500/10 border border-red-500/20' :
            aiData?.riskLevel === 'high' ? 'bg-orange-500/10 border border-orange-500/20' :
            aiData?.riskLevel === 'medium' ? 'bg-amber-500/10 border border-amber-500/20' :
            'bg-emerald-500/10 border border-emerald-500/20'
          }`}>
            <p className={`text-lg font-bold capitalize ${
              aiData?.riskLevel === 'critical' ? 'text-red-400' :
              aiData?.riskLevel === 'high' ? 'text-orange-400' :
              aiData?.riskLevel === 'medium' ? 'text-amber-400' : 'text-emerald-400'
            }`}>{aiData?.riskLevel || 'Low'} Risk</p>
            <p className="text-slate-400 text-xs mt-1">Score: {aiData?.riskScore ?? 0}/100</p>
          </div>
          <div className="space-y-2">
            {(aiData?.riskReasons || ['Performing well']).map((reason: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                {reason}
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-1">
            {(aiData?.suggestions || []).slice(0, 2).map((s: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs text-emerald-400">
                <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                {s}
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

        {/* Notifications — REAL DATA */}
        <Card delay={0.3}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent Activity</h3>
            {notifData?.unreadCount > 0 && <span className="badge-blue">{notifData.unreadCount} new</span>}
          </div>
          <div className="space-y-3">
            {notifications.length === 0 && (
              <p className="text-slate-600 text-xs text-center py-4">No notifications yet</p>
            )}
            {notifications.map((notif: { _id?: string; id?: string; title: string; body?: string; message?: string; category?: string; isRead?: boolean; read?: boolean; createdAt?: string; time?: string }, i: number) => {
              const isUnread = !notif.isRead && !notif.read;
              const cat = notif.category || 'general';
              return (
                <div key={notif._id || notif.id || i} className={`flex gap-3 p-3 rounded-xl transition-colors ${isUnread ? 'bg-white/5' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    cat === 'attendance' ? 'bg-amber-500/15 text-amber-400' :
                    cat === 'marks' ? 'bg-violet-500/15 text-violet-400' :
                    cat === 'placement' ? 'bg-emerald-500/15 text-emerald-400' :
                    'bg-indigo-500/15 text-indigo-400'
                  }`}>
                    {cat === 'attendance' ? <AlertTriangle className="w-4 h-4" /> :
                     cat === 'placement' ? <Briefcase className="w-4 h-4" /> :
                     <Bell className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium leading-tight">{notif.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{notif.body || notif.message}</p>
                    <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString('en-IN') : notif.time}
                    </p>
                  </div>
                  {isUnread && <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1" />}
                </div>
              );
            })}
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
