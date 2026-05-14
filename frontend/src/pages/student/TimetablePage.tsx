
import { SectionHeader } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { Calendar } from 'lucide-react';

const schedule = [
  { day: 'Monday', classes: [
    { time: '09:00', subject: 'Data Structures & Algorithms', room: 'Lab 3A', type: 'Lab', color: 'border-indigo-500 bg-indigo-500/10' },
    { time: '11:00', subject: 'Machine Learning', room: 'LH-201', type: 'Lecture', color: 'border-violet-500 bg-violet-500/10' },
    { time: '14:00', subject: 'Computer Networks', room: 'LH-104', type: 'Lecture', color: 'border-cyan-500 bg-cyan-500/10' },
  ]},
  { day: 'Tuesday', classes: [
    { time: '10:00', subject: 'Database Management Systems', room: 'LH-202', type: 'Lecture', color: 'border-emerald-500 bg-emerald-500/10' },
    { time: '14:00', subject: 'Web Technologies', room: 'Lab 2B', type: 'Lab', color: 'border-amber-500 bg-amber-500/10' },
  ]},
  { day: 'Wednesday', classes: [
    { time: '09:00', subject: 'Operating Systems', room: 'LH-103', type: 'Lecture', color: 'border-rose-500 bg-rose-500/10' },
    { time: '11:00', subject: 'Data Structures & Algorithms', room: 'LH-201', type: 'Lecture', color: 'border-indigo-500 bg-indigo-500/10' },
  ]},
  { day: 'Thursday', classes: [
    { time: '09:00', subject: 'Machine Learning', room: 'Lab 4C', type: 'Lab', color: 'border-violet-500 bg-violet-500/10' },
    { time: '14:00', subject: 'Computer Networks', room: 'LH-104', type: 'Lecture', color: 'border-cyan-500 bg-cyan-500/10' },
  ]},
  { day: 'Friday', classes: [
    { time: '10:00', subject: 'Database Management Systems', room: 'LH-201', type: 'Lecture', color: 'border-emerald-500 bg-emerald-500/10' },
    { time: '11:00', subject: 'Operating Systems', room: 'LH-103', type: 'Lecture', color: 'border-rose-500 bg-rose-500/10' },
    { time: '14:00', subject: 'Web Technologies', room: 'LH-104', type: 'Lecture', color: 'border-amber-500 bg-amber-500/10' },
  ]},
];

export default function TimetablePage() {
  return (
    <PageTransition>
      <SectionHeader title="Timetable" subtitle="Your weekly class schedule — Semester 6" />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {schedule.map((day) => (
          <div key={day.day} className="glass rounded-2xl p-4">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              {day.day}
            </h3>
            <div className="space-y-2">
              {day.classes.map((cls, i) => (
                <div key={i} className={`rounded-xl p-3 border-l-2 ${cls.color}`}>
                  <p className="text-xs text-slate-500">{cls.time}</p>
                  <p className="text-white text-xs font-semibold mt-0.5 leading-tight">{cls.subject}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-600">{cls.room}</span>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${cls.type === 'Lab' ? 'bg-violet-500/20 text-violet-400' : 'bg-indigo-500/20 text-indigo-400'}`}>{cls.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
