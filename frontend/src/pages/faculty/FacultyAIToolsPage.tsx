import { SectionHeader } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { Brain, Sparkles, BookOpen, HelpCircle } from 'lucide-react';

const tools = [
  { icon: Sparkles, name: 'AI Question Paper Generator', description: 'Generate exam papers with AI — set difficulty, topics, and question types.', color: 'text-indigo-400', bg: 'bg-indigo-500/15' },
  { icon: BookOpen, name: 'Lesson Plan Creator', description: 'Auto-generate structured lesson plans for any topic in seconds.', color: 'text-violet-400', bg: 'bg-violet-500/15' },
  { icon: HelpCircle, name: 'Quiz Generator', description: 'Create interactive quizzes with MCQs, fill-in-the-blanks, and short answers.', color: 'text-cyan-400', bg: 'bg-cyan-500/15' },
  { icon: Brain, name: 'Student Risk Predictor', description: 'AI identifies at-risk students based on attendance, marks, and behavior patterns.', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
];

export default function FacultyAIToolsPage() {
  return (
    <PageTransition>
      <SectionHeader title="AI Faculty Tools" subtitle="Supercharge your teaching with intelligent AI capabilities" />
      <div className="grid lg:grid-cols-2 gap-6">
        {tools.map((tool, i) => (
          <div key={i} className="glass rounded-2xl p-6 hover:border-indigo-500/30 transition-all cursor-pointer group">
            <div className={`w-12 h-12 rounded-2xl ${tool.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <tool.icon className={`w-6 h-6 ${tool.color}`} />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">{tool.name}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{tool.description}</p>
            <button className="mt-4 nexus-btn-primary text-sm">Launch Tool</button>
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
