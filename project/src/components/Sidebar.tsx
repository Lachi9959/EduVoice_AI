import { motion } from 'framer-motion';
import {
  Home, Mic, BookOpen, ClipboardList, Languages,
  Timer, BarChart3, Settings, GraduationCap, History, Camera, Swords, BookOpenText, Briefcase, FileText, Pencil, Dna, Eye, Flame, MessageCircle, Box, Sparkles
} from 'lucide-react';
import type { View } from '../App';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const navItems: { id: View; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'teach', label: 'Live Teaching', icon: Mic },
  { id: 'lessons', label: 'Lessons', icon: BookOpen },
  { id: 'quiz', label: 'Quiz Generator', icon: ClipboardList },
  { id: 'translate', label: 'Translator', icon: Languages },
  { id: 'activity', label: 'Activity Guide', icon: Timer },
  { id: 'twin', label: 'Classroom Twin', icon: History },
  { id: 'emotion', label: 'Emotion AI', icon: Camera },
  { id: 'focus', label: 'Focus Detection', icon: Eye },
  { id: 'heatmap', label: 'Confusion Heatmap', icon: Flame },
  { id: 'doubts', label: 'Anonymous Doubts', icon: MessageCircle },
  { id: 'ar', label: 'AR Visualizer', icon: Box },
  { id: 'battle', label: 'Battle Mode', icon: Swords },
  { id: 'story', label: 'AI Stories', icon: BookOpenText },
  { id: 'career', label: 'Careers', icon: Briefcase },
  { id: 'exam', label: 'Exam Mode', icon: FileText },
  { id: 'revision', label: 'Smart Revision', icon: Sparkles },
  { id: 'magicboard', label: 'Magic Board', icon: Pencil },
  { id: 'dna', label: 'Learning DNA', icon: Dna },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -80 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="fixed left-0 top-0 h-full w-20 lg:w-64 bg-[#1E293B]/90 backdrop-blur-xl border-r border-white/10 z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="p-4 lg:p-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <span className="hidden lg:block text-lg font-bold text-gradient">EduVoice AI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 lg:px-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : 'group-hover:text-white'}`} />
              <span className="hidden lg:block text-sm font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom badge */}
      <div className="p-4 border-t border-white/10">
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs text-slate-400">AI Ready</span>
        </div>
      </div>
    </motion.aside>
  );
}
