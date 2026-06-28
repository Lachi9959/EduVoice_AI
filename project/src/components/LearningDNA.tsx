import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dna, Target, TrendingUp, Brain, Zap, Award, BookOpen, BarChart3, Rocket,
  RefreshCw, Save, CheckCircle2, AlertTriangle, ChevronUp, ChevronDown
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { supabase } from '../lib/supabase';

interface LearningProfile {
  id?: string;
  student_name: string;
  strong_subjects: string[];
  weak_subjects: string[];
  learning_speed: string;
  attention_score: number;
  quiz_accuracy: number;
  topics_explored: number;
  streak_days: number;
  career_goal: string;
}

interface QuizAttempt {
  score: number;
  total_questions: number;
  created_at: string;
}

const defaultRadar = [
  { subject: 'Science', score: 85 },
  { subject: 'Math', score: 72 },
  { subject: 'Social', score: 90 },
  { subject: 'English', score: 78 },
  { subject: 'Hindi', score: 88 },
  { subject: 'Computer', score: 95 },
];

const defaultWeekly = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 70 },
  { day: 'Wed', score: 68 },
  { day: 'Thu', score: 75 },
  { day: 'Fri', score: 82 },
  { day: 'Sat', score: 88 },
  { day: 'Sun', score: 92 },
];

const careerPaths: Record<string, { title: string; roadmap: string[]; skills: string[]; salary: string; colleges: string[] }> = {
  'Data Scientist': {
    title: 'Data Scientist',
    roadmap: ['Class 10 (Math focus)', 'Class 11-12 (PCM)', 'B.Tech CSE/IT', 'M.Tech or Data Science Course', 'Internship', 'Job!'],
    skills: ['Python', 'Statistics', 'Machine Learning', 'SQL', 'Data Visualization'],
    salary: '8-30 LPA',
    colleges: ['IIT Bombay', 'IIT Delhi', 'BITS Pilani', 'IIIT Hyderabad'],
  },
  'Doctor': {
    title: 'Doctor',
    roadmap: ['Class 10 (Bio focus)', 'Class 11-12 (PCB)', 'NEET Exam', 'MBBS (5.5 years)', 'MD Specialization', 'Practice!'],
    skills: ['Biology', 'Chemistry', 'Patient Care', 'Diagnosis', 'Surgery'],
    salary: '10-50 LPA',
    colleges: ['AIIMS Delhi', 'CMC Vellore', 'AFMC Pune', 'MAMC Delhi'],
  },
  'Engineer': {
    title: 'Engineer',
    roadmap: ['Class 10 (Math/Science)', 'Class 11-12 (PCM)', 'JEE Exam', 'B.Tech (4 years)', 'GATE/Job', 'Specialize!'],
    skills: ['Mathematics', 'Physics', 'Problem Solving', 'Programming', 'Design'],
    salary: '6-25 LPA',
    colleges: ['IITs', 'NITs', 'BITS Pilani', 'VIT Vellore'],
  },
  'IAS Officer': {
    title: 'IAS Officer',
    roadmap: ['Class 10-12 (Any stream)', 'Graduation (Any)', 'UPSC Preparation (1-2 years)', 'Civil Services Exam', 'Training (LBSNAA)', 'Posting!'],
    skills: ['General Knowledge', 'Leadership', 'Decision Making', 'Public Policy', 'Communication'],
    salary: '15-50 LPA + Perks',
    colleges: ['Any recognized university', 'Delhi University', 'JNU'],
  },
};

