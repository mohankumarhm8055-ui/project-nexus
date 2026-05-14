import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockSubjects, attendanceData } from '../../utils/mockData';
import { Card, SectionHeader, ProgressBar } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';

export default function AttendancePage() {
  const overall = Math.round(mockSubjects.reduce((a, s) => a + s.attendancePercent, 0) / mockSubjects.length);
  const shortages = mockSubjects.filter(s => s.attendancePercent < 75);

  return (
    <PageTransition>
      <SectionHeader
        title="Attendance Tracker"
        subtitle="Monitor your subject-wise attendance and avoid shortages"
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card delay={0} className="text-center">
          <p className="text-3xl font-bold text-white">{overall}%</p>
          <p className="text-slate-400 text-sm mt-1">Overall Attendance</p>
          <div className="mt-3"><ProgressBar value={overall} color={overall >= 75 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-red-600 to-red-400'} height="h-2" /></div>
        </Card>
        <Card delay={0.05} className="text-center">
          <p className="text-3xl font-bold text-emerald-400">{mockSubjects.filter(s => s.attendancePercent >= 75).length}</p>
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
          {mockSubjects.map((subject, i) => {
            const classesHeld = 48;
            const attended = Math.round(subject.attendancePercent * classesHeld / 100);
            const toAttend = subject.attendancePercent < 75
              ? Math.ceil((0.75 * classesHeld - attended) / 0.25)
              : 0;

            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-white font-medium text-sm">{subject.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{subject.code} · {subject.faculty}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${
                      subject.attendancePercent >= 85 ? 'text-emerald-400' :
                      subject.attendancePercent >= 75 ? 'text-amber-400' : 'text-red-400'
                    }`}>{subject.attendancePercent}%</span>
                    <p className="text-xs text-slate-600">{attended}/{classesHeld} classes</p>
                  </div>
                </div>
                <ProgressBar
                  value={subject.attendancePercent}
                  height="h-2"
                  color={
                    subject.attendancePercent >= 85 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
                    subject.attendancePercent >= 75 ? 'bg-gradient-to-r from-amber-600 to-amber-400' :
                    'bg-gradient-to-r from-red-600 to-red-400'
                  }
                />
                {toAttend > 0 && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-amber-400">
                    <AlertTriangle className="w-3 h-3" />
                    Attend next {toAttend} classes consecutively to reach 75%
                  </div>
                )}
                {subject.attendancePercent >= 85 && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle className="w-3 h-3" />
                    Can miss up to {Math.floor((subject.attendancePercent - 75) * classesHeld / 100)} more classes
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
