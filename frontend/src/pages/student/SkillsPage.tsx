import { Code2, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { skillData } from '../../utils/mockData';
import { Card, SectionHeader, ProgressBar } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';

const roadmap = [
  { phase: 'Foundation', topics: ['Arrays & Strings', 'Recursion', 'Sorting Algorithms'], status: 'completed' },
  { phase: 'Intermediate', topics: ['Trees & Graphs', 'Dynamic Programming', 'Greedy Algorithms'], status: 'in_progress' },
  { phase: 'Advanced', topics: ['System Design', 'Concurrency', 'Distributed Systems'], status: 'upcoming' },
  { phase: 'Interview Prep', topics: ['Mock Interviews', 'Company-specific', 'Behavioral'], status: 'upcoming' },
];

const certifications = [
  { name: 'AWS Cloud Practitioner', provider: 'Amazon', status: 'in_progress', progress: 65 },
  { name: 'Google Data Analytics', provider: 'Google', status: 'completed', progress: 100 },
  { name: 'Meta React Developer', provider: 'Meta', status: 'in_progress', progress: 42 },
];

const leetcodeStats = { solved: 187, total: 2800, easy: 94, medium: 78, hard: 15 };

export default function SkillsPage() {
  return (
    <PageTransition>
      <SectionHeader title="Skills & Development" subtitle="Track your technical growth and certification journey" />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Skill bars */}
        <Card delay={0} className="lg:col-span-1">
          <h3 className="text-white font-semibold mb-4">Skill Proficiency</h3>
          <div className="space-y-4">
            {skillData.map((item) => (
              <div key={item.skill}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300 font-medium">{item.skill}</span>
                  <span className={`font-semibold ${item.level >= 80 ? 'text-emerald-400' : item.level >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{item.level}%</span>
                </div>
                <ProgressBar value={item.level} height="h-2" color="bg-gradient-to-r from-indigo-600 to-cyan-500" />
              </div>
            ))}
          </div>
        </Card>

        {/* LeetCode stats */}
        <Card delay={0.1}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">LeetCode Tracker</h3>
              <p className="text-slate-500 text-xs">{leetcodeStats.solved} problems solved</p>
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1E2A4A" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="url(#leetGrad)" strokeWidth="10"
                  strokeDasharray={`${(leetcodeStats.solved / 500) * 251.3} 251.3`}
                  strokeLinecap="round" />
                <defs>
                  <linearGradient id="leetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-white">{leetcodeStats.solved}</span>
                <span className="text-xs text-slate-500">solved</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Easy', val: leetcodeStats.easy, color: 'text-emerald-400' },
              { label: 'Medium', val: leetcodeStats.medium, color: 'text-amber-400' },
              { label: 'Hard', val: leetcodeStats.hard, color: 'text-red-400' },
            ].map(item => (
              <div key={item.label} className="text-center glass rounded-xl p-3">
                <p className={`text-lg font-bold ${item.color}`}>{item.val}</p>
                <p className="text-xs text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Certifications */}
        <Card delay={0.15}>
          <h3 className="text-white font-semibold mb-4">Certifications</h3>
          <div className="space-y-4">
            {certifications.map((cert, i) => (
              <div key={i} className="glass rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-white font-medium">{cert.name}</p>
                    <p className="text-xs text-slate-500">{cert.provider}</p>
                  </div>
                  {cert.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  )}
                </div>
                <ProgressBar value={cert.progress} height="h-1.5"
                  color={cert.status === 'completed' ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-600 to-cyan-500'} />
                <p className="text-xs text-slate-500 mt-1">{cert.progress}% complete</p>
              </div>
            ))}
            <button className="w-full nexus-btn-ghost text-sm flex items-center justify-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Browse Certifications
            </button>
          </div>
        </Card>

        {/* DSA Roadmap */}
        <Card delay={0.2} className="lg:col-span-3">
          <h3 className="text-white font-semibold mb-4">DSA Learning Roadmap</h3>
          <div className="grid grid-cols-4 gap-4">
            {roadmap.map((phase, i) => (
              <div key={i} className={`rounded-xl p-4 border transition-all ${
                phase.status === 'completed' ? 'border-emerald-500/30 bg-emerald-500/5' :
                phase.status === 'in_progress' ? 'border-indigo-500/40 bg-indigo-500/8' :
                'border-white/5 bg-white/2 opacity-60'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                    phase.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    phase.status === 'in_progress' ? 'bg-indigo-500/20 text-indigo-400' :
                    'bg-slate-800 text-slate-600'
                  }`}>
                    {phase.status === 'completed' ? '✅ Done' : phase.status === 'in_progress' ? '🔄 Active' : '🔒 Locked'}
                  </span>
                  <span className="text-xs text-slate-600">Phase {i + 1}</span>
                </div>
                <h4 className="text-white font-semibold text-sm mb-2">{phase.phase}</h4>
                <ul className="space-y-1.5">
                  {phase.topics.map(topic => (
                    <li key={topic} className="flex items-center gap-2 text-xs text-slate-400">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        phase.status === 'completed' ? 'bg-emerald-400' :
                        phase.status === 'in_progress' ? 'bg-indigo-400' : 'bg-slate-700'
                      }`} />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
