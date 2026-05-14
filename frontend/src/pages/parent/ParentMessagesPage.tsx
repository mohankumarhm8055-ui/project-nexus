import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, TrendingUp, DollarSign, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { SectionHeader, Card } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { parentNotifications } from '../../utils/mockData';
import type { ParentNotification } from '../../types';

type FilterType = 'all' | 'attendance' | 'marks' | 'fee' | 'general' | 'emergency';

const typeIcon = (type: ParentNotification['type']) => {
  if (type === 'attendance') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
  if (type === 'marks') return <TrendingUp className="w-4 h-4 text-indigo-400" />;
  if (type === 'fee') return <DollarSign className="w-4 h-4 text-rose-400" />;
  if (type === 'emergency') return <Bell className="w-4 h-4 text-red-400" />;
  return <Info className="w-4 h-4 text-teal-400" />;
};

const typeBg = (type: ParentNotification['type']) => {
  if (type === 'attendance') return 'bg-amber-500/15';
  if (type === 'marks') return 'bg-indigo-500/15';
  if (type === 'fee') return 'bg-rose-500/15';
  if (type === 'emergency') return 'bg-red-500/15';
  return 'bg-teal-500/15';
};

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'marks', label: 'Marks' },
  { id: 'fee', label: 'Fee' },
  { id: 'general', label: 'General' },
];

export default function ParentMessagesPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [read, setRead] = useState<string[]>(parentNotifications.filter(n => n.read).map(n => n.id));

  const filtered = filter === 'all' ? parentNotifications : parentNotifications.filter(n => n.type === filter);
  const unreadCount = parentNotifications.filter(n => !read.includes(n.id)).length;

  const toggle = (id: string) => {
    setExpanded(prev => prev === id ? null : id);
    if (!read.includes(id)) setRead(prev => [...prev, id]);
  };

  return (
    <PageTransition>
      <SectionHeader
        title="Message Inbox"
        subtitle="Notifications and alerts from your child's institution"
        action={unreadCount > 0 ? <span className="badge-red">{unreadCount} unread</span> : undefined}
      />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filter === f.id ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40' : 'glass text-slate-400 hover:text-white'}`}>
            {f.label}
            {f.id !== 'all' && (
              <span className="ml-1.5 text-slate-600">({parentNotifications.filter(n => n.type === f.id).length})</span>
            )}
          </button>
        ))}
      </div>

      <Card delay={0}>
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((notif, i) => {
              const isRead = read.includes(notif.id);
              const isOpen = expanded === notif.id;
              return (
                <motion.div key={notif.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <button onClick={() => toggle(notif.id)} className={`w-full text-left p-4 rounded-xl transition-all ${!isRead ? 'bg-white/6 border border-white/10' : 'hover:bg-white/4'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl ${typeBg(notif.type)} flex items-center justify-center flex-shrink-0`}>
                        {typeIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm font-semibold leading-snug ${!isRead ? 'text-white' : 'text-slate-300'}`}>{notif.title}</p>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!isRead && <div className="w-2 h-2 rounded-full bg-rose-500" />}
                            {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{notif.time} · From: {notif.from}</p>
                        {!isOpen && <p className="text-xs text-slate-600 mt-1 truncate">{notif.message}</p>}
                      </div>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                          className="overflow-hidden ml-12 mt-3">
                          <p className="text-sm text-slate-300 leading-relaxed">{notif.message}</p>
                          <div className="flex gap-2 mt-3">
                            <button className="nexus-btn-ghost text-xs px-3 py-1.5">Acknowledge</button>
                            <button className="text-xs px-3 py-1.5 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30 transition-colors">Reply to Institution</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-600">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No messages in this category</p>
            </div>
          )}
        </div>
      </Card>
    </PageTransition>
  );
}
