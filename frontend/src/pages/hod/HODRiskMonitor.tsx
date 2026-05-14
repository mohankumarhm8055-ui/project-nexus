import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Send, AlertTriangle, Search, Filter } from 'lucide-react';
import { SectionHeader } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { hodStudents } from '../../utils/mockData';
import type { RiskStudent } from '../../types';

type FilterLevel = 'all' | 'high' | 'medium' | 'low';

export default function HODRiskMonitor() {
  const [filter, setFilter] = useState<FilterLevel>('all');
  const [search, setSearch] = useState('');
  const [alertSent, setAlertSent] = useState<string[]>([]);

  const filtered = hodStudents.filter(s => {
    const matchesFilter = filter === 'all' || s.riskLevel === filter;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sendAlert = (id: string) => {
    setAlertSent(prev => [...prev, id]);
    setTimeout(() => setAlertSent(prev => prev.filter(x => x !== id)), 3000);
  };

  const RiskBadge = ({ level }: { level: RiskStudent['riskLevel'] }) => {
    if (level === 'high') return <span className="risk-high">🔴 High Risk</span>;
    if (level === 'medium') return <span className="risk-medium">🟡 Medium</span>;
    return <span className="risk-low">🟢 Low Risk</span>;
  };

  const counts = {
    all: hodStudents.length,
    high: hodStudents.filter(s => s.riskLevel === 'high').length,
    medium: hodStudents.filter(s => s.riskLevel === 'medium').length,
    low: hodStudents.filter(s => s.riskLevel === 'low').length,
  };

  return (
    <PageTransition>
      <SectionHeader title="AI Risk Monitor" subtitle="AI-powered student risk detection and early warning system" />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or roll number..."
            className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-all" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          {(['all', 'high', 'medium', 'low'] as FilterLevel[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-teal-600/30 text-teal-300 border border-teal-500/40' : 'glass text-slate-400 hover:text-white'}`}>
              {f === 'all' ? `All (${counts.all})` : `${f} (${counts[f]})`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((student, i) => (
          <motion.div key={student.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`glass rounded-2xl p-5 border transition-all ${student.riskLevel === 'high' ? 'border-red-500/20 hover:border-red-500/40' : student.riskLevel === 'medium' ? 'border-amber-500/15 hover:border-amber-500/35' : 'border-white/5 hover:border-emerald-500/25'}`}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-center gap-3 lg:w-48 flex-shrink-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${student.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' : student.riskLevel === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {student.name[0]}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{student.name}</p>
                  <p className="text-slate-500 text-xs">{student.rollNumber} · Year {student.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-xs flex-shrink-0">
                <div className="text-center">
                  <p className={`text-base font-bold ${student.attendance < 70 ? 'text-red-400' : student.attendance < 75 ? 'text-amber-400' : 'text-emerald-400'}`}>{student.attendance}%</p>
                  <p className="text-slate-600">Attend.</p>
                </div>
                <div className="text-center">
                  <p className={`text-base font-bold ${student.cgpa < 6.5 ? 'text-red-400' : student.cgpa < 7.5 ? 'text-amber-400' : 'text-white'}`}>{student.cgpa}</p>
                  <p className="text-slate-600">CGPA</p>
                </div>
                <RiskBadge level={student.riskLevel} />
              </div>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {student.riskReasons.map(r => (
                  <span key={r} className="text-xs px-2 py-0.5 rounded-lg bg-white/5 text-slate-400 border border-white/8">{r}</span>
                ))}
              </div>
              <button onClick={() => sendAlert(student.id)}
                className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-semibold transition-all flex-shrink-0 ${alertSent.includes(student.id) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'nexus-btn-teal'}`}>
                <Send className="w-3 h-3" />
                {alertSent.includes(student.id) ? 'Sent ✓' : 'Alert Parent'}
              </button>
            </div>
            <div className="mt-3 flex items-start gap-2 pt-3 border-t border-white/5">
              <Brain className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed"><span className="text-teal-400 font-medium">AI: </span>{student.aiSummary}</p>
            </div>
            {student.lastAlert && (
              <div className="flex items-center gap-1.5 mt-2">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <p className="text-xs text-amber-400/70">Last parent alert: {student.lastAlert}</p>
              </div>
            )}
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-600">
            <Brain className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No students match the current filter</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
