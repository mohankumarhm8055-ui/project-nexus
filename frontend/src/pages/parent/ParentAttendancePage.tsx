import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Brain } from 'lucide-react';
import { SectionHeader, Card, ProgressBar } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { mockSubjects, attendanceHeatmap } from '../../utils/mockData';

const heatmapColors: Record<string, string> = {
  present: 'heatmap-present',
  absent: 'heatmap-absent',
  holiday: 'heatmap-holiday',
  weekend: 'heatmap-weekend',
  future: 'heatmap-future',
};

export default function ParentAttendancePage() {
  const overallAttend = Math.round(mockSubjects.reduce((a, s) => a + s.attendancePercent, 0) / mockSubjects.length);
  const shortages = mockSubjects.filter(s => s.attendancePercent < 75);

  return (
    <PageTransition>
      <SectionHeader title="Attendance Details" subtitle="Subject-wise breakdown and monthly calendar for May 2026" />

      {/* Shortage Alert */}
      {shortages.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl flex items-start gap-3 border border-red-500/25 bg-red-500/8">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-semibold text-sm">{shortages.length} Subject{shortages.length > 1 ? 's' : ''} Below 75% Attendance</p>
            <p className="text-slate-400 text-xs mt-0.5">
              {shortages.map(s => s.name).join(', ')} — immediate attention required to avoid academic penalty.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subject Breakdown */}
        <Card delay={0}>
          <h3 className="text-white font-semibold mb-4">Subject-wise Attendance</h3>
          <div className="space-y-4">
            {mockSubjects.map((s, i) => {
              const classesHeld = 48;
              const attended = Math.round(s.attendancePercent * classesHeld / 100);
              const toAttend = s.attendancePercent < 75 ? Math.ceil((0.75 * classesHeld - attended) / 0.25) : 0;
              return (
                <motion.div key={s.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <p className="text-sm text-slate-200 font-medium">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.code} · {attended}/{classesHeld} classes</p>
                    </div>
                    <span className={`text-lg font-bold ${s.attendancePercent >= 85 ? 'text-emerald-400' : s.attendancePercent >= 75 ? 'text-amber-400' : 'text-red-400'}`}>
                      {s.attendancePercent}%
                    </span>
                  </div>
                  <ProgressBar value={s.attendancePercent} height="h-2"
                    color={s.attendancePercent >= 85 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : s.attendancePercent >= 75 ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 'bg-gradient-to-r from-red-600 to-red-400'} />
                  {toAttend > 0 && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-400">
                      <AlertTriangle className="w-3 h-3" />
                      Needs {toAttend} more consecutive classes to reach 75%
                    </div>
                  )}
                  {s.attendancePercent >= 85 && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-400">
                      <CheckCircle className="w-3 h-3" />
                      Can miss up to {Math.floor((s.attendancePercent - 75) * classesHeld / 100)} more classes
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Calendar Heatmap */}
        <div className="space-y-4">
          <Card delay={0.1}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">May 2026 Calendar</h3>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500/70 inline-block" />Present</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/70 inline-block" />Absent</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500/40 inline-block" />Holiday</span>
              </div>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1.5 mb-1.5">
              {['F', 'S', 'S', 'M', 'T', 'W', 'T'].map((d, i) => (
                <div key={i} className="text-center text-xs text-slate-600 font-medium">{d}</div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {attendanceHeatmap.map(day => (
                <div key={day.date} title={`May ${day.date} — ${day.status}`}
                  className={`aspect-square flex items-center justify-center text-xs text-white/60 font-medium ${heatmapColors[day.status]}`}>
                  {day.date}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-slate-500">
              <span>Present: <span className="text-emerald-400 font-semibold">9 days</span></span>
              <span>Absent: <span className="text-red-400 font-semibold">2 days</span></span>
              <span>Holidays: <span className="text-amber-400 font-semibold">1 day</span></span>
            </div>
          </Card>

          {/* AI Tip */}
          <Card delay={0.15}>
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-rose-400" />
              <h3 className="text-white font-semibold text-sm">AI Attendance Advisor</h3>
            </div>
            <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
              <p>📊 Overall attendance is <span className={`font-semibold ${overallAttend >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>{overallAttend}%</span> — {overallAttend >= 75 ? 'within safe range.' : 'below required threshold.'}</p>
              <p>⚠️ <span className="text-amber-400 font-semibold">Computer Networks (65%)</span> is critically low. Attending the next 7 consecutive classes will bring attendance to 75%.</p>
              <p>✅ <span className="text-emerald-400 font-semibold">Web Technologies (95%)</span> is excellent — Arjun can miss up to 9 more classes safely.</p>
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
