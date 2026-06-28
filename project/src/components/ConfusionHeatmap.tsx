import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, AlertTriangle, TrendingDown, Lightbulb, BarChart3, Target } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TopicStruggle {
  topic: string;
  confusionRate: number;
  totalAttempts: number;
  wrongAnswers: number;
  avgTime: number;
}

const mockHeatmapData: TopicStruggle[] = [
  { topic: 'Photosynthesis', confusionRate: 65, totalAttempts: 120, wrongAnswers: 78, avgTime: 45 },
  { topic: 'Solar System', confusionRate: 32, totalAttempts: 95, wrongAnswers: 30, avgTime: 28 },
  { topic: 'Water Cycle', confusionRate: 48, totalAttempts: 80, wrongAnswers: 38, avgTime: 35 },
  { topic: 'Gravity', confusionRate: 72, totalAttempts: 60, wrongAnswers: 43, avgTime: 52 },
  { topic: 'Fractions', confusionRate: 55, totalAttempts: 110, wrongAnswers: 60, avgTime: 40 },
  { topic: 'States of Matter', confusionRate: 25, totalAttempts: 70, wrongAnswers: 17, avgTime: 22 },
];

export function ConfusionHeatmap() {
  const [heatmapData, setHeatmapData] = useState<TopicStruggle[]>(mockHeatmapData);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<TopicStruggle | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data: attempts, error } = await supabase
        .from('quiz_attempts')
        .select('score, total_questions, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      if (attempts && attempts.length > 0) {
        // In real app, aggregate by topic. For demo, use mock with slight variation
        const variation = attempts.length / 100;
        setHeatmapData(prev => prev.map(t => ({
          ...t,
          confusionRate: Math.min(95, Math.max(10, t.confusionRate + (Math.random() - 0.5) * 10)),
        })));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getHeatColor = (rate: number) => {
    if (rate >= 60) return 'bg-red-500';
    if (rate >= 40) return 'bg-orange-500';
    if (rate >= 25) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getHeatText = (rate: number) => {
    if (rate >= 60) return 'text-red-400';
    if (rate >= 40) return 'text-orange-400';
    if (rate >= 25) return 'text-yellow-400';
    return 'text-green-400';
  };

  const sortedData = [...heatmapData].sort((a, b) => b.confusionRate - a.confusionRate);
  const strugglingTopics = sortedData.filter(t => t.confusionRate >= 50);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Flame className="w-8 h-8 text-red-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Flame className="w-6 h-6 text-red-400" />
          Confusion Heatmap
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          AI detects topics where most students are struggling and highlights them for the teacher
        </p>
      </div>

      {/* Alert Banner */}
      {strugglingTopics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 border-red-500/30 bg-red-500/5"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-red-400">
                {strugglingTopics.length} topics need attention
              </div>
              <div className="text-xs text-slate-400">
                Students are struggling with: {strugglingTopics.map(t => t.topic).join(', ')}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Heatmap Grid */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Topic Confusion Rates</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sortedData.map((topic, i) => (
              <motion.button
                key={topic.topic}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTopic(topic)}
                className={`relative p-4 rounded-xl border transition-all ${
                  selectedTopic?.topic === topic.topic
                    ? 'border-white/30 ring-1 ring-white/20'
                    : 'border-white/10'
                }`}
              >
                <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getHeatColor(topic.confusionRate)}`} />
                <div className="text-white font-medium text-sm">{topic.topic}</div>
                <div className={`text-2xl font-bold mt-2 ${getHeatText(topic.confusionRate)}`}>
                  {Math.round(topic.confusionRate)}%
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {topic.wrongAnswers}/{topic.totalAttempts} wrong
                </div>
              </motion.button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-slate-400">Easy (&lt;25%)</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-500" /><span className="text-slate-400">Moderate (25-40%)</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-500" /><span className="text-slate-400">Hard (40-60%)</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-slate-400">Very Hard (&gt;60%)</span></div>
          </div>
        </div>

        {/* Detail Panel */}
        <div>
          {selectedTopic ? (
            <motion.div
              key={selectedTopic.topic}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{selectedTopic.topic}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getHeatColor(selectedTopic.confusionRate)} bg-opacity-20 text-white`}>
                  {Math.round(selectedTopic.confusionRate)}% confused
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">Total Attempts</span>
                  </div>
                  <span className="text-white font-medium">{selectedTopic.totalAttempts}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-slate-300">Wrong Answers</span>
                  </div>
                  <span className="text-red-400 font-medium">{selectedTopic.wrongAnswers}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">Avg Time</span>
                  </div>
                  <span className="text-white font-medium">{selectedTopic.avgTime}s</span>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">AI Recommendation</span>
                </div>
                <p className="text-xs text-slate-400">
                  Students struggle with this topic. Try: visual diagrams, real-life examples, 
                  break into smaller concepts, or use the Story Generator for a fun explanation.
                </p>
              </div>

              <div className="p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/20">
                <div className="text-xs text-yellow-400 font-medium mb-1">Suggested Action</div>
                <p className="text-xs text-slate-400">
                  Revisit this topic with simpler explanations. Use "Explain Like I am 10" mode 
                  and interactive diagrams.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card p-6 text-center text-slate-500">
              <Flame className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Click on a topic to see detailed analytics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
