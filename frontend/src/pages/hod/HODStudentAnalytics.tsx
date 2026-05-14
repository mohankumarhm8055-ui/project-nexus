import { motion } from 'framer-motion';
import { TrendingUp, Award } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { Card, SectionHeader, ProgressBar } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { deptSemesterComparison, subjectDeptAvg, topPerformers, hodStudents } from '../../utils/mockData';

const weakStudents = hodStudents.filter(s => s.riskLevel === 'high' || s.riskLevel === 'medium');

export default function HODStudentAnalytics() {
  return (
    <PageTransition>
      <SectionHeader title="Student Analytics" subtitle="Department-wide performance insights and trend analysis" />

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Semester Comparison */}
        <Card delay={0}>
          <h3 className="text-white font-semibold mb-4">Semester-wise Dept. Avg CGPA</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={deptSemesterComparison}>
              <defs>
                <linearGradient id="semGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2A4A" vertical={false} />
              <XAxis dataKey="sem" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[7, 9]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0E1228', border: '1px solid #1E2A4A', borderRadius: '12px', color: '#F8FAFC', fontSize: 12 }} />
              <Area type="monotone" dataKey="avg" stroke="#14B8A6" strokeWidth={2.5} fill="url(#semGrad)" name="Avg CGPA" dot={{ fill: '#14B8A6', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Subject Performance Radar */}
        <Card delay={0.05}>
          <h3 className="text-white font-semibold mb-4">Subject-wise Dept. Avg Marks (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={subjectDeptAvg}>
              <PolarGrid stroke="#1E2A4A" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} />
              <Radar dataKey="avg" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card delay={0.1}>
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="text-white font-semibold">Top Performers</h3>
          </div>
          <div className="space-y-3">
            {topPerformers.map((s, i) => (
              <motion.div key={s.roll} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                className="flex items-center justify-between p-3 glass rounded-xl">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-slate-400'}`}>#{i + 1}</span>
                  <div>
                    <p className="text-sm text-white font-medium">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.roll}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="text-center">
                    <p className="font-bold text-emerald-400">{s.cgpa}</p>
                    <p className="text-slate-600">CGPA</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-teal-400">{s.attendance}%</p>
                    <p className="text-slate-600">Attend.</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Students Needing Support */}
        <Card delay={0.15}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h3 className="text-white font-semibold">Needs Improvement</h3>
          </div>
          <div className="space-y-3">
            {weakStudents.slice(0, 5).map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.06 }}
                className="p-3 glass rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-white font-medium">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.rollNumber}</p>
                  </div>
                  <span className={s.riskLevel === 'high' ? 'risk-high' : 'risk-medium'}>
                    {s.riskLevel === 'high' ? 'High Risk' : 'Medium Risk'}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500 mb-0.5"><span>Attendance</span><span>{s.attendance}%</span></div>
                  <ProgressBar value={s.attendance} height="h-1.5" color={s.attendance < 70 ? 'bg-red-500' : 'bg-amber-500'} />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
