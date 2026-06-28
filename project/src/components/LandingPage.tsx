import { motion } from 'framer-motion';
import { Mic, Rocket, Sparkles, BookOpen, Brain, Globe, Zap, GraduationCap, Camera, Swords, BookOpenText, Briefcase, FileText, Pencil, Dna, History, Eye, Flame, MessageCircle, Box } from 'lucide-react';
import type { View } from '../App';

interface LandingPageProps {
  onNavigate: (view: View) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    { icon: Mic, title: 'Voice Commands', desc: 'Speak naturally in Hindi or English', color: 'from-primary to-blue-400', view: 'teach' as View },
    { icon: Brain, title: 'AI Simplification', desc: 'Complex concepts made easy with visuals', color: 'from-secondary to-emerald-400', view: 'teach' as View },
    { icon: Zap, title: 'Instant Quizzes', desc: 'Generate quizzes with voice commands', color: 'from-accent to-yellow-400', view: 'quiz' as View },
    { icon: Globe, title: 'Bilingual Support', desc: 'Learn in English or Hindi', color: 'from-purple-500 to-pink-400', view: 'translate' as View },
  ];

  const advancedFeatures = [
    { icon: History, title: 'Classroom Twin', desc: 'Replay any past lesson', color: 'text-cyan-400', view: 'twin' as View },
    { icon: Camera, title: 'Emotion AI', desc: 'Detect student engagement', color: 'text-pink-400', view: 'emotion' as View },
    { icon: Eye, title: 'Focus Detection', desc: 'Webcam attention analysis', color: 'text-rose-400', view: 'focus' as View },
    { icon: Flame, title: 'Confusion Heatmap', desc: 'Identify struggling topics', color: 'text-orange-400', view: 'heatmap' as View },
    { icon: MessageCircle, title: 'Anonymous Doubts', desc: 'Voice questions without identity', color: 'text-indigo-400', view: 'doubts' as View },
    { icon: Box, title: 'AR Visualizer', desc: 'Interactive 3D models', color: 'text-violet-400', view: 'ar' as View },
    { icon: Swords, title: 'Battle Mode', desc: 'Team-based quiz competitions', color: 'text-red-400', view: 'battle' as View },
    { icon: BookOpenText, title: 'AI Stories', desc: 'Comic-style concept stories', color: 'text-amber-400', view: 'story' as View },
    { icon: Briefcase, title: 'Career Connect', desc: 'Link learning to careers', color: 'text-teal-400', view: 'career' as View },
    { icon: FileText, title: 'Exam Mode', desc: 'Flashcards & mind maps', color: 'text-blue-400', view: 'exam' as View },
    { icon: Sparkles, title: 'Smart Revision', desc: 'Auto-generated notes, videos', color: 'text-amber-400', view: 'revision' as View },
    { icon: Pencil, title: 'Magic Board', desc: 'Sketch to diagram AI', color: 'text-purple-400', view: 'magicboard' as View },
    { icon: Dna, title: 'Learning DNA', desc: 'Personalized learning profile', color: 'text-cyan-400', view: 'dna' as View },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />

      <motion.div className="absolute top-32 left-[15%] text-4xl opacity-20" animate={{ y: [-10, 10, -10], rotate: [0, 10, -10, 0] }} transition={{ duration: 6, repeat: Infinity }}>📚</motion.div>
      <motion.div className="absolute top-48 right-[20%] text-3xl opacity-20" animate={{ y: [10, -10, 10], rotate: [0, -5, 5, 0] }} transition={{ duration: 7, repeat: Infinity }}>🔬</motion.div>
      <motion.div className="absolute bottom-40 left-[25%] text-3xl opacity-20" animate={{ y: [-8, 8, -8], rotate: [0, 15, -15, 0] }} transition={{ duration: 5, repeat: Infinity }}>🧮</motion.div>
      <motion.div className="absolute bottom-32 right-[15%] text-4xl opacity-20" animate={{ y: [8, -8, 8], rotate: [0, -10, 10, 0] }} transition={{ duration: 8, repeat: Infinity }}>🌍</motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.8 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">India's First Emotion-Aware Voice Classroom AI</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Learn Smarter with </span>
            <span className="text-gradient">EduVoice AI</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Your Voice-Powered Classroom Assistant. Speak in Hindi or English and watch AI create lessons, quizzes, and visuals instantly.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-wrap justify-center gap-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onNavigate('teach')} className="px-8 py-4 bg-primary text-white rounded-2xl font-semibold text-lg flex items-center gap-3 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
              <Mic className="w-5 h-5" />
              Start Teaching
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onNavigate('quiz')} className="px-8 py-4 bg-white/5 text-white border border-white/20 rounded-2xl font-semibold text-lg flex items-center gap-3 hover:bg-white/10 transition-colors">
              <Rocket className="w-5 h-5" />
              Try Demo
            </motion.button>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.1 }} whileHover={{ y: -5 }} className="glass-card p-6 group cursor-pointer" onClick={() => onNavigate(feature.view)}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Advanced AI Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {advancedFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.button key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 + i * 0.05 }} whileHover={{ scale: 1.03 }} onClick={() => onNavigate(feature.view)} className="glass-card p-5 text-left hover:bg-white/10 transition-colors">
                  <Icon className={`w-6 h-6 ${feature.color} mb-3`} />
                  <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                  <p className="text-xs text-slate-400">{feature.desc}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '50K+', label: 'Students Reached' },
            { value: '2', label: 'Languages Supported' },
            { value: '100+', label: 'Topics Covered' },
            { value: '99%', label: 'Teacher Satisfaction' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="mt-20 text-center">
          <div className="glass-card p-10 max-w-2xl mx-auto">
            <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">Ready to Transform Your Classroom?</h2>
            <p className="text-slate-400 mb-6">Join thousands of teachers using EduVoice AI to make learning more engaging and accessible.</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onNavigate('teach')} className="px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
              Get Started Free
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
