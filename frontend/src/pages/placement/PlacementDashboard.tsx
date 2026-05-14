import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp, CheckCircle, Target, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockCompanies, mockPlacementStudents, departmentPlacementData } from '../../utils/mockData';
import { Card, SectionHeader, StatCard, ProgressBar } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';




const placedCount = mockPlacementStudents.filter(s => s.status === 'placed').length;
const totalCount = mockPlacementStudents.length;

export default function PlacementDashboard() {

  return (
    <PageTransition>
      <SectionHeader
        title={`Placement Dashboard`}
        subtitle={`Training & Placement Cell — ${new Date().getFullYear()} Drive Season`}
        action={
          <button className="nexus-btn-primary text-sm flex items-center gap-2">
            <Target className="w-4 h-4" />
            Schedule Drive
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={CheckCircle} label="Students Placed" value={placedCount} sub={`of ${totalCount} eligible`} trend="up" trendValue="12%" iconColor="text-emerald-400" />
        <StatCard icon={Building2} label="Active Companies" value={mockCompanies.filter(c => c.status !== 'completed').length} iconColor="text-indigo-400" delay={0.05} />
        <StatCard icon={TrendingUp} label="Placement Rate" value="68.5%" trend="up" trendValue="5.2%" iconColor="text-cyan-400" delay={0.1} />
        <StatCard icon={Award} label="Highest CTC" value="₹42 LPA" sub="Google — CSE" iconColor="text-violet-400" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Dept-wise bar chart */}
        <Card delay={0.2} className="lg:col-span-2">
          <h3 className="text-white font-semibold mb-4">Department-wise Placement Rate</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={departmentPlacementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2A4A" vertical={false} />
              <XAxis dataKey="dept" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0E1228', border: '1px solid #1E2A4A', borderRadius: '12px', color: '#F8FAFC', fontSize: 12 }}
                formatter={(val) => [`${val}%`, 'Placement Rate']} />
              <Bar dataKey="percent" fill="url(#deptGrad)" radius={[6, 6, 0, 0]} name="Placement %" />
              <defs>
                <linearGradient id="deptGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Placed vs Not placed Pie */}
        <Card delay={0.25}>
          <h3 className="text-white font-semibold mb-4">Overall Status</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={[
                { name: 'Placed', value: placedCount },
                { name: 'In Process', value: mockPlacementStudents.filter(s => s.status === 'in_process').length },
                { name: 'Not Placed', value: mockPlacementStudents.filter(s => s.status === 'not_placed').length },
              ]} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                {['#10B981', '#4F46E5', '#EF4444'].map((color, i) => (
                  <Cell key={i} fill={color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0E1228', border: '1px solid #1E2A4A', borderRadius: '12px', color: '#F8FAFC', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {[
              { label: 'Placed', val: placedCount, color: 'bg-emerald-500' },
              { label: 'In Process', val: mockPlacementStudents.filter(s => s.status === 'in_process').length, color: 'bg-indigo-500' },
              { label: 'Not Placed', val: mockPlacementStudents.filter(s => s.status === 'not_placed').length, color: 'bg-red-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-full ${item.color}`} /><span className="text-slate-400">{item.label}</span></div>
                <span className="text-white font-semibold">{item.val}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Student table */}
        <Card delay={0.3} className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Top Students by Placement Score</h3>
            <button className="nexus-btn-ghost text-xs flex items-center gap-1"><Users className="w-3 h-3" />View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Name', 'Roll No', 'Dept', 'CGPA', 'Score', 'Top Skills', 'Status'].map(h => (
                    <th key={h} className="text-left text-xs text-slate-500 font-semibold pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/3">
                {mockPlacementStudents.map((student, i) => (
                  <motion.tr key={student.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
                    className="hover:bg-white/3 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">{student.name[0]}</div>
                        <span className="text-sm text-slate-200 font-medium">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-500 font-mono">{student.rollNumber}</td>
                    <td className="py-3 pr-4"><span className="badge-blue text-xs">{student.department}</span></td>
                    <td className="py-3 pr-4 text-sm font-semibold text-white">{student.cgpa}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={student.placementScore} height="h-1.5" color="bg-gradient-to-r from-indigo-600 to-cyan-500" />
                        <span className="text-xs text-slate-400 w-6">{student.placementScore}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex gap-1 flex-wrap">
                        {student.skills.slice(0, 2).map(skill => (
                          <span key={skill} className="badge-purple text-xs">{skill}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={student.status === 'placed' ? 'badge-green text-xs' : student.status === 'in_process' ? 'badge-yellow text-xs' : 'badge-red text-xs'}>
                        {student.status === 'placed' ? `✓ ${student.offeredCompany}` : student.status === 'in_process' ? '⏳ In Process' : '✗ Not Placed'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
