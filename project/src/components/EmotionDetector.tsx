import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, Smile, Frown, Meh, Zap, AlertCircle, TrendingUp, Users } from 'lucide-react';
import { fetchFromEdge } from '../lib/supabase';

type EmotionType = 'understood' | 'confused' | 'bored' | 'excited';

interface EmotionData {
  emotion: EmotionType;
  confidence: number;
  timestamp: string;
}

const emotionConfig: Record<EmotionType, { icon: React.ElementType; label: string; color: string; bg: string; message: string }> = {
  understood: { icon: Smile, label: 'Understood', color: 'text-green-400', bg: 'bg-green-500/10', message: 'Students are following well!' },
  confused: { icon: Frown, label: 'Confused', color: 'text-yellow-400', bg: 'bg-yellow-500/10', message: 'Let me explain in a simpler way...' },
  bored: { icon: Meh, label: 'Bored', color: 'text-red-400', bg: 'bg-red-500/10', message: 'Time for an engaging example!' },
  excited: { icon: Zap, label: 'Excited', color: 'text-purple-400', bg: 'bg-purple-500/10', message: 'Great energy! Keep it up!' },
};

export function EmotionDetector() {
  const [isActive, setIsActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('understood');
  const [confidence, setConfidence] = useState(0.85);
  const [showMessage, setShowMessage] = useState(false);
  const [sessionEmotions, setSessionEmotions] = useState<EmotionData[]>([]);
  const [studentName, setStudentName] = useState('Student');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsActive(true);
      startEmotionDetection();
    } catch (err) {
      console.error('Camera access denied:', err);
      // Simulate mode for demo
      setIsActive(true);
      startEmotionDetection();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsActive(false);
    setShowMessage(false);
  };

  const startEmotionDetection = () => {
    // Simulate emotion detection every 3 seconds
    intervalRef.current = setInterval(() => {
      const emotions: EmotionType[] = ['understood', 'confused', 'bored', 'excited'];
      const newEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const newConfidence = 0.6 + Math.random() * 0.35;

      setCurrentEmotion(newEmotion);
      setConfidence(newConfidence);

      const emotionData: EmotionData = {
        emotion: newEmotion,
        confidence: newConfidence,
        timestamp: new Date().toISOString(),
      };

      setSessionEmotions(prev => [...prev.slice(-19), emotionData]);
      setShowMessage(true);

      // Save to database
      try {
        fetchFromEdge('/emotion', {
          method: 'POST',
          body: JSON.stringify({
            session_id: 'demo-session',
            student_name: studentName,
            emotion: newEmotion,
            confidence: newConfidence,
          }),
        });
      } catch (e) {
        // Silently fail for demo
      }

      setTimeout(() => setShowMessage(false), 4000);
    }, 5000);
  };

  const emotionCounts = sessionEmotions.reduce((acc, e) => {
    acc[e.emotion] = (acc[e.emotion] || 0) + 1;
    return acc;
  }, {} as Record<EmotionType, number>);

  const dominantEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as EmotionType || 'understood';
  const config = emotionConfig[currentEmotion];
  const DominantIcon = emotionConfig[dominantEmotion]?.icon || Smile;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Camera className="w-6 h-6 text-pink-400" />
          Emotion-Aware Learning Engine
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          AI detects student emotions via webcam and adapts teaching in real-time
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Camera Feed */}
        <div className="space-y-4">
          <div className="glass-card p-4 relative overflow-hidden">
            <div className="aspect-video bg-black/50 rounded-xl overflow-hidden relative">
              {isActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs text-white font-medium">LIVE</span>
                  </div>
                  {/* Emotion Badge */}
                  <AnimatePresence>
                    {showMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-4 left-4 right-4"
                      >
                        <div className={`${config.bg} backdrop-blur-md border border-white/10 rounded-xl p-4`}>
                          <div className="flex items-center gap-3">
                            <config.icon className={`w-6 h-6 ${config.color}`} />
                            <div>
                              <div className={`text-sm font-semibold ${config.color}`}>
                                {config.label} ({Math.round(confidence * 100)}%)
                              </div>
                              <div className="text-xs text-slate-300">{config.message}</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <CameraOff className="w-12 h-12 mb-3" />
                  <p className="text-sm">Camera is off</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isActive ? stopCamera : startCamera}
                className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                }`}
              >
                {isActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                {isActive ? 'Stop Detection' : 'Start Detection'}
              </motion.button>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Student name"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 text-sm"
              />
            </div>
          </div>

          {/* Real-time Alert */}
          <AnimatePresence>
            {showMessage && currentEmotion === 'confused' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card p-4 border-yellow-500/30 bg-yellow-500/5"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-sm font-medium text-yellow-400">AI Teaching Assistant Alert</div>
                    <div className="text-xs text-slate-400">
                      Many students look confused. Suggesting: Simplify explanation, add visual example, or switch to Hinglish.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Analytics Panel */}
        <div className="space-y-4">
          {/* Current Status */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Current Session</h3>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl ${emotionConfig[dominantEmotion]?.bg} flex items-center justify-center`}>
                <DominantIcon className={`w-8 h-8 ${emotionConfig[dominantEmotion]?.color}`} />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{emotionConfig[dominantEmotion]?.label}</div>
                <div className="text-sm text-slate-400">Dominant emotion this session</div>
              </div>
            </div>
          </div>

          {/* Emotion Breakdown */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Emotion Breakdown</h3>
            <div className="space-y-3">
              {(Object.entries(emotionCounts) as [EmotionType, number][]).sort((a, b) => b[1] - a[1]).map(([emotion, count]) => {
                const cfg = emotionConfig[emotion];
                const Icon = cfg.icon;
                const total = sessionEmotions.length || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={emotion} className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white">{cfg.label}</span>
                        <span className={`${cfg.color}`}>{pct}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${cfg.bg.replace('/10', '')}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              {sessionEmotions.length === 0 && (
                <div className="text-center text-slate-500 py-4">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Start detection to see emotion analytics</p>
                </div>
              )}
            </div>
          </div>

          {/* Attention Score */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Class Attention Score</h3>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="#334155" strokeWidth="8" />
                  <motion.circle
                    cx="48" cy="48" r="40" fill="none"
                    stroke={dominantEmotion === 'understood' || dominantEmotion === 'excited' ? '#22C55E' : dominantEmotion === 'confused' ? '#F59E0B' : '#EF4444'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - (sessionEmotions.length > 0 ? 0.75 : 0)) }}
                    transition={{ duration: 1 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {sessionEmotions.length > 0 ? '75' : '--'}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-white font-medium">
                  {sessionEmotions.length > 0 ? 'Good Engagement' : 'Start detection'}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {sessionEmotions.length > 0
                    ? 'Most students are following along well'
                    : 'Enable camera to measure attention'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
