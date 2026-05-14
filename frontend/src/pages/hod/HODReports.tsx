import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, BarChart3, Users, CheckCircle } from 'lucide-react';
import { Card, SectionHeader } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { deptMetrics } from '../../utils/mockData';

const REPORT_TYPES = [
  { id: 'report-cards', label: 'Student Report Cards', desc: 'Individual PDF report cards with marks, CGPA & remarks', icon: FileText, color: 'text-teal-400', bg: 'bg-teal-500/15' },
  { id: 'attendance', label: 'Attendance Summary', desc: 'Subject-wise & monthly attendance for all students', icon: BarChart3, color: 'text-indigo-400', bg: 'bg-indigo-500/15' },
  { id: 'faculty-perf', label: 'Faculty Performance', desc: 'Completion rates, submission status & analytics', icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/15' },
  { id: 'risk-report', label: 'AI Risk Report', desc: 'Full AI-generated risk analysis with recommendations', icon: BarChart3, color: 'text-red-400', bg: 'bg-red-500/15' },
];

export default function HODReports() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [semester, setSemester] = useState('Semester 6');
  const [batch, setBatch] = useState('2021-25 Batch');

  const generate = async (id: string) => {
    setGenerating(id);
    await new Promise(r => setTimeout(r, 2000));
    setGenerating(null);
    setDone(prev => [...prev, id]);
    setTimeout(() => setDone(prev => prev.filter(x => x !== id)), 5000);
  };

  return (
    <PageTransition>
      <SectionHeader title="Report Management" subtitle="Generate and export academic reports for the department" />

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select value={semester} onChange={e => setSemester(e.target.value)}
          className="bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-teal-500/50">
          {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={batch} onChange={e => setBatch(e.target.value)}
          className="bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-teal-500/50">
          {['2021-25 Batch', '2022-26 Batch', '2023-27 Batch'].map(b => <option key={b}>{b}</option>)}
        </select>
      </div>

      {/* Report cards grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {REPORT_TYPES.map((rt, i) => (
          <motion.div key={rt.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="glass rounded-2xl p-5 hover:border-teal-500/30 transition-all">
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl ${rt.bg} flex items-center justify-center flex-shrink-0`}>
                <rt.icon className={`w-5 h-5 ${rt.color}`} />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm">{rt.label}</h4>
                <p className="text-slate-500 text-xs mt-0.5 mb-3">{rt.desc}</p>
                <p className="text-xs text-slate-600 mb-3">{semester} · {batch}</p>
                <button onClick={() => generate(rt.id)} disabled={generating === rt.id}
                  className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all ${done.includes(rt.id) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'nexus-btn-teal'} disabled:opacity-60`}>
                  {generating === rt.id ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
                    : done.includes(rt.id) ? <><CheckCircle className="w-3.5 h-3.5" />Download PDF</>
                      : <><Download className="w-3.5 h-3.5" />Generate Report</>}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary stats */}
      <Card delay={0.3}>
        <h3 className="text-white font-semibold mb-4">Department Summary — {semester}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: deptMetrics.totalStudents, color: 'text-teal-400' },
            { label: 'Avg Attendance', value: `${deptMetrics.avgAttendance}%`, color: 'text-emerald-400' },
            { label: 'Avg CGPA', value: deptMetrics.avgCGPA, color: 'text-indigo-400' },
            { label: 'Placement Rate', value: `${deptMetrics.placementRate}%`, color: 'text-violet-400' },
          ].map(item => (
            <div key={item.label} className="glass rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-slate-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </Card>
    </PageTransition>
  );
}
