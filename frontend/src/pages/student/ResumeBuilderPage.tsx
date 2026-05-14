import { SectionHeader } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { FileText, Download, Eye } from 'lucide-react';

export default function ResumeBuilderPage() {
  return (
    <PageTransition>
      <SectionHeader title="AI Resume Builder" subtitle="Create an ATS-optimized resume powered by Nexus AI" action={
        <div className="flex gap-2">
          <button className="nexus-btn-ghost text-sm flex items-center gap-2"><Eye className="w-4 h-4" />Preview</button>
          <button className="nexus-btn-primary text-sm flex items-center gap-2"><Download className="w-4 h-4" />Export PDF</button>
        </div>
      } />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {['Personal Info', 'Education', 'Technical Skills', 'Projects', 'Experience', 'Certifications'].map(section => (
            <div key={section} className="glass rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-400" />{section}</h3>
              <p className="text-slate-500 text-sm">Click to expand and fill in your {section.toLowerCase()} details.</p>
            </div>
          ))}
        </div>
        <div className="glass rounded-2xl p-6 flex items-center justify-center min-h-[600px]">
          <div className="text-center text-slate-600">
            <FileText className="w-12 h-12 mx-auto mb-4 text-slate-700" />
            <p className="text-sm">Your resume preview will appear here</p>
            <p className="text-xs mt-1">Fill in the sections on the left to get started</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
