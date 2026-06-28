import { motion } from 'framer-motion';
import { Star, Flame, Trophy, Target } from 'lucide-react';
import type { UserProgress } from '../types';

interface ProgressBarProps {
  progress: UserProgress;
  accuracy: number;
}

export function ProgressBar({ progress, accuracy }: ProgressBarProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 right-0 left-20 lg:left-64 h-16 bg-[#1E293B]/90 backdrop-blur-xl border-b border-white/10 z-30 flex items-center px-6 gap-6"
    >
      {/* XP */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Star className="w-4 h-4 text-primary" />
        </div>
        <div>
          <div className="text-xs text-slate-400">XP Points</div>
          <motion.div
            key={progress.xp}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-sm font-bold text-white"
          >
            {progress.xp}
          </motion.div>
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
          <Flame className="w-4 h-4 text-orange-500" />
        </div>
        <div>
          <div className="text-xs text-slate-400">Streak</div>
          <div className="text-sm font-bold text-white">{progress.streak} days</div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
          <Trophy className="w-4 h-4 text-yellow-500" />
        </div>
        <div>
          <div className="text-xs text-slate-400">Badges</div>
          <div className="text-sm font-bold text-white">{progress.badges.length}</div>
        </div>
      </div>

      {/* Accuracy */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
          <Target className="w-4 h-4 text-secondary" />
        </div>
        <div>
          <div className="text-xs text-slate-400">Accuracy</div>
          <div className="text-sm font-bold text-white">{accuracy}%</div>
        </div>
      </div>

      {/* Level bar */}
      <div className="flex-1 max-w-xs ml-auto">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">Level {Math.floor(progress.xp / 100) + 1}</span>
          <span className="text-slate-400">{progress.xp % 100}/100 XP</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(progress.xp % 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
