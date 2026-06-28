import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Brain, RotateCcw, ChevronRight, Check, X, Sparkles, BookOpen, Lightbulb, Layers } from 'lucide-react';
import { fetchFromEdge } from '../lib/supabase';

interface Flashcard {
  id: string;
  topic: string;
  question: string;
  answer: string;
  difficulty: string;
  tags: string[];
}

export function ExamMode() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(true);
  const [studyMode, setStudyMode] = useState<'flashcards' | 'mindmap' | 'notes'>('flashcards');
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      setLoading(true);
      const data = await fetchFromEdge('/flashcards');
      setFlashcards(data.flashcards || []);
    } catch (e) {
      console.error('Failed to load flashcards:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!topic) return;
    try {
      setLoading(true);
      const data = await fetchFromEdge(`/flashcards?topic=${encodeURIComponent(topic)}`);
      setFlashcards(data.flashcards || []);
      setCurrentIndex(0);
      setShowAnswer(false);
      setKnownCards(new Set());
      setUnknownCards(new Set());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleKnown = () => {
    if (flashcards[currentIndex]) {
      setKnownCards(prev => new Set(prev).add(flashcards[currentIndex].id));
    }
    nextCard();
  };

  const handleUnknown = () => {
    if (flashcards[currentIndex]) {
      setUnknownCards(prev => new Set(prev).add(flashcards[currentIndex].id));
    }
    nextCard();
  };

  const nextCard = () => {
    setShowAnswer(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(c => c + 1);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setKnownCards(new Set());
    setUnknownCards(new Set());
  };

  const topics = [...new Set(flashcards.map(f => f.topic))];
  const currentCard = flashcards[currentIndex];
  const progress = flashcards.length > 0 ? ((currentIndex + (showAnswer ? 1 : 0)) / flashcards.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <FileText className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-400" />
          One-Click Exam Mode
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Instant revision with flashcards, mind maps, and notes
        </p>
      </div>

      {/* Search */}
      <div className="glass-card p-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic for revision..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary/50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl font-medium flex items-center gap-2 hover:bg-blue-500/30 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Generate
          </motion.button>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {topics.map(t => (
            <button
              key={t}
              onClick={() => { setTopic(t); handleSearch(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${topic === t ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
        {[
          { id: 'flashcards' as const, label: 'Flashcards', icon: Layers },
          { id: 'mindmap' as const, label: 'Mind Map', icon: Brain },
          { id: 'notes' as const, label: 'Revision Notes', icon: BookOpen },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setStudyMode(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${studyMode === tab.id ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white'}`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {studyMode === 'flashcards' && currentCard && (
          <motion.div key="flashcards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto space-y-6">
            {/* Progress */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Card {currentIndex + 1} of {flashcards.length}</span>
              <div className="flex gap-3">
                <span className="text-green-400">{knownCards.size} known</span>
                <span className="text-red-400">{unknownCards.size} review</span>
              </div>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
            </div>

            {/* Card */}
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-8 min-h-[280px] flex flex-col items-center justify-center text-center cursor-pointer"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full mb-4">{currentCard.difficulty}</span>
              <h3 className="text-xl font-semibold text-white mb-4">{currentCard.question}</h3>
              <AnimatePresence>
                {showAnswer && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <p className="text-green-400 font-medium">{currentCard.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {!showAnswer && <p className="text-xs text-slate-500 mt-4">Tap to reveal answer</p>}
            </motion.div>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleUnknown} className="flex-1 py-3 bg-red-500/20 text-red-400 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-500/30 transition-colors">
                <X className="w-4 h-4" />
                Need Review
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleKnown} className="flex-1 py-3 bg-green-500/20 text-green-400 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-500/30 transition-colors">
                <Check className="w-4 h-4" />
                Got It!
              </motion.button>
            </div>

            {currentIndex >= flashcards.length - 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 text-center">
                <Brain className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Revision Complete!</h3>
                <p className="text-slate-400 text-sm mb-4">{knownCards.size} cards mastered, {unknownCards.size} need more practice</p>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={reset} className="px-6 py-2 bg-primary text-white rounded-xl font-medium flex items-center gap-2 mx-auto">
                  <RotateCcw className="w-4 h-4" />
                  Review Again
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {studyMode === 'mindmap' && (
          <motion.div key="mindmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-primary" /> Concept Mind Map</h3>
            <div className="relative h-96 bg-white/5 rounded-xl overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 600 400" className="w-full h-full">
                <circle cx="300" cy="200" r="60" fill="#4F46E5" opacity="0.3" />
                <text x="300" y="205" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">{topic || 'Topic'}</text>
                {flashcards.slice(0, 6).map((card, i) => {
                  const angle = (i / 6) * 2 * Math.PI - Math.PI / 2;
                  const x = 300 + 180 * Math.cos(angle);
                  const y = 200 + 120 * Math.sin(angle);
                  return (
                    <g key={card.id}>
                      <line x1="300" y1="200" x2={x} y2={y} stroke="#4F46E5" strokeWidth="2" opacity="0.5" />
                      <circle cx={x} cy={y} r="45" fill="#1E293B" stroke="#4F46E5" strokeWidth="1" />
                      <text x={x} y={y - 5} textAnchor="middle" fill="#94A3B8" fontSize="10">{card.question.substring(0, 30)}...</text>
                      <text x={x} y={y + 10} textAnchor="middle" fill="#22C55E" fontSize="9">{card.answer.substring(0, 25)}...</text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">Interactive mind map showing connections between concepts</p>
          </motion.div>
        )}

        {studyMode === 'notes' && (
          <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {flashcards.map((card, i) => (
              <motion.div key={card.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium mb-1">{card.question}</p>
                    <p className="text-green-400 text-sm">{card.answer}</p>
                    <div className="flex gap-2 mt-2">
                      {card.tags?.map((tag, j) => (
                        <span key={j} className="px-2 py-0.5 bg-white/5 text-slate-400 text-xs rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {flashcards.length === 0 && <div className="text-center text-slate-500 py-8">No revision notes available. Search for a topic above.</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
