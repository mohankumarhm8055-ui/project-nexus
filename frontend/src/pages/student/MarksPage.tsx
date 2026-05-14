import { motion } from 'framer-motion';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Award, TrendingUp, BookOpen } from 'lucide-react';
import { mockSubjects, cgpaHistory } from '../../utils/mockData';
import { Card, SectionHeader, StatCard, ProgressBar } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';

const radarData = [
  { subject: 'DSA', score: 94 },
  { subject: 'DBMS', score: 76 },
  { subject: 'CN', score: 70 },
  { subject: 'OS', score: 88 },
  { subject: 'ML', score: 82 },
  { subject: 'Web', score: 98 },
];

export default function MarksPage() {
  const currentCGPA = 8.55;
  const currentSGPA = 8.7;

  return (
    <PageTransition>
      <SectionHeader title="Marks & CGPA" subtitle="Academic performance overview across all semesters" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard icon={TrendingUp} label="Current CGPA" value={currentCGPA} sub="Overall cumulative" trend="up" trendValue="0.1" iconColor="text-indigo-400" />
        <StatCard icon={Award} label="Semester 6 SGPA" value={currentSGPA} sub="Best semester yet!" trend="up" trendValue="0.2" iconColor="text-emerald-400" delay={0.05} />
        <StatCard icon={BookOpen} label="Batch Rank" value="#24 / 180" sub="Top 13%" iconColor="text-violet-400" delay={0.1} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* CGPA Chart */}
        <Card delay={0.15}>
          <h3 className="text-white font-semibold mb-4">CGPA Progression</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={cgpaHistory}>
              <defs>
                <linearGradient id="cgpaGradMarks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2A4A" vertical={false} />
              <XAxis dataKey="semester" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[7, 10]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0E1228', border: '1px solid #1E2A4A', borderRadius: '12px', color: '#F8FAFC', fontSize: 12 }} />
              <Area type="monotone" dataKey="cgpa" stroke="#4F46E5" strokeWidth={3} fill="url(#cgpaGradMarks)" dot={{ fill: '#4F46E5', r: 5 }} name="CGPA" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Radar Chart */}
        <Card delay={0.2}>
          <h3 className="text-white font-semibold mb-4">Subject Performance Radar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1E2A4A" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} />
              <Radar dataKey="score" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Internal marks table */}
        <Card delay={0.25} className="lg:col-span-2">
          <h3 className="text-white font-semibold mb-4">Internal Assessment Marks</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-slate-500 font-semibold pb-3">Subject</th>
                  <th className="text-left text-xs text-slate-500 font-semibold pb-3">Code</th>
                  <th className="text-left text-xs text-slate-500 font-semibold pb-3">Credits</th>
                  <th className="text-left text-xs text-slate-500 font-semibold pb-3">Internal Marks</th>
                  <th className="text-left text-xs text-slate-500 font-semibold pb-3">Progress</th>
                  <th className="text-left text-xs text-slate-500 font-semibold pb-3">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/3">
                {mockSubjects.map((s, i) => {
                  const percent = (s.internalMark / s.maxInternalMark) * 100;
                  const grade = percent >= 90 ? 'O' : percent >= 80 ? 'A+' : percent >= 70 ? 'A' : percent >= 60 ? 'B+' : 'B';
                  const gradeColor = grade === 'O' ? 'badge-green' : grade === 'A+' ? 'badge-blue' : grade === 'A' ? 'badge-cyan' : 'badge-yellow';
                  return (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-white/3 transition-colors"
                    >
                      <td className="py-3 text-sm text-slate-200">{s.name}</td>
                      <td className="py-3 text-xs text-slate-500 font-mono">{s.code}</td>
                      <td className="py-3 text-sm text-slate-400">{s.credits}</td>
                      <td className="py-3 text-sm text-white font-semibold">{s.internalMark}<span className="text-slate-500 font-normal">/{s.maxInternalMark}</span></td>
                      <td className="py-3 w-32"><ProgressBar value={s.internalMark} max={s.maxInternalMark} color="bg-gradient-to-r from-indigo-600 to-cyan-500" showLabel /></td>
                      <td className="py-3"><span className={gradeColor}>{grade}</span></td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
