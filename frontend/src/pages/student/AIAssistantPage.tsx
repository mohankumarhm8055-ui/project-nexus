import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, Sparkles, BookOpen, BarChart3, Briefcase, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import type { AIMessage } from '../../types';
import { aiResponses } from '../../utils/mockData';
import PageTransition from '../../components/layout/PageTransition';
import { SectionHeader } from '../../components/ui';

const suggestions = [
  { icon: BarChart3, text: 'Analyze my attendance', key: 'attendance' },
  { icon: BookOpen, text: 'Explain Binary Search Trees', key: 'default' },
  { icon: Briefcase, text: 'How is my placement readiness?', key: 'placement' },
  { icon: Sparkles, text: 'Show my CGPA trend', key: 'cgpa' },
];

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          className="w-2 h-2 rounded-full bg-indigo-400"
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg }: { msg: AIMessage }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (msg.role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[75%] bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm">
          {msg.content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-3 group"
    >
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-glow-indigo">
        <Brain className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-200 leading-relaxed whitespace-pre-line">
          {msg.content}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 mt-1 text-xs text-slate-600 hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all"
        >
          {copied ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </motion.div>
  );
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: aiResponses.default,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    const lowerText = text.toLowerCase();
    let response = aiResponses.default;
    if (lowerText.includes('attendance')) response = aiResponses.attendance;
    else if (lowerText.includes('cgpa') || lowerText.includes('gpa') || lowerText.includes('marks')) response = aiResponses.cgpa;
    else if (lowerText.includes('placement') || lowerText.includes('job') || lowerText.includes('career')) response = aiResponses.placement;
    else if (lowerText.includes('hello') || lowerText.includes('hi')) response = aiResponses.hello;

    const aiMsg: AIMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiMsg]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <PageTransition>
      <SectionHeader
        title="AI Academic Assistant"
        subtitle="Your intelligent study companion — available 24/7"
        action={
          <button
            onClick={() => setMessages([{ id: '0', role: 'assistant', content: aiResponses.default, timestamp: new Date() }])}
            className="nexus-btn-ghost text-sm flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            New Chat
          </button>
        }
      />

      <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar suggestions */}
        <div className="lg:col-span-1 space-y-3">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Quick Prompts</p>
          {suggestions.map(({ icon: Icon, text, key }) => (
            <button
              key={key}
              onClick={() => sendMessage(text)}
              className="w-full glass rounded-xl p-3 text-left hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group"
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-xs text-slate-300 group-hover:text-white transition-colors leading-relaxed">{text}</p>
            </button>
          ))}

          <div className="glass rounded-xl p-4 mt-4">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">AI Capabilities</p>
            <div className="space-y-2">
              {['Explain concepts', 'Generate quizzes', 'Analyze performance', 'Study planning', 'Doubt solving', 'PDF summaries'].map(cap => (
                <div key={cap} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span className="text-xs text-slate-400">{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="lg:col-span-3 flex flex-col glass rounded-2xl overflow-hidden">
          {/* Chat header */}
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center ai-glow">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Nexus AI</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
                <span className="text-xs text-emerald-400">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-sm">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask anything — concepts, quizzes, study plans, performance analysis..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="nexus-btn-primary px-4 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
