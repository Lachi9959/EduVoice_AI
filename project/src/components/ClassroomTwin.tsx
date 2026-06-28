import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Play, BookOpen, HelpCircle, Lightbulb, ChevronRight, Search, RotateCcw, Volume2 } from 'lucide-react';
import { fetchFromEdge } from '../lib/supabase';
import { Diagram } from './Diagram';
import { useSpeech } from '../hooks/useSpeech';
import type { Language } from '../types';
import { LanguageSelector } from './LanguageSelector';

interface Lesson {
  id: string;
  topic: string;
  grade: string;
  explanation_en: string;
  explanation_hi: string;
  explanation_hinglish: string;
  key_points: any[];
  fun_example: any;
  diagram_type: string;
  created_at: string;
}

export function ClassroomTwin() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'explanation' | 'quiz' | 'notes'>('explanation');
  const { speak } = useSpeech();

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await fetchFromEdge('/lessons');
      setLessons(data.lessons || []);
      if (data.lessons?.length > 0) setSelectedLesson(data.lessons[0]);
    } catch (e) {
      console.error('Failed to load lessons:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = lessons.filter(l =>
    l.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getExplanation = (lesson: Lesson) => {
    switch (language) {
      case 'hi': return lesson.explanation_hi || lesson.explanation_en;
      case 'hinglish': return lesson.explanation_hinglish || lesson.explanation_en;
      default: return lesson.explanation_en;
    }
  };

  const getKeyPoints = (lesson: Lesson) => {
    if (!lesson.key_points) return [];
    return lesson.key_points.map((p: any) => p[language] || p.en || '');
  };

  const getFunExample = (lesson: Lesson) => {
    if (!lesson.fun_example) return '';
    return lesson.fun_example[language] || lesson.fun_example.en || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <RotateCcw className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            AI Classroom Twin
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Replay any past lesson - explanations, diagrams, quizzes, and notes
          </p>
        </div>
        <LanguageSelector value={language} onChange={setLanguage} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lesson List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past lessons..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-hide">
            {filteredLessons.map((lesson, i) => (
              <motion.button
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => { setSelectedLesson(lesson); setActiveTab('explanation'); }}
                className={`w-full text-left p-4 rounded-xl transition-all border ${
                  selectedLesson?.id === lesson.id
                    ? 'bg-cyan-500/10 border-cyan-500/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-medium ${selectedLesson?.id === lesson.id ? 'text-cyan-400' : 'text-white'}`}>
                      {lesson.topic}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">{lesson.grade}</span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-400">
                        {new Date(lesson.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${selectedLesson?.id === lesson.id ? 'text-cyan-400' : 'text-slate-500'}`} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Lesson Replay */}
        <AnimatePresence mode="wait">
          {selectedLesson && (
            <motion.div
              key={selectedLesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:col-span-2 space-y-4"
            >
              {/* Tabs */}
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                {[
                  { id: 'explanation' as const, label: 'Explanation', icon: BookOpen },
                  { id: 'quiz' as const, label: 'Quiz Questions', icon: HelpCircle },
                  { id: 'notes' as const, label: 'Key Notes', icon: Lightbulb },
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'explanation' && (
                  <motion.div
                    key="explanation"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">{selectedLesson.topic}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => speak(getExplanation(selectedLesson))}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <Volume2 className="w-4 h-4 text-slate-400" />
                          </button>
                          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                            {selectedLesson.grade}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {getExplanation(selectedLesson)}
                      </p>
                    </div>

                    {selectedLesson.diagram_type && (
                      <div className="glass-card p-6">
                        <h4 className="text-sm font-semibold text-white mb-3">Visual Diagram</h4>
                        <div className="aspect-video bg-white/5 rounded-xl overflow-hidden">
                          <Diagram type={selectedLesson.diagram_type} />
                        </div>
                      </div>
                    )}

                    {getFunExample(selectedLesson) && (
                      <div className="glass-card p-6 border-accent/20">
                        <h4 className="text-sm font-semibold text-accent mb-2">Fun Example</h4>
                        <p className="text-slate-300 text-sm italic">
                          "{getFunExample(selectedLesson)}"
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'quiz' && (
                  <motion.div
                    key="quiz"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="glass-card p-6"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">Practice Questions</h3>
                    <div className="space-y-4">
                      {getKeyPoints(selectedLesson).map((point, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-4 bg-white/5 rounded-xl border border-white/10"
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400 flex-shrink-0">
                              {i + 1}
                            </span>
                            <div>
                              <p className="text-slate-300 text-sm">{point}</p>
                              <p className="text-xs text-slate-500 mt-1">Can you explain this in your own words?</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notes' && (
                  <motion.div
                    key="notes"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="glass-card p-6"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">Important Notes</h3>
                    <div className="space-y-3">
                      {getKeyPoints(selectedLesson).map((point, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3 p-3 bg-yellow-500/5 rounded-xl border border-yellow-500/20"
                        >
                          <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <p className="text-slate-300 text-sm">{point}</p>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Play className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium text-cyan-400">Replay Tip</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Ask "What did teacher explain about {selectedLesson.topic}?" and AI will replay this entire lesson with diagrams and explanations.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
