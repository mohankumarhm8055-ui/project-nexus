import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, Mail, Smartphone, Bell, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, SectionHeader } from '../../components/ui';
import PageTransition from '../../components/layout/PageTransition';
import { communicationLogs } from '../../utils/mockData';

const TEMPLATES = [
  'Attendance Warning Alert',
  'Internal Marks Published',
  'Exam Schedule Reminder',
  'Fee Payment Due',
  'Assignment Deadline',
  'Emergency Notice',
  'General Announcement',
];

const RECIPIENTS = [
  'All Parents — CSE Dept.',
  'All Students — Semester 6',
  'At-Risk Students (34)',
  'High-Risk Students (11)',
  'Specific Student / Parent',
  'Fee Defaulters (12)',
];

type Channel = 'sms' | 'whatsapp' | 'email' | 'push';

export default function HODCommunicationCenter() {
  const [channel, setChannel] = useState<Channel>('whatsapp');
  const [recipient, setRecipient] = useState(RECIPIENTS[0]);
  const [template, setTemplate] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1800));
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setMessage('');
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'delivered') return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
    if (status === 'pending') return <Clock className="w-3.5 h-3.5 text-amber-400" />;
    return <XCircle className="w-3.5 h-3.5 text-red-400" />;
  };

  const ChannelIcon = ({ type }: { type: string }) => {
    if (type === 'sms') return <Smartphone className="w-3.5 h-3.5" />;
    if (type === 'whatsapp') return <MessageSquare className="w-3.5 h-3.5" />;
    if (type === 'email') return <Mail className="w-3.5 h-3.5" />;
    return <Bell className="w-3.5 h-3.5" />;
  };

  const channels: { id: Channel; label: string; icon: typeof Send }[] = [
    { id: 'sms', label: 'SMS', icon: Smartphone },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'push', label: 'Push', icon: Bell },
  ];

  return (
    <PageTransition>
      <SectionHeader title="Communication Center" subtitle="Multi-channel parent and student notification system" />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Compose Panel */}
        <Card delay={0} className="lg:col-span-2">
          <h3 className="text-white font-semibold mb-5">Compose Message</h3>

          {/* Channel Selector */}
          <div className="mb-4">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Send Via</p>
            <div className="flex gap-2">
              {channels.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setChannel(id)}
                  className={channel === id ? 'channel-btn-active' : 'channel-btn'}>
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-semibold">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recipient */}
          <div className="mb-4">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Recipients</p>
            <select value={recipient} onChange={e => setRecipient(e.target.value)}
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-teal-500/50 transition-all">
              {RECIPIENTS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Template */}
          <div className="mb-4">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Template (Optional)</p>
            <select value={template} onChange={e => { setTemplate(e.target.value); setMessage(e.target.value ? `[${e.target.value}] ` : ''); }}
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-teal-500/50 transition-all">
              <option value="">— Select a template —</option>
              {TEMPLATES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Message */}
          <div className="mb-5">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Message</p>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Type your message to parents/students..."
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 resize-none transition-all" />
            <p className="text-xs text-slate-600 mt-1">{message.length} characters</p>
          </div>

          <div className="flex gap-3">
            <button className="nexus-btn-ghost text-sm">Schedule Later</button>
            <button onClick={handleSend} disabled={!message.trim() || sending}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl transition-all ${sent ? 'bg-emerald-600 text-white' : 'nexus-btn-teal'} disabled:opacity-50`}>
              {sending ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                : sent ? <>✓ Sent Successfully</>
                  : <><Send className="w-4 h-4" />Send Now — {recipient}</>}
            </button>
          </div>
        </Card>

        {/* Sent Log */}
        <Card delay={0.1}>
          <h3 className="text-white font-semibold mb-4">Sent Log</h3>
          <div className="space-y-3">
            {communicationLogs.map((log, i) => (
              <motion.div key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.05 }}
                className="p-3 glass rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <ChannelIcon type={log.type} />
                    <span className="capitalize font-medium">{log.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusIcon status={log.status} />
                    <span className={`text-xs font-medium capitalize ${log.status === 'delivered' ? 'text-emerald-400' : log.status === 'pending' ? 'text-amber-400' : 'text-red-400'}`}>{log.status}</span>
                  </div>
                </div>
                <p className="text-xs text-white font-medium truncate">{log.recipient}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{log.message}</p>
                <p className="text-xs text-slate-700 mt-1">{log.sentAt}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
