import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { attendanceData } from '../../utils/mockData';
import { Card, SectionHeader, ProgressBar } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { useAttendanceSummary } from '../../hooks/useApiData';

type SubjectSummary = {
  subject?: { name: string; code: string };
  name?: string;
  code?: string;
  percentage: number;
  total: number;
  present: number;
  isLow: boolean;
};

export default function AttendancePage() {
  const { data: summary, loading, isFromAPI } = useAttendanceSummary();

  const subjects: SubjectSummary[] = summary?.subjects || [];
  const overall = summary?.overall?.percentage ?? 80;
  const shortages = subjects.filter((s) => s.isLow);

  return (
    <PageTransition>
      <SectionHeader
        title="Attendance Tracker"
        subtitle="Monitor your subject-wise attendance and avoid shortages"
        action={
          <span className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full ${isFromAPI ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
            {isFromAPI ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isFromAPI ? 'Live Data' : 'Demo Mode'}
          </span>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card delay={0} className="text-center">
          <p className="text-3xl font-bold text-white">{Math.round(overall)}%</p>
          <p className="text-slate-400 text-sm mt-1">Overall Attendance</p>
          <div className="mt-3"><ProgressBar value={overall} color={overall >= 75 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-red-600 to-red-400'} height="h-2" /></div>
        </Card>
        <Card delay={0.05} className="text-center">
          <p className="text-3xl font-bold text-emerald-400">{subjects.filter((s) => !s.isLow).length}</p>
          <p className="text-slate-400 text-sm mt-1">Subjects Safe</p>
          <div className="flex justify-center mt-2"><CheckCircle className="w-5 h-5 text-emerald-400" /></div>
        </Card>
        <Card delay={0.1} className="text-center">
          <p className="text-3xl font-bold text-amber-400">{shortages.length}</p>
          <p className="text-slate-400 text-sm mt-1">Shortage Subjects</p>
          <div className="flex justify-center mt-2"><AlertTriangle className="w-5 h-5 text-amber-400" /></div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subject cards */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold">Subject-wise Breakdown</h3>
          {loading && <div className="text-slate-500 text-sm text-center py-8 animate-pulse">Fetching attendance...</div>}
          {subjects.map((subject, i) => {
            const name = subject.subject?.name || subject.name || 'Unknown';
            const code = subject.subject?.code || subject.code || '';
            const pct = subject.percentage;
            const total = subject.total || 48;
            const present = subject.present || Math.round(pct * total / 100);
            const toAttend = pct < 75 ? Math.ceil((0.75 * total - present) / 0.25) : 0;
            const canMiss = pct >= 85 ? Math.floor((pct - 75) * total / 100) : 0;

            return (
              <motion.div
                key={code || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-white font-medium text-sm">{name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{code}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${pct >= 85 ? 'text-emerald-400' : pct >= 75 ? 'text-amber-400' : 'text-red-400'}`}>
                      {pct.toFixed(1)}%
                    </span>
                    <p className="text-xs text-slate-600">{present}/{total} classes</p>
                  </div>
                </div>
                <ProgressBar value={pct} height="h-2" color={
                  pct >= 85 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
                  pct >= 75 ? 'bg-gradient-to-r from-amber-600 to-amber-400' :
                  'bg-gradient-to-r from-red-600 to-red-400'
                } />
                {toAttend > 0 && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-amber-400">
                    <AlertTriangle className="w-3 h-3" />
                    Attend next {toAttend} classes consecutively to reach 75%
                  </div>
                )}
                {canMiss > 0 && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle className="w-3 h-3" />
                    Can miss up to {canMiss} more classes safely
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Monthly trend */}
        <div className="space-y-6">
          <Card delay={0.2}>
            <h3 className="text-white font-semibold mb-4">Monthly Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2A4A" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0E1228', border: '1px solid #1E2A4A', borderRadius: '12px', color: '#F8FAFC', fontSize: 12 }} />
                <Bar dataKey="percent" fill="url(#attendBar)" radius={[6, 6, 0, 0]} name="Attendance %" />
                <defs>
                  <linearGradient id="attendBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card delay={0.25}>
            <h3 className="text-white font-semibold mb-4">Upcoming Classes Today</h3>
            <div className="space-y-3">
              {[
                { time: '09:00 AM', subject: 'Data Structures & Algorithms', room: 'Lab 3A', type: 'Lab' },
                { time: '11:00 AM', subject: 'Machine Learning', room: 'LH-201', type: 'Lecture' },
                { time: '02:00 PM', subject: 'Computer Networks', room: 'LH-104', type: 'Lecture' },
              ].map((cls, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                  <div className="w-16 text-right flex-shrink-0">
                    <span className="text-xs text-slate-500">{cls.time}</span>
                  </div>
                  <div className="w-px bg-indigo-500/30 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-white font-medium">{cls.subject}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">{cls.room}</span>
                      <span className={`badge text-xs ${cls.type === 'Lab' ? 'badge-purple' : 'badge-blue'}`}>{cls.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
