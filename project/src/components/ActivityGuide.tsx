import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Shield, CheckCircle2, ChevronRight, ChevronLeft, RotateCcw, Play, Pause, FlaskConical } from 'lucide-react';
import { activityGuides } from '../data/mockData';

export function ActivityGuide() {
  const [selectedActivity, setSelectedActivity] = useState(activityGuides[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default

  const handleStepComplete = (step: number) => {
    setCompletedSteps(prev => new Set(prev).add(step));
    if (step < selectedActivity.steps.length - 1) {
      setCurrentStep(step + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setTimerRunning(false);
    setTimeLeft(300);
  };

  const progress = (completedSteps.size / selectedActivity.steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-purple-400" />
          Hands-Free Activity Guide
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Step-by-step science experiments with safety instructions
        </p>
      </div>

      {/* Activity Selector */}
      <div className="flex gap-3 flex-wrap">
        {activityGuides.map(activity => (
          <motion.button
            key={activity.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedActivity(activity);
              handleReset();
            }}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              selectedActivity.id === activity.id
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {activity.title}
            <span className="ml-2 text-xs opacity-70">{activity.duration}</span>
          </motion.button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Progress</span>
          <span className="text-sm font-medium text-white">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Materials */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Materials Needed</h3>
        <div className="flex flex-wrap gap-2">
          {selectedActivity.materials.map((material, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-white/5 text-slate-300 text-sm rounded-lg border border-white/10"
            >
              {material}
            </span>
          ))}
        </div>
      </div>

      {/* Safety Instructions */}
      <div className="glass-card p-5 border-yellow-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-yellow-400" />
          <h3 className="text-sm font-semibold text-yellow-400">Safety First</h3>
        </div>
        <ul className="space-y-2">
          {selectedActivity.safety.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-yellow-400 mt-0.5">⚠️</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {selectedActivity.steps.map((step, i) => {
          const isCompleted = completedSteps.has(i);
          const isCurrent = i === currentStep;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-5 transition-all ${
                isCompleted
                  ? 'border-secondary/30 bg-secondary/5'
                  : isCurrent
                    ? 'border-primary/30 ring-1 ring-primary/20'
                    : 'border-white/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? 'bg-secondary/20'
                    : isCurrent
                      ? 'bg-primary/20'
                      : 'bg-white/5'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  ) : (
                    <span className={`text-sm font-bold ${isCurrent ? 'text-primary' : 'text-slate-500'}`}>
                      {i + 1}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <p className={`text-sm leading-relaxed ${isCompleted ? 'text-slate-500 line-through' : 'text-white'}`}>
                    {step}
                  </p>

                  {isCurrent && !isCompleted && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStepComplete(i)}
                      className="mt-3 px-4 py-2 bg-primary text-white text-sm rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Mark as Complete
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Timer */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Timer className="w-5 h-5 text-primary" />
            <div>
              <div className="text-sm font-medium text-white">
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </div>
              <div className="text-xs text-slate-400">Estimated time</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              {timerRunning ? <Pause className="w-4 h-4 text-slate-400" /> : <Play className="w-4 h-4 text-primary" />}
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 text-center border-secondary/30 bg-secondary/5"
        >
          <CheckCircle2 className="w-12 h-12 text-secondary mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Experiment Complete!</h3>
          <p className="text-slate-400 text-sm">Great job following all the steps safely!</p>
        </motion.div>
      )}
    </div>
  );
}
