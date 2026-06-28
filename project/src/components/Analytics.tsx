import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, BookOpen, Target, Award, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { badges } from '../data/mockData';
import type { UserProgress } from '../types';

interface AnalyticsProps {
  progress: UserProgress;
  accuracy: number;
}

const weeklyData = [
  { day: 'Mon', quizzes: 2, xp: 45 },
  { day: 'Tue', quizzes: 1, xp: 20 },
  { day: 'Wed', quizzes: 3, xp: 65 },
  { day: 'Thu', quizzes: 0, xp: 0 },
  { day: 'Fri', quizzes: 2, xp: 50 },
  { day: 'Sat', quizzes: 4, xp: 80 },
  { day: 'Sun', quizzes: 1, xp: 30 },
];

const topicData = [
  { name: 'Science', value: 45, color: '#4F46E5' },
  { name: 'Math', value: 25, color: '#22C55E' },
  { name: 'Social', value: 20, color: '#F59E0B' },
  { name: 'English', value: 10, color: '#8B5CF6' },
];

export function Analytics({ progress, accuracy }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState('week');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Analytics Dashboard
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Track your learning progress and achievements
        </p>
      </div>

      {/* Time Range */}
      <div className="flex gap-2">
        {['day', 'week', 'month'].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeRange === range
                ? 'bg-primary text-white'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: 'Quizzes Taken', value: progress.quizzesTaken, color: 'text-primary', bg: 'bg-primary/10' },
          { icon: Target, label: 'Accuracy', value: `${accuracy}%`, color: 'text-secondary', bg: 'bg-secondary/10' },
          { icon: TrendingUp, label: 'Total XP', value: progress.xp, color: 'text-accent', bg: 'bg-accent/10' },
          { icon: Calendar, label: 'Streak', value: `${progress.streak} days`, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
            >
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="xp" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Topics Explored</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {topicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {topicData.map((topic, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: topic.color }} />
                <span className="text-xs text-slate-400">{topic.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Badges Earned</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, i) => {
            const earned = progress.badges.includes(badge.id);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-xl text-center transition-all ${
                  earned
                    ? 'bg-white/10 border border-white/20'
                    : 'bg-white/5 border border-white/5 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div className="text-sm font-medium text-white">{badge.name}</div>
                <div className="text-xs text-slate-400 mt-1">{badge.condition}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
