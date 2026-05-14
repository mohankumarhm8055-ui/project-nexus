import { motion } from 'framer-motion';
import { Building2, TrendingUp, Users, CheckCircle, Clock, Calendar, Target, ArrowRight, Star } from 'lucide-react';
import { mockCompanies } from '../../utils/mockData';
import { Card, SectionHeader, StatCard, ProgressBar } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';

const interviewStages = [
  { stage: 'Online Assessment', status: 'completed', date: 'May 5' },
  { stage: 'Technical Round 1', status: 'completed', date: 'May 10' },
  { stage: 'Technical Round 2', status: 'upcoming', date: 'May 20' },
  { stage: 'HR Round', status: 'pending', date: 'TBD' },
  { stage: 'Offer Letter', status: 'pending', date: 'TBD' },
];

export default function PlacementPage() {
  const eligibleCompanies = mockCompanies.filter(c => 8.55 >= c.eligibilityCGPA);

  return (
    <PageTransition>
      <SectionHeader
        title="Placement Portal"
        subtitle="Track companies, eligibility, and your placement journey"
        action={
          <button className="nexus-btn-primary text-sm flex items-center gap-2">
            <Target className="w-4 h-4" />
            View Readiness Score
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Building2} label="Active Drives" value={mockCompanies.filter(c => c.status !== 'completed').length} iconColor="text-indigo-400" delay={0} />
        <StatCard icon={CheckCircle} label="Eligible For" value={eligibleCompanies.length} sub="Companies" iconColor="text-emerald-400" delay={0.05} />
        <StatCard icon={TrendingUp} label="Readiness Score" value="78/100" trend="up" trendValue="5" iconColor="text-cyan-400" delay={0.1} />
        <StatCard icon={Star} label="Applications" value="3" sub="Submitted" iconColor="text-violet-400" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Company pipeline */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-white font-semibold">Company Drive Pipeline</h3>
          {mockCompanies.map((company, i) => {
            const isEligible = 8.55 >= company.eligibilityCGPA;
            return (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`glass rounded-xl p-4 transition-all hover:border-indigo-500/30 ${!isEligible ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600/30 to-cyan-500/20 border border-white/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{company.name}</p>
                      <p className="text-slate-500 text-xs">{company.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-semibold text-sm">{company.ctc}</p>
                    <span className={`badge text-xs mt-1 ${
                      company.status === 'upcoming' ? 'badge-blue' :
                      company.status === 'ongoing' ? 'badge-yellow' : 'badge-green'
                    }`}>
                      {company.status === 'upcoming' ? '🔵' : company.status === 'ongoing' ? '🟡' : '✅'} {company.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{company.driveDate}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{company.studentsApplied} applied</span>
                    <span>Min CGPA: {company.eligibilityCGPA}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEligible ? (
                      <span className="badge-green text-xs">Eligible</span>
                    ) : (
                      <span className="badge-red text-xs">Not Eligible</span>
                    )}
                    {company.status !== 'completed' && isEligible && (
                      <button className="nexus-btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
                        Apply <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interview tracker + prep */}
        <div className="space-y-4">
          <Card delay={0.2}>
            <h3 className="text-white font-semibold mb-4">Interview Pipeline</h3>
            <p className="text-xs text-slate-500 mb-4">Microsoft — SDE-1</p>
            <div className="space-y-3">
              {interviewStages.map((stage, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    stage.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    stage.status === 'upcoming' ? 'bg-indigo-500/20 text-indigo-400' :
                    'bg-slate-800 text-slate-600'
                  }`}>
                    {stage.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                     stage.status === 'upcoming' ? <Clock className="w-4 h-4" /> :
                     <div className="w-2 h-2 rounded-full bg-slate-600" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${stage.status === 'pending' ? 'text-slate-600' : 'text-slate-300'}`}>{stage.stage}</p>
                    <p className="text-xs text-slate-600">{stage.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card delay={0.3}>
            <h3 className="text-white font-semibold mb-3">Preparation Score</h3>
            <div className="space-y-3">
              {[
                { topic: 'Data Structures', val: 78 },
                { topic: 'Algorithms', val: 65 },
                { topic: 'System Design', val: 45 },
                { topic: 'Aptitude', val: 82 },
                { topic: 'Communication', val: 70 },
              ].map(item => (
                <div key={item.topic}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{item.topic}</span>
                    <span className="text-slate-500">{item.val}%</span>
                  </div>
                  <ProgressBar value={item.val} height="h-1.5" color="bg-gradient-to-r from-indigo-600 to-cyan-500" />
                </div>
              ))}
            </div>
            <button className="w-full mt-4 nexus-btn-primary text-sm flex items-center justify-center gap-2">
              Start Mock Interview
            </button>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
