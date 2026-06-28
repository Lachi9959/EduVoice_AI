import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, DollarSign, Lightbulb, MapPin, ChevronRight, Sparkles } from 'lucide-react';
import { fetchFromEdge } from '../lib/supabase';

interface Career {
  id: string;
  topic: string;
  career_title: string;
  description: string;
  salary_range: string;
  skills_needed: string[];
  colleges: string[];
  icon: string;
}

export function CareerConnector() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    try {
      setLoading(true);
      const data = await fetchFromEdge('/careers');
      setCareers(data.careers || []);
      if (data.careers?.length > 0) setSelectedCareer(data.careers[0]);
    } catch (e) {
      console.error('Failed to load careers:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!topic) return;
    try {
      setLoading(true);
      const data = await fetchFromEdge(`/careers?topic=${encodeURIComponent(topic)}`);
      if (data.careers?.length > 0) {
        setCareers(data.careers);
        setSelectedCareer(data.careers[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const topics = [...new Set(careers.map(c => c.topic))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Briefcase className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-teal-400" />
          Future Career Connector
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Discover real-world careers connected to what you are learning
        </p>
      </div>

      {/* Topic Search */}
      <div className="glass-card p-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g., Photosynthesis, Gravity)..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary/50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="px-6 py-3 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-xl font-medium flex items-center gap-2 hover:bg-teal-500/30 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Find Careers
          </motion.button>
        </div>

        <div className="flex gap-2 mt-3 flex-wrap">
          {topics.map(t => (
            <button
              key={t}
              onClick={() => { setTopic(t); handleSearch(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                topic === t
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Career List */}
        <div className="space-y-3">
          {careers.map((career, i) => (
            <motion.button
              key={career.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedCareer(career)}
              className={`w-full text-left p-4 rounded-xl transition-all border ${
                selectedCareer?.id === career.id
                  ? 'bg-teal-500/10 border-teal-500/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{career.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium truncate ${selectedCareer?.id === career.id ? 'text-teal-400' : 'text-white'}`}>
                    {career.career_title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">{career.topic}</p>
                </div>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 ${selectedCareer?.id === career.id ? 'text-teal-400' : 'text-slate-500'}`} />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Career Detail */}
        <AnimatePresence mode="wait">
          {selectedCareer && (
            <motion.div
              key={selectedCareer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:col-span-2 space-y-4"
            >
              {/* Header Card */}
              <div className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{selectedCareer.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white">{selectedCareer.career_title}</h3>
                    <p className="text-sm text-slate-400 mt-1">Related to: {selectedCareer.topic}</p>
                    <p className="text-slate-300 mt-3 leading-relaxed">{selectedCareer.description}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <h4 className="text-sm font-semibold text-white">Salary Range</h4>
                  </div>
                  <p className="text-lg font-bold text-green-400">{selectedCareer.salary_range}</p>
                  <p className="text-xs text-slate-400 mt-1">Average in India</p>
                </div>
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    <h4 className="text-sm font-semibold text-white">Skills Needed</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCareer.skills_needed?.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded-lg border border-yellow-500/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colleges */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <h4 className="text-sm font-semibold text-white">Top Colleges in India</h4>
                </div>
                <div className="space-y-3">
                  {selectedCareer.colleges?.map((college, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
                    >
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-slate-300">{college}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Motivation */}
              <div className="glass-card p-6 border-teal-500/20 bg-teal-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                  <h4 className="text-sm font-semibold text-teal-400">Why This Matters</h4>
                </div>
                <p className="text-slate-300 text-sm">
                  Learning {selectedCareer.topic} today could be your first step toward becoming a {selectedCareer.career_title}. 
                  Every concept you master opens new doors!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
