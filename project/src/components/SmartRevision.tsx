import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Brain, Layers, BookOpen, Video, Sparkles, RotateCcw, Check, ChevronRight, Clock, Download, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RevisionItem {
  id: string;
  topic: string;
  type: 'notes' | 'flashcards' | 'mindmap' | 'questions' | 'video';
  content: any;
  created_at: string;
}

const demoRevisions: RevisionItem[] = [
  {
    id: '1',
    topic: 'Photosynthesis',
    type: 'notes',
    content: {
      title: 'Photosynthesis - Quick Notes',
      points: [
        'Definition: Process by which plants make their own food using sunlight',
        'Ingredients: Sunlight + Water + Carbon Dioxide',
        'Location: Takes place in leaves (chloroplasts)',
        'Product: Glucose (food) + Oxygen (by-product)',
        'Key term: Chlorophyll - green pigment that captures sunlight',
      ],
    },
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    topic: 'Photosynthesis',
    type: 'flashcards',
    content: [
      { q: 'What gas do plants absorb?', a: 'Carbon Dioxide' },
      { q: 'What is the green pigment in leaves?', a: 'Chlorophyll' },
      { q: 'What is produced as a by-product?', a: 'Oxygen' },
    ],
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    topic: 'Solar System',
    type: 'mindmap',
    content: {
      center: 'Solar System',
      branches: [
        { label: 'Sun', children: ['Center star', 'Provides light & heat'] },
        { label: 'Inner Planets', children: ['Mercury', 'Venus', 'Earth', 'Mars'] },
        { label: 'Outer Planets', children: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'] },
        { label: 'Other', children: ['Asteroid Belt', 'Comets', 'Dwarf Planets'] },
      ],
    },
    created_at: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: '4',
    topic: 'Water Cycle',
    type: 'questions',
    content: [
      { q: 'What is evaporation?', a: 'Water turning into vapor' },
      { q: 'What forms when water vapor cools?', a: 'Clouds' },
      { q: 'What is precipitation?', a: 'Rain, snow, hail falling' },
    ],
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: '5',
    topic: 'Gravity',
    type: 'video',
    content: {
      title: 'Gravity in 60 Seconds',
      duration: '1:00',
      script: 'Gravity is the force that pulls objects toward each other. The Earth pulls us down, which is why we do not float away. The Moon orbits Earth because of gravity. Even apples fall from trees because gravity pulls them toward the ground!',
    },
    created_at: new Date(Date.now() - 18000000).toISOString(),
  },
];

const typeConfig = {
  notes: { icon: FileText, label: 'Notes', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  flashcards: { icon: Layers, label: 'Flashcards', color: 'text-green-400', bg: 'bg-green-500/10' },
  mindmap: { icon: Brain, label: 'Mind Map', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  questions: { icon: BookOpen, label: 'Questions', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  video: { icon: Video, label: '1-Min Video', color: 'text-red-400', bg: 'bg-red-500/10' },
};

export function SmartRevision() {
  const [revisions, setRevisions] = useState<RevisionItem[]>(demoRevisions);
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<RevisionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadRevisions();
  }, []);

  const loadRevisions = async () => {
    try {
      setLoading(true);
      // In production, load from supabase
      // const { data } = await supabase.from('revisions').select('*').order('created_at', { ascending: false });
      // if (data) setRevisions(data);
      setRevisions(demoRevisions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (topic: string) => {
    try {
      setGenerating(true);
      // Simulate AI generation
      await new Promise(r => setTimeout(r, 2000));
      const newRevision: RevisionItem = {
        id: Date.now().toString(),
        topic,
        type: 'notes',
        content: {
          title: `${topic} - AI Generated Notes`,
          points: [
            `Key concept 1 about ${topic}`,
            `Key concept 2 about ${topic}`,
            `Important formula related to ${topic}`,
            `Real-world application of ${topic}`,
          ],
        },
        created_at: new Date().toISOString(),
      };
      setRevisions(prev => [newRevision, ...prev]);
    } finally {
      setGenerating(false);
    }
  };

  const topics = ['All Topics', ...Array.from(new Set(revisions.map(r => r.topic)))];

  const filtered = revisions.filter(r => {
    const topicMatch = selectedTopic === 'All Topics' || r.topic === selectedTopic;
    const typeMatch = selectedType === 'all' || r.type === selectedType;
    return topicMatch && typeMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-400" />
          Smart Revision Generator
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          After every class, AI automatically creates notes, flashcards, mind maps, practice questions, and 1-minute revision videos
        </p>
      </div>

      {/* Generate */}
      <div className="glass-card p-6">
        <div className="flex gap-3 flex-wrap">
          {topics.slice(1).map(topic => (
            <motion.button
              key={topic}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGenerate(topic)}
              disabled={generating}
              className="px-4 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-sm font-medium hover:bg-amber-500/30 transition-colors disabled:opacity-50"
            >
              {generating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate for {topic}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary/50"
        >
          {topics.map(t => <option key={t} value={t} className="bg-[#1E293B]">{t}</option>)}
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${selectedType === 'all' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-slate-400 hover:text-white'}`}
          >
            All Types
          </button>
          {Object.entries(typeConfig).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <button
                key={key}
                onClick={() => setSelectedType(key)}
                className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${selectedType === key ? `${cfg.bg} ${cfg.color} border border-white/20` : 'bg-white/5 text-slate-400 hover:text-white'}`}
              >
                <Icon className="w-3 h-3" />
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, i) => {
          const cfg = typeConfig[item.type];
          const Icon = cfg.icon;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedItem(item)}
              className="glass-card p-5 text-left hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${cfg.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${cfg.color}`} />
                </div>
                <span className="text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              <div className="text-white font-medium mb-1">{item.topic}</div>
              <div className={`text-xs ${cfg.color} mb-2`}>{cfg.label}</div>
              <p className="text-slate-400 text-xs line-clamp-2">
                {item.type === 'notes' && item.content.points?.[0]}
                {item.type === 'flashcards' && `${item.content.length} cards`}
                {item.type === 'mindmap' && 'Interactive concept map'}
                {item.type === 'questions' && `${item.content.length} practice questions`}
                {item.type === 'video' && item.content.duration}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedItem.topic}</h3>
                  <span className={`text-xs ${typeConfig[selectedItem.type].color}`}>{typeConfig[selectedItem.type].label}</span>
                </div>
                <button onClick={() => setSelectedItem(null)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                </button>
              </div>

              {selectedItem.type === 'notes' && (
                <div className="space-y-3">
                  <h4 className="text-white font-medium">{selectedItem.content.title}</h4>
                  {selectedItem.content.points.map((point: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300 text-sm">{point}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedItem.type === 'flashcards' && (
                <div className="space-y-3">
                  {selectedItem.content.map((card: any, i: number) => (
                    <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-white text-sm font-medium mb-2">Q: {card.q}</p>
                      <p className="text-green-400 text-sm">A: {card.a}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedItem.type === 'mindmap' && (
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="text-center mb-4">
                    <div className="inline-block px-4 py-2 bg-primary/20 rounded-full text-primary font-medium">
                      {selectedItem.content.center}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedItem.content.branches.map((branch: any, i: number) => (
                      <div key={i} className="p-3 bg-white/5 rounded-lg">
                        <div className="text-white text-sm font-medium mb-1">{branch.label}</div>
                        {branch.children.map((child: string, j: number) => (
                          <div key={j} className="text-xs text-slate-400 flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-primary" />
                            {child}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.type === 'questions' && (
                <div className="space-y-3">
                  {selectedItem.content.map((q: any, i: number) => (
                    <div key={i} className="p-4 bg-white/5 rounded-xl">
                      <p className="text-white text-sm mb-2">{i + 1}. {q.q}</p>
                      <p className="text-green-400 text-sm">{q.a}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedItem.type === 'video' && (
                <div className="space-y-4">
                  <div className="aspect-video bg-black/50 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-12 h-12 text-red-400 mx-auto mb-3" />
                      <p className="text-white font-medium">{selectedItem.content.title}</p>
                      <p className="text-slate-400 text-sm">{selectedItem.content.duration}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-slate-300 text-sm italic">"{selectedItem.content.script}"</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="flex-1 py-2.5 bg-white/5 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
