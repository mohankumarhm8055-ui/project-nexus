import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, BookOpen, Briefcase, Shield, ArrowRight, Eye, EyeOff, Sparkles, Users, Heart } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types';

const roles = [
  { id: 'student' as UserRole, label: 'Student', icon: GraduationCap, color: 'from-indigo-600 to-cyan-500', description: 'Access your academic dashboard' },
  { id: 'faculty' as UserRole, label: 'Faculty', icon: BookOpen, color: 'from-violet-600 to-indigo-500', description: 'Manage classes and students' },
  { id: 'placement' as UserRole, label: 'Placement', icon: Briefcase, color: 'from-emerald-600 to-cyan-500', description: 'Drive placement activities' },
  { id: 'admin' as UserRole, label: 'Admin', icon: Shield, color: 'from-orange-500 to-red-500', description: 'System administration' },
  { id: 'hod' as UserRole, label: 'HOD', icon: Users, color: 'from-teal-600 to-emerald-500', description: 'Department oversight & monitoring' },
  { id: 'parent' as UserRole, label: 'Parent', icon: Heart, color: 'from-rose-600 to-pink-500', description: "Monitor your child's progress" },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    login(selectedRole);
    navigate(`/${selectedRole}`);
  };

  const selectedRoleData = roles.find(r => r.id === selectedRole)!;

  return (
    <div className="min-h-screen bg-nexus-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left — Branding */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col gap-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${selectedRoleData.color} flex items-center justify-center shadow-glow-indigo`}>
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-2xl">Nexus</span>
                <span className="text-gradient font-bold text-2xl"> Intellect</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              The AI-Powered<br />
              <span className="text-gradient">Academic OS</span>
            </h1>
            <p className="text-slate-400 mt-4 text-lg leading-relaxed">
              One intelligent platform connecting students, faculty, and institutions — guided by AI from admission to placement.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-3">
            {[
              { icon: Sparkles, text: 'AI Academic Assistant — 24/7 support' },
              { icon: GraduationCap, text: 'Predictive analytics for your growth' },
              { icon: Briefcase, text: 'Intelligent placement preparation' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — Login form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-3xl p-8"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-slate-400 text-sm mt-1">Sign in to your Nexus Intellect portal</p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Select your role</p>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3 rounded-xl border transition-all duration-200 text-left ${
                      isSelected
                        ? 'border-indigo-500/50 bg-indigo-600/15'
                        : 'border-white/5 bg-white/3 hover:border-white/15 hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center mb-2`}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className={`text-sm font-semibold ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>{role.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@nexus.edu"
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-white/20 bg-white/5" />
                <span className="text-xs text-slate-400">Remember me</span>
              </label>
              <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r ${selectedRoleData.color} text-white hover:shadow-glow-indigo hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </motion.div>
                ) : (
                  <motion.div key="signin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    Sign in to {selectedRoleData.label} Portal
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            Don't have an account?{' '}
            <button className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">Contact your administrator</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
