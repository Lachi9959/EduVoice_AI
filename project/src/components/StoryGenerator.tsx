import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, Volume2, Sparkles, Wand2 } from 'lucide-react';
import { fetchFromEdge } from '../lib/supabase';
import { useSpeech } from '../hooks/useSpeech';
import type { Language } from '../types';
import { LanguageSelector } from './LanguageSelector';

interface Story {
  id: string;
  topic: string;
  title: string;
  content: StoryPanel[];
  characters: StoryCharacter[];
  moral: string;
}

interface StoryPanel {
  panel: number;
  text: string;
  scene: string;
}

interface StoryCharacter {
  name: string;
  role: string;
  avatar: string;
}

export function StoryGenerator() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentPanel, setCurrentPanel] = useState(0);
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState('');
  const { speak } = useSpeech();

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      const data = await fetchFromEdge('/stories');
      setStories(data.stories || []);
      if (data.stories?.length > 0) setSelectedStory(data.stories[0]);
    } catch (e) {
      console.error('Failed to load stories:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    if (!topic) return;
    // In real app, call AI API to generate story
    const matched = stories.find(s => s.topic.toLowerCase().includes(topic.toLowerCase()));
    if (matched) {
      setSelectedStory(matched);
      setCurrentPanel(0);
    }
  };

  const getPanelText = (text: string) => {
    // Simple translation mock - in real app use API
    return text;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  const panels = selectedStory?.content || [];
  const characters = selectedStory?.characters || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-orange-400" />
            AI Story Generator
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Comics and animated stories that make concepts unforgettable
          </p>
        </div>
        <LanguageSelector value={language} onChange={setLanguage} />
      </div>

      {/* Topic Input */}
      <div className="glass-card p-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g., Gravity, Photosynthesis)..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary/50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerate}
            className="px-6 py-3 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-xl font-medium flex items-center gap-2 hover:bg-orange-500/30 transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            Generate Story
          </motion.button>
        </div>

        {/* Quick topics */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {stories.map(s => (
            <button
              key={s.id}
              onClick={() => { setSelectedStory(s); setCurrentPanel(0); setTopic(s.topic); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedStory?.id === s.id
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {s.topic}
            </button>
          ))}
        </div>
      </div>

      {/* Comic Story Viewer */}
      <AnimatePresence mode="wait">
        {selectedStory && (
          <motion.div
            key={selectedStory.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Story Title & Characters */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{selectedStory.title}</h3>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                  {selectedStory.topic}
                </span>
              </div>

              {/* Characters */}
              <div className="flex gap-4 mb-4">
                {characters.map((char, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl"
                  >
                    <span className="text-2xl">{char.avatar}</span>
                    <div>
                      <div className="text-sm font-medium text-white">{char.name}</div>
                      <div className="text-xs text-slate-400">{char.role}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Comic Panels */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-400">
                  Panel {currentPanel + 1} of {panels.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => speak(panels[currentPanel]?.text || '')}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Volume2 className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPanel}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Scene visualization */}
                  <div className="aspect-video bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      {panels[currentPanel]?.scene.includes('apple') && (
                        <div className="flex items-center justify-center h-full text-8xl">🍎</div>
                      )}
                      {panels[currentPanel]?.scene.includes('tree') && (
                        <div className="flex items-center justify-center h-full text-8xl">🌳</div>
                      )}
                      {panels[currentPanel]?.scene.includes('Earth') && (
                        <div className="flex items-center justify-center h-full text-8xl">🌍</div>
                      )}
                      {panels[currentPanel]?.scene.includes('leaf') && (
                        <div className="flex items-center justify-center h-full text-8xl">🍃</div>
                      )}
                      {panels[currentPanel]?.scene.includes('Sun') && (
                        <div className="flex items-center justify-center h-full text-8xl">☀️</div>
                      )}
                      {panels[currentPanel]?.scene.includes('Ocean') && (
                        <div className="flex items-center justify-center h-full text-8xl">🌊</div>
                      )}
                      {panels[currentPanel]?.scene.includes('Cloud') && (
                        <div className="flex items-center justify-center h-full text-8xl">☁️</div>
                      )}
                      {panels[currentPanel]?.scene.includes('factory') && (
                        <div className="flex items-center justify-center h-full text-8xl">🏭</div>
                      )}
                    </div>
                    <div className="relative z-10 text-center px-8">
                      <p className="text-lg text-white font-medium leading-relaxed">
                        {getPanelText(panels[currentPanel]?.text || '')}
                      </p>
                    </div>
                  </div>

                  {/* Scene caption */}
                  <div className="text-center text-xs text-slate-500">
                    Scene: {panels[currentPanel]?.scene}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPanel(Math.max(0, currentPanel - 1))}
                  disabled={currentPanel === 0}
                  className="px-4 py-2 bg-white/5 text-white rounded-lg flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </motion.button>

                {/* Panel dots */}
                <div className="flex gap-2">
                  {panels.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPanel(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === currentPanel ? 'bg-orange-400 w-6' : 'bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPanel(Math.min(panels.length - 1, currentPanel + 1))}
                  disabled={currentPanel === panels.length - 1}
                  className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-500/30 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Moral */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 border-orange-500/20 bg-orange-500/5"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-orange-400" />
                <h4 className="text-sm font-semibold text-orange-400">Moral of the Story</h4>
              </div>
              <p className="text-slate-300 text-sm italic">"{selectedStory.moral}"</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
