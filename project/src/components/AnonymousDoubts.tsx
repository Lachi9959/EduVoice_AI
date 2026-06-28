import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Mic, Send, UserX, Volume2, ThumbsUp, MessageSquare, Clock, Filter } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import { supabase } from '../lib/supabase';

interface Doubt {
  id: string;
  question: string;
  answer?: string;
  upvotes: number;
  created_at: string;
  topic?: string;
  answered: boolean;
}

export function AnonymousDoubts() {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [topic, setTopic] = useState('');
  const [filter, setFilter] = useState<'all' | 'answered' | 'unanswered'>('all');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { isListening, transcript, startListening, stopListening, speak } = useSpeech();

  useEffect(() => {
    loadDoubts();
  }, []);

  const loadDoubts = async () => {
    try {
      setLoading(true);
      // For demo, create mock data if table doesn't exist yet
      const mockDoubts: Doubt[] = [
        { id: '1', question: 'Why does the moon change shape?', answer: 'The moon does not actually change shape! It is always round. What changes is how much of the sunlit side we can see from Earth. This is called phases of the moon.', upvotes: 12, created_at: new Date(Date.now() - 3600000).toISOString(), topic: 'Solar System', answered: true },
        { id: '2', question: 'How do plants drink water without a mouth?', answer: '', upvotes: 8, created_at: new Date(Date.now() - 7200000).toISOString(), topic: 'Photosynthesis', answered: false },
        { id: '3', question: 'Why is the sky blue?', answer: 'The sky appears blue because air molecules scatter blue light more than other colors. Blue light has shorter wavelengths and gets scattered in all directions.', upvotes: 15, created_at: new Date(Date.now() - 10800000).toISOString(), topic: 'Light', answered: true },
        { id: '4', question: 'What happens if we do not have gravity?', answer: '', upvotes: 5, created_at: new Date(Date.now() - 14400000).toISOString(), topic: 'Gravity', answered: false },
        { id: '5', question: 'How does a rainbow form?', answer: 'Rainbows form when sunlight passes through water droplets in the air. The light bends (refracts), reflects inside the droplet, and bends again as it exits, splitting into colors.', upvotes: 20, created_at: new Date(Date.now() - 18000000).toISOString(), topic: 'Light', answered: true },
      ];
      setDoubts(mockDoubts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newQuestion.trim()) return;
    try {
      setSending(true);
      const newDoubt: Doubt = {
        id: Date.now().toString(),
        question: newQuestion,
        upvotes: 0,
        created_at: new Date().toISOString(),
        topic: topic || 'General',
        answered: false,
      };
      setDoubts(prev => [newDoubt, ...prev]);
      setNewQuestion('');
      setTopic('');
    } finally {
      setSending(false);
    }
  };

  const handleUpvote = (id: string) => {
    setDoubts(prev => prev.map(d => d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d));
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      if (transcript) setNewQuestion(transcript);
    } else {
      startListening();
    }
  };

  const filteredDoubts = doubts.filter(d => {
    if (filter === 'answered') return d.answered;
    if (filter === 'unanswered') return !d.answered;
    return true;
  });

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <MessageCircle className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <UserX className="w-6 h-6 text-indigo-400" />
          Anonymous Voice Doubts
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Students can ask questions through voice without revealing identity, encouraging participation
        </p>
      </div>

      {/* Submit Area */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <UserX className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-sm text-indigo-400 font-medium">Anonymous Mode Active</span>
        </div>

        <div className="flex gap-3 mb-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic (e.g., Photosynthesis)"
            className="w-32 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 text-sm"
          />
          <div className="flex-1 relative">
            <textarea
              value={isListening ? transcript : newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Ask your doubt anonymously... (or use voice)"
              className="w-full h-20 bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 resize-none text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVoiceInput}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isListening ? 'bg-red-500/20 border border-red-500' : 'bg-indigo-500/20 border border-indigo-500/30'
              }`}
            >
              <Mic className={`w-4 h-4 ${isListening ? 'text-red-400' : 'text-indigo-400'}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={sending || !newQuestion.trim()}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center disabled:opacity-30"
            >
              <Send className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'unanswered', 'answered'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === f
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Doubts List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredDoubts.map((doubt, i) => (
            <motion.div
              key={doubt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-400 text-xs font-bold">?</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {doubt.topic && (
                      <span className="px-2 py-0.5 bg-white/5 text-slate-400 text-xs rounded-full">
                        {doubt.topic}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {formatTime(doubt.created_at)}
                    </span>
                    {doubt.answered && (
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full">
                        Answered
                      </span>
                    )}
                  </div>
                  <p className="text-white text-sm mb-3">{doubt.question}</p>

                  {doubt.answer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3 bg-green-500/5 rounded-xl border border-green-500/20 mb-3"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-xs text-green-400 font-medium">Teacher's Answer</span>
                      </div>
                      <p className="text-slate-300 text-sm">{doubt.answer}</p>
                    </motion.div>
                  )}

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleUpvote(doubt.id)}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {doubt.upvotes} students have this doubt
                    </button>
                    {doubt.answer && (
                      <button
                        onClick={() => speak(doubt.answer!)}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        Listen
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredDoubts.length === 0 && (
          <div className="text-center text-slate-500 py-8">
            <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No doubts yet. Be the first to ask!</p>
          </div>
        )}
      </div>
    </div>
  );
}
