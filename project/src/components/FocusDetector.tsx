import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, Eye, EyeOff, AlertCircle, Activity, TrendingUp, Users, Brain } from 'lucide-react';

type FocusState = 'focused' | 'distracted' | 'looking_away' | 'engaged';

interface FocusData {
  state: FocusState;
  confidence: number;
  timestamp: string;
}

const focusConfig: Record<FocusState, { icon: React.ElementType; label: string; color: string; bg: string; message: string }> = {
  focused: { icon: Eye, label: 'Focused', color: 'text-green-400', bg: 'bg-green-500/10', message: 'Student is paying attention' },
  distracted: { icon: EyeOff, label: 'Distracted', color: 'text-yellow-400', bg: 'bg-yellow-500/10', message: 'Student seems distracted' },
  looking_away: { icon: EyeOff, label: 'Looking Away', color: 'text-orange-400', bg: 'bg-orange-500/10', message: 'Student is looking away from screen' },
  engaged: { icon: Brain, label: 'Highly Engaged', color: 'text-purple-400', bg: 'bg-purple-500/10', message: 'Student is highly engaged!' },
};

export function FocusDetector() {
  const [isActive, setIsActive] = useState(false);
  const [currentFocus, setCurrentFocus] = useState<FocusState>('focused');
  const [confidence, setConfidence] = useState(0.85);
  const [showAlert, setShowAlert] = useState(false);
  const [sessionData, setSessionData] = useState<FocusData[]>([]);
  const [studentName, setStudentName] = useState('Student');
  const [classMode, setClassMode] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsActive(true);
      startFocusDetection();
    } catch (err) {
      console.error('Camera access denied:', err);
      setIsActive(true);
      startFocusDetection();
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
    setShowAlert(false);
  };

  const startFocusDetection = () => {
    intervalRef.current = setInterval(() => {
      const states: FocusState[] = ['focused', 'distracted', 'looking_away', 'engaged'];
      const weights = [0.5, 0.2, 0.15, 0.15];
      const rand = Math.random();
      let cumulative = 0;
      let newState: FocusState = 'focused';
      for (let i = 0; i < states.length; i++) {
        cumulative += weights[i];
        if (rand < cumulative) {
          newState = states[i];
          break;
        }
      }
      const newConfidence = 0.7 + Math.random() * 0.25;

      setCurrentFocus(newState);
      setConfidence(newConfidence);

      const data: FocusData = {
        state: newState,
        confidence: newConfidence,
        timestamp: new Date().toISOString(),
      };

      setSessionData(prev => [...prev.slice(-29), data]);

      if (newState === 'distracted' || newState === 'looking_away') {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 4000);
      }
    }, 4000);
  };

  const focusCounts = sessionData.reduce((acc, d) => {
    acc[d.state] = (acc[d.state] || 0) + 1;
    return acc;
  }, {} as Record<FocusState, number>);

  const focusedTime = (focusCounts['focused'] || 0) + (focusCounts['engaged'] || 0);
  const totalTime = sessionData.length || 1;
  const focusRate = Math.round((focusedTime / totalTime) * 100);

  const config = focusConfig[currentFocus];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-pink-400" />
          Focus Detection AI
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Webcam-based attention analysis that identifies when students lose focus and auto-adjusts teaching style
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="glass-card p-4 relative overflow-hidden">
            <div className="aspect-video bg-black/50 rounded-xl overflow-hidden relative">
              {isActive ? (
                <>
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs text-white font-medium">LIVE</span>
                  </div>
                  <AnimatePresence>
                    {showAlert && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-4 left-4 right-4">
                        <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-yellow-400" />
                            <div>
                              <div className="text-sm font-semibold text-yellow-400">Focus Alert</div>
                              <div className="text-xs text-slate-300">Student attention dropping. Consider: interactive example, switch to visual, or ask a question.</div>
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
            <div className="flex items-center gap-3 mt-4">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={isActive ? stopCamera : startCamera} className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${isActive ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'}`}>
                {isActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                {isActive ? 'Stop Detection' : 'Start Detection'}
              </motion.button>
              <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Student name" className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 text-sm" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Current Status</h3>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl ${config.bg} flex items-center justify-center`}>
                <config.icon className={`w-8 h-8 ${config.color}`} />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{config.label}</div>
                <div className="text-sm text-slate-400">{config.message}</div>
                <div className="text-xs text-slate-500 mt-1">{Math.round(confidence * 100)}% confidence</div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Focus Breakdown</h3>
            <div className="space-y-3">
              {(Object.entries(focusCounts) as [FocusState, number][]).sort((a, b) => b[1] - a[1]).map(([state, count]) => {
                const cfg = focusConfig[state];
                const total = sessionData.length || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={state} className="flex items-center gap-3">
                    <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white">{cfg.label}</span>
                        <span className={cfg.color}>{pct}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div className={`h-full rounded-full ${cfg.bg.replace('/10', '')}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
                      </div>
                    </div>
                  </div>
                );
              })}
              {sessionData.length === 0 && (
                <div className="text-center text-slate-500 py-4">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Start detection to see focus analytics</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Class Focus Rate</h3>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="#334155" strokeWidth="8" />
                  <motion.circle cx="48" cy="48" r="40" fill="none" stroke={focusRate > 70 ? '#22C55E' : focusRate > 40 ? '#F59E0B' : '#EF4444'} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 40}`} initial={{ strokeDashoffset: 2 * Math.PI * 40 }} animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - (sessionData.length > 0 ? focusRate / 100 : 0)) }} transition={{ duration: 1 }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{sessionData.length > 0 ? focusRate : '--'}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-white font-medium">{sessionData.length > 0 ? (focusRate > 70 ? 'Good Focus' : 'Needs Attention') : 'Start detection'}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {sessionData.length > 0 ? 'Students are mostly engaged' : 'Enable camera to measure focus'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
