import { motion } from 'framer-motion';
import { Brain, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { Card, SectionHeader, StatCard, ProgressBar } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { mockSubjects, cgpaHistory } from '../../utils/mockData';

const deptAvg = [
  { subject: 'DSA', student: 94, dept: 78 },
  { subject: 'DBMS', student: 76, dept: 72 },
  { subject: 'CN', student: 70, dept: 65 },
  { subject: 'OS', student: 88, dept: 80 },
  { subject: 'ML', student: 82, dept: 74 },
  { subject: 'Web', student: 98, dept: 85 },
];

const aiSummary = `Arjun is performing exceptionally well in Web Technologies (98%) and DSA (94%). 
His CGPA has improved steadily from 8.2 in Semester 1 to 8.55 currently — placing him in the top 12% of the batch.
Focus areas: Computer Networks needs improvement. Recommend dedicating additional study time before end-semester exams.`;

export default function ParentPerformancePage() {
  const currentCGPA = 8.55;
  const currentSGPA = 8.7;
  const batchRank = '#24 / 286';

  return (
    <PageTransition>
      <SectionHeader title="Academic Performance" subtitle="Marks, CGPA progression and subject-wise analysis" />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard icon={TrendingUp} label="Current CGPA" value={currentCGPA} sub="Cumulative" trend="up" trendValue="0.1" iconColor="text-rose-400" delay={0} />
        <StatCard icon={TrendingUp} label="Sem 6 SGPA" value={currentSGPA} sub="Best semester yet!" trend="up" trendValue="0.2" iconColor="text-pink-400" delay={0.05} />
        <StatCard icon={TrendingUp} label="Batch Rank" value={batchRank} sub="Top 13%" iconColor="text-violet-400" delay={0.1} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* CGPA Trend */}
        <Card delay={0.1}>
          <h3 className="text-white font-semibold mb-4">CGPA Progression — All Semesters</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cgpaHistory}>
              <defs>
                <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2A4A" vertical={false} />
              <XAxis dataKey="semester" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[7, 10]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0E1228', border: '1px solid #1E2A4A', borderRadius: '12px', color: '#F8FAFC', fontSize: 12 }} />
              <Area type="monotone" dataKey="cgpa" stroke="#F43F5E" strokeWidth={2.5} fill="url(#perfGrad)" name="CGPA" dot={{ fill: '#F43F5E', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Radar vs Dept Avg */}
        <Card delay={0.15}>
          <h3 className="text-white font-semibold mb-4">vs. Department Average</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={deptAvg}>
              <PolarGrid stroke="#1E2A4A" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10 }} />
              <Radar dataKey="student" stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.2} strokeWidth={2} name="Arjun" />
              <Radar dataKey="dept" stroke="#64748B" fill="#64748B" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 4" name="Dept Avg" />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-rose-500 inline-block rounded" />Arjun</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-slate-500 inline-block rounded" />Dept. Avg</span>
          </div>
        </Card>
      </div>

      {/* Marks Table */}
      <Card delay={0.2} className="mb-6">
        <h3 className="text-white font-semibold mb-4">Internal Assessment Marks</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Subject', 'Code', 'Credits', 'Internal Marks', 'Progress', 'Grade'].map(h => (
                  <th key={h} className="text-left text-xs text-slate-500 font-semibold pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/3">
              {mockSubjects.map((s, i) => {
                const pct = (s.internalMark / s.maxInternalMark) * 100;
                const grade = pct >= 90 ? 'O' : pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B+' : 'B';
                const gc = grade === 'O' ? 'badge-green' : grade === 'A+' ? 'badge-blue' : grade === 'A' ? 'badge-cyan' : 'badge-yellow';
                return (
                  <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.05 }} className="hover:bg-white/3 transition-colors">
                    <td className="py-3 pr-4 text-sm text-slate-200">{s.name}</td>
                    <td className="py-3 pr-4 text-xs text-slate-500 font-mono">{s.code}</td>
                    <td className="py-3 pr-4 text-sm text-slate-400">{s.credits}</td>
                    <td className="py-3 pr-4 text-sm text-white font-semibold">{s.internalMark}<span className="text-slate-500 font-normal">/{s.maxInternalMark}</span></td>
                    <td className="py-3 pr-4 w-28"><ProgressBar value={s.internalMark} max={s.maxInternalMark} color="bg-gradient-to-r from-rose-600 to-pink-500" showLabel /></td>
                    <td className="py-3"><span className={gc}>{grade}</span></td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI Summary */}
      <Card delay={0.3}>
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-rose-400" />
          <h3 className="text-white font-semibold text-sm">AI Performance Summary</h3>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{aiSummary}</p>
      </Card>
    </PageTransition>
  );
}