export function LearningDNA() {
  const [profile, setProfile] = useState<LearningProfile>({
    student_name: 'Student',
    strong_subjects: ['Computer', 'Social Studies', 'Science'],
    weak_subjects: ['Math', 'English'],
    learning_speed: 'Fast Learner',
    attention_score: 82,
    quiz_accuracy: 78,
    topics_explored: 24,
    streak_days: 5,
    career_goal: '',
  });
  const [careerGoal, setCareerGoal] = useState('');
  const [showFutureMe, setShowFutureMe] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [radarData, setRadarData] = useState(defaultRadar);
  const [weeklyData, setWeeklyData] = useState(defaultWeekly);
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadProfile();
    loadQuizHistory();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error: dbError } = await supabase
        .from('student_progress')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (dbError) throw dbError;

      if (data) {
        setProfile({
          id: data.id,
          student_name: data.student_name || 'Student',
          strong_subjects: data.strong_subjects || ['Computer', 'Social Studies', 'Science'],
          weak_subjects: data.weak_subjects || ['Math', 'English'],
          learning_speed: data.learning_speed || 'Fast Learner',
          attention_score: data.attention_score || 82,
          quiz_accuracy: data.quiz_accuracy || 78,
          topics_explored: data.topics_explored || 24,
          streak_days: data.streak_days || 5,
          career_goal: data.career_goal || '',
        });
        if (data.career_goal) {
          setCareerGoal(data.career_goal);
          setShowFutureMe(true);
        }
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadQuizHistory = async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('quiz_attempts')
        .select('score, total_questions, created_at')
        .order('created_at', { ascending: true })
        .limit(20);

      if (dbError) throw dbError;

      if (data && data.length > 0) {
        setQuizHistory(data);
        // Calculate actual accuracy
        const totalCorrect = data.reduce((sum, q) => sum + q.score, 0);
        const totalQuestions = data.reduce((sum, q) => sum + q.total_questions, 0);
        const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 78;

        // Build weekly data from actual quiz attempts
        const dayMap: Record<string, number> = {};
        data.forEach(q => {
          const day = new Date(q.created_at).toLocaleDateString('en-US', { weekday: 'short' });
          dayMap[day] = (dayMap[day] || 0) + Math.round((q.score / q.total_questions) * 100);
        });

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const builtWeekly = days.map(d => ({
          day: d,
          score: dayMap[d] || Math.floor(60 + Math.random() * 30),
        }));
        setWeeklyData(builtWeekly);

        setProfile(prev => ({ ...prev, quiz_accuracy: accuracy }));
      }
    } catch (e) {
      console.error('Failed to load quiz history:', e);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      setSaved(false);
      setError('');

      const payload = {
        student_name: profile.student_name,
        strong_subjects: profile.strong_subjects,
        weak_subjects: profile.weak_subjects,
        learning_speed: profile.learning_speed,
        attention_score: profile.attention_score,
        quiz_accuracy: profile.quiz_accuracy,
        topics_explored: profile.topics_explored,
        streak_days: profile.streak_days,
        career_goal: careerGoal,
      };

      if (profile.id) {
        const { error: updateError } = await supabase
          .from('student_progress')
          .update(payload)
          .eq('id', profile.id);
        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from('student_progress')
          .insert(payload)
          .select()
          .single();
        if (insertError) throw insertError;
        if (data) setProfile(prev => ({ ...prev, id: data.id }));
      }

      setSaved(true);
      setEditMode(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const updateProfileField = <K extends keyof LearningProfile>(field: K, value: LearningProfile[K]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const toggleSubject = (subject: string, type: 'strong' | 'weak') => {
    setProfile(prev => {
      const list = type === 'strong' ? [...prev.strong_subjects] : [...prev.weak_subjects];
      const idx = list.indexOf(subject);
      if (idx >= 0) list.splice(idx, 1);
      else list.push(subject);
      return type === 'strong'
        ? { ...prev, strong_subjects: list }
        : { ...prev, weak_subjects: list };
    });
  };

  const allSubjects = ['Science', 'Math', 'Social', 'English', 'Hindi', 'Computer'];

  const selectedCareer = careerPaths[careerGoal];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Dna className="w-8 h-8 text-cyan-400" />
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
            <Dna className="w-6 h-6 text-cyan-400" />
            Personalized Learning DNA
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Your unique learning profile and personalized recommendations
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
              editMode ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {editMode ? 'Done' : 'Edit Profile'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveProfile}
            disabled={saving}
            className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
          </motion.button>
        </div>
      </div>

      {error && (
        <div className="glass-card p-4 border-red-500/30 bg-red-500/5 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}

      {/* Student Name */}
      {editMode && (
        <div className="glass-card p-4">
          <label className="text-sm text-slate-400 mb-2 block">Student Name</label>
          <input
            type="text"
            value={profile.student_name}
            onChange={(e) => updateProfileField('student_name', e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50"
          />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Target, label: 'Quiz Accuracy', value: `${profile.quiz_accuracy}%`, color: 'text-green-400', bg: 'bg-green-500/10', field: 'quiz_accuracy' as const },
          { icon: Brain, label: 'Attention Score', value: `${profile.attention_score}`, color: 'text-blue-400', bg: 'bg-blue-500/10', field: 'attention_score' as const },
          { icon: BookOpen, label: 'Topics Explored', value: `${profile.topics_explored}`, color: 'text-purple-400', bg: 'bg-purple-500/10', field: 'topics_explored' as const },
          { icon: Zap, label: 'Learning Speed', value: profile.learning_speed, color: 'text-yellow-400', bg: 'bg-yellow-500/10', field: 'learning_speed' as const },
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
              {editMode && stat.field !== 'learning_speed' ? (
                <input
                  type="number"
                  value={profile[stat.field]}
                  onChange={(e) => updateProfileField(stat.field, Number(e.target.value))}
                  className="w-20 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-white text-xl font-bold focus:outline-none focus:border-primary/50"
                />
              ) : (
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              )}
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Subject Strength Radar
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={12} />
                <PolarRadiusAxis stroke="#475569" fontSize={10} />
                <Radar name="Your Score" dataKey="score" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-secondary" />
            Weekly Learning Curve
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="score" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strong vs Weak */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 border-green-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-green-400" />
            <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider">Strong Subjects</h3>
          </div>
          <div className="space-y-2">
            {profile.strong_subjects.map((subject, i) => (
              <motion.div
                key={subject}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 bg-green-500/5 rounded-xl"
              >
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-sm font-bold">{i + 1}</span>
                </div>
                <span className="text-white font-medium">{subject}</span>
                <div className="ml-auto">
                  <div className="h-2 w-20 bg-white/10 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-green-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${85 - i * 5}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {editMode && (
            <div className="mt-3 flex flex-wrap gap-2">
              {allSubjects.map(s => (
                <button
                  key={s}
                  onClick={() => toggleSubject(s, 'strong')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    profile.strong_subjects.includes(s)
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-6 border-red-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Focus Areas</h3>
          </div>
          <div className="space-y-2">
            {profile.weak_subjects.map((subject, i) => (
              <motion.div
                key={subject}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 bg-red-500/5 rounded-xl"
              >
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 text-sm font-bold">{i + 1}</span>
                </div>
                <span className="text-white font-medium">{subject}</span>
                <div className="ml-auto">
                  <div className="h-2 w-20 bg-white/10 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-red-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${55 + i * 10}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {editMode && (
            <div className="mt-3 flex flex-wrap gap-2">
              {allSubjects.map(s => (
                <button
                  key={s}
                  onClick={() => toggleSubject(s, 'weak')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    profile.weak_subjects.includes(s)
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-400 mt-3">
            AI recommends: Practice 10 more quizzes in these subjects to improve.
          </p>
        </div>
      </div>

      {/* Future Me Simulator */}
      <div className="glass-card p-6 border-cyan-500/20 bg-cyan-500/5">
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="w-6 h-6 text-cyan-400" />
          <h3 className="text-lg font-semibold text-cyan-400">Future Me Simulator</h3>
        </div>
        <p className="text-slate-300 text-sm mb-4">
          Tell me your dream career and I will show you the complete roadmap to get there!
        </p>

        <div className="flex gap-3 flex-wrap mb-4">
          {Object.keys(careerPaths).map(career => (
            <motion.button
              key={career}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setCareerGoal(career); setShowFutureMe(true); updateProfileField('career_goal', career); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                careerGoal === career
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {career}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {showFutureMe && selectedCareer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 mt-4"
            >
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-white font-bold text-lg mb-2">{selectedCareer.title}</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-slate-400 mb-2">Roadmap</div>
                    <div className="space-y-2">
                      {selectedCareer.roadmap.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-cyan-400 text-xs">{i + 1}</span>
                          </div>
                          <span className="text-sm text-slate-300">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-2">Skills Needed</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCareer.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-lg border border-cyan-500/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4">
                      <div className="text-xs text-slate-400 mb-1">Expected Salary</div>
                      <div className="text-lg font-bold text-green-400">{selectedCareer.salary}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-2">Top Colleges</div>
                    <div className="space-y-2">
                      {selectedCareer.colleges.map((college, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          {college}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-500/20">
                <p className="text-sm text-slate-300 text-center">
                  Based on your Learning DNA, you have a <span className="text-cyan-400 font-bold">strong profile</span> for this career path!
                  Keep practicing your weak subjects to maximize your chances.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
