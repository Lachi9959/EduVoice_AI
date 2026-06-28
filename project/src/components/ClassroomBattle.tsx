import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, Coins, Users, Zap, Crown, Target, Star, TrendingUp } from 'lucide-react';
import { fetchFromEdge } from '../lib/supabase';

interface Team {
  id: string;
  name: string;
  icon: string;
  color: string;
  total_xp: number;
  coins: number;
  members_count: number;
  team_members?: TeamMember[];
}

interface TeamMember {
  id: string;
  student_name: string;
  individual_xp: number;
  individual_coins: number;
}

interface LeaderboardEntry {
  id: string;
  student_name: string;
  total_xp: number;
  quizzes_completed: number;
  accuracy: number;
  rank: number;
}

export function ClassroomBattle() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'teams' | 'leaderboard'>('teams');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [teamsData, leaderboardData] = await Promise.all([
        fetchFromEdge('/teams'),
        fetchFromEdge('/leaderboard'),
      ]);
      setTeams(teamsData.teams || []);
      setLeaderboard(leaderboardData.leaderboard || []);
      if (teamsData.teams?.length > 0) setSelectedTeam(teamsData.teams[0]);
    } catch (e) {
      console.error('Failed to load battle data:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Zap className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  const maxXP = Math.max(...teams.map(t => t.total_xp), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Swords className="w-6 h-6 text-red-400" />
          Classroom Battle Mode
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Teams compete in quizzes to earn XP, coins, and climb the leaderboard
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
        {[
          { id: 'teams' as const, label: 'Teams', icon: Users },
          { id: 'leaderboard' as const, label: 'Leaderboard', icon: Trophy },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-red-500/20 text-red-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'teams' && (
          <motion.div
            key="teams"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Team Cards */}
            <div className="lg:col-span-2 space-y-4">
              {teams.map((team, i) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedTeam(team)}
                  className={`glass-card p-5 cursor-pointer transition-all border ${
                    selectedTeam?.id === team.id
                      ? 'border-red-500/30 bg-red-500/5'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{team.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{team.name}</h3>
                        {i === 0 && <Crown className="w-4 h-4 text-yellow-400" />}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Users className="w-3.5 h-3.5" />
                          {team.members_count} members
                        </span>
                        <span className="flex items-center gap-1 text-primary">
                          <Zap className="w-3.5 h-3.5" />
                          {team.total_xp} XP
                        </span>
                        <span className="flex items-center gap-1 text-yellow-400">
                          <Coins className="w-3.5 h-3.5" />
                          {team.coins}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: team.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(team.total_xp / maxXP) * 100}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        />
                      </div>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: team.color }}>
                      #{i + 1}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Team Detail */}
            <div>
              <AnimatePresence mode="wait">
                {selectedTeam && (
                  <motion.div
                    key={selectedTeam.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card p-6 space-y-4"
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-2">{selectedTeam.icon}</div>
                      <h3 className="text-xl font-bold text-white">{selectedTeam.name}</h3>
                      <div className="text-sm text-slate-400 mt-1">{selectedTeam.members_count} warriors</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/5 rounded-xl text-center">
                        <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">{selectedTeam.total_xp}</div>
                        <div className="text-xs text-slate-400">Total XP</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl text-center">
                        <Coins className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                        <div className="text-lg font-bold text-white">{selectedTeam.coins}</div>
                        <div className="text-xs text-slate-400">Coins</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3">Top Contributors</h4>
                      <div className="space-y-2">
                        {selectedTeam.team_members?.slice(0, 5).map((member, i) => (
                          <motion.div
                            key={member.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 w-4">{i + 1}</span>
                              <span className="text-sm text-white">{member.student_name}</span>
                            </div>
                            <span className="text-xs text-primary">{member.individual_xp} XP</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/20">
                      <div className="text-xs text-slate-400 text-center">
                        Answer quiz questions correctly to earn XP and coins for your team!
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Global Leaderboard</h3>
            </div>
            <div className="space-y-3">
              {leaderboard.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-xl ${
                    i === 0 ? 'bg-yellow-500/10 border border-yellow-500/20' :
                    i === 1 ? 'bg-slate-400/10 border border-slate-400/20' :
                    i === 2 ? 'bg-orange-700/10 border border-orange-700/20' :
                    'bg-white/5'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    i === 1 ? 'bg-slate-400/20 text-slate-300' :
                    i === 2 ? 'bg-orange-700/20 text-orange-400' :
                    'bg-white/10 text-slate-400'
                  }`}>
                    {entry.rank}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{entry.student_name}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {entry.quizzes_completed} quizzes
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {entry.accuracy}% accuracy
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{entry.total_xp}</div>
                    <div className="text-xs text-slate-400">XP</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
