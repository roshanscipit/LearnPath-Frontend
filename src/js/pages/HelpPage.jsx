import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { helpApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

const statusConfig = {
  OPEN:        { label: 'Open',        color: 'bg-red-100 text-red-700',    icon: <AlertCircle className="w-3 h-3" /> },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-3 h-3" /> },
  RESOLVED:    { label: 'Resolved',    color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
};

const HelpPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [subject,  setSubject]  = useState('');
  const [message,  setMessage]  = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  // FAQs
  const faqs = [
    { q: 'How do I reset my progress?', a: 'Go to your Profile page and click "Reset Progress". This will clear your learning path data.' },
    { q: 'Can I cancel a booking?', a: 'Yes! Go to your Profile → Bookings tab and click "Cancel" on any confirmed booking.' },
    { q: 'How do I access paid courses after purchase?', a: 'After booking, the session link will be shared via email 24 hours before your session.' },
    { q: 'What payment methods are accepted?', a: 'We accept UPI, credit/debit cards, and net banking via our secure payment gateway.' },
    { q: 'How long does it take to get a response?', a: 'Our team typically responds within 24–48 hours on working days.' },
  ];
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      try {
        const data = await helpApi.myComplaints();
        setComplaints(data);
      } catch {
        // silently fail – history is a bonus
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      const newComplaint = await helpApi.submit(subject.trim(), message.trim());
      setComplaints(prev => [newComplaint, ...prev]);
      setSubject('');
      setMessage('');
      toast({
        title: '✅ Message sent!',
        description: 'We received your message and will get back to you soon.',
      });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-500 mt-2">Have a question or issue? We're here to help.</p>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b">
            <h2 className="font-semibold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <div key={i} className="px-6">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-medium text-gray-800 text-sm">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <p className="text-gray-600 text-sm pb-4 leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b">
            <h2 className="font-semibold text-gray-900">Send us a message</h2>
            <p className="text-gray-500 text-sm mt-1">
              {user ? 'Describe your issue below and we\'ll respond as soon as possible.' : 'Please log in to submit a support request.'}
            </p>
          </div>

          {user ? (
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Issue with booking, Course not loading…"
                  required
                  maxLength={120}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Please describe your issue in detail. Include any error messages you saw, steps to reproduce, and what you expected to happen."
                  required
                  rows={5}
                  maxLength={2000}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{message.length}/2000</p>
              </div>
              <button
                type="submit"
                disabled={submitting || !subject.trim() || !message.trim()}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-gray-500 mb-4">You need to be logged in to send a support request.</p>
              <a href="/login" className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 inline-block">
                Log In
              </a>
            </div>
          )}
        </div>

        {/* My Past Requests */}
        {user && (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b">
              <h2 className="font-semibold text-gray-900">My Support Requests</h2>
            </div>

            {loadingHistory ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : complaints.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">You haven't submitted any requests yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {complaints.map(c => {
                  const cfg = statusConfig[c.status] || statusConfig.OPEN;
                  const isExpanded = expandedId === c.id;
                  return (
                    <div key={c.id} className="px-6 py-4">
                      <div
                        className="flex items-start justify-between cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : c.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{c.subject}</p>
                          <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {c.createdAt ? new Date(c.createdAt).toLocaleString() : '—'}
                          </p>
                        </div>
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ml-3 flex-shrink-0 ${cfg.color}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>
                      {isExpanded && (
                        <div className="mt-3 bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
                          {c.message}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpPage;
