import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Clock, Trophy, Star, ArrowRight, RotateCcw, Volume2, Brain, Target, Zap } from 'lucide-react';
import { sampleQuizzes, badges } from '../data/mockData';
import { useSpeech } from '../hooks/useSpeech';
import type { Language, Difficulty } from '../types';
import { LanguageSelector } from './LanguageSelector';
import { Confetti } from './Confetti';
import { VoiceButton } from './VoiceButton';

export function QuizGenerator() {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedQuiz, setSelectedQuiz] = useState(sampleQuizzes[0]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const { isListening, transcript, startListening, stopListening, speak } = useSpeech();

  const filteredQuestions = selectedQuiz.questions.filter(
    q => !adaptiveMode || q.difficulty === difficulty
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && timer > 0 && !showResult) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && isActive) {
      handleNext();
    }
    return () => clearInterval(interval);
  }, [isActive, timer, showResult]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setTimer(30);
    setSelectedAnswer(null);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null || !isActive) return;
    setSelectedAnswer(index);

    const isCorrect = index === filteredQuestions[currentQuestion].correctIndex;
    if (isCorrect) {
      setScore(s => s + 1);
      if (adaptiveMode && difficulty !== 'advanced') {
        setDifficulty(d => d === 'beginner' ? 'intermediate' : 'advanced');
      }
    } else if (adaptiveMode && difficulty !== 'beginner') {
      setDifficulty(d => d === 'advanced' ? 'intermediate' : 'beginner');
    }

    setTimeout(() => {
      if (currentQuestion < filteredQuestions.length - 1) {
        setCurrentQuestion(c => c + 1);
        setSelectedAnswer(null);
        setTimer(30);
      } else {
        setShowResult(true);
        setIsActive(false);
        if (score + (isCorrect ? 1 : 0) === filteredQuestions.length) {
          setShowConfetti(true);
        }
      }
    }, 1500);
  };

  const handleNext = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedAnswer(null);
      setTimer(30);
    } else {
      setShowResult(true);
      setIsActive(false);
    }
  };

  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening();
      if (transcript.toLowerCase().includes('quiz') || transcript.toLowerCase().includes('start')) {
        handleStart();
      }
    } else {
      startListening();
    }
  };

  const question = filteredQuestions[currentQuestion];
  const isCorrect = selectedAnswer === question?.correctIndex;
  const progress = filteredQuestions.length > 0
    ? ((currentQuestion + (selectedAnswer !== null ? 1 : 0)) / filteredQuestions.length) * 100
    : 0;

  const diffColors = {
    beginner: 'text-green-400 bg-green-500/10 border-green-500/20',
    intermediate: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    advanced: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className="space-y-6">
      <Confetti trigger={showConfetti} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-secondary" />
            Voice Triggered Quiz
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Say "Create a quiz on [topic]" or select one below
          </p>
        </div>
        <LanguageSelector value={language} onChange={setLanguage} />
      </div>

      {/* Difficulty & Adaptive */}
      <div className="flex flex-wrap gap-3">
        {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map(d => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
              difficulty === d ? diffColors[d] : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => setAdaptiveMode(!adaptiveMode)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
            adaptiveMode ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-slate-400'
          }`}
        >
          <Brain className="w-3 h-3" />
          Adaptive AI
        </button>
      </div>

      {/* Quiz Selector / Voice Input */}
      {!isActive && !showResult && (
        <div className="glass-card p-8 text-center space-y-6">
          <div className="flex justify-center">
            <VoiceButton isListening={isListening} onToggle={handleVoiceCommand} size="lg" />
          </div>
          <p className="text-lg font-medium text-white">
            {isListening ? 'Listening for quiz topic...' : 'Tap microphone and speak a topic'}
          </p>
          {transcript && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-white/5 rounded-lg text-slate-300 text-sm">
              "{transcript}"
            </motion.div>
          )}

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {sampleQuizzes.map(quiz => (
              <motion.button
                key={quiz.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setSelectedQuiz(quiz); handleStart(); }}
                className="px-6 py-3 rounded-xl bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 font-medium transition-all"
              >
                {quiz.topic}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Active Quiz */}
      {isActive && question && (
        <div className="max-w-2xl mx-auto">
          {/* Progress & Timer */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                Question {currentQuestion + 1} of {filteredQuestions.length}
              </span>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-xs ${diffColors[difficulty]}`}>
                  {difficulty}
                </span>
                <div className={`flex items-center gap-1 ${timer <= 10 ? 'text-red-400' : 'text-slate-400'}`}>
                  <Clock className="w-4 h-4" />
                  <span className="font-mono font-bold">{timer}s</span>
                </div>
              </div>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8"
          >
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-xl font-semibold text-white leading-relaxed">
                {question.question[language]}
              </h3>
              <button
                onClick={() => speak(question.question[language])}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex-shrink-0 ml-4"
              >
                <Volume2 className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, i) => {
                const isSelected = selectedAnswer === i;
                const isCorrectOption = i === question.correctIndex;
                const showCorrectness = selectedAnswer !== null;

                let buttonClass = 'w-full p-4 rounded-xl text-left font-medium transition-all border ';
                if (showCorrectness) {
                  if (isCorrectOption) buttonClass += 'bg-secondary/20 border-secondary text-secondary';
                  else if (isSelected) buttonClass += 'bg-red-500/20 border-red-500 text-red-400';
                  else buttonClass += 'bg-white/5 border-white/10 text-slate-500';
                } else {
                  buttonClass += 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 cursor-pointer';
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={showCorrectness ? {} : { scale: 1.01 }}
                    whileTap={showCorrectness ? {} : { scale: 0.99 }}
                    onClick={() => handleAnswer(i)}
                    disabled={selectedAnswer !== null}
                    className={buttonClass}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        showCorrectness
                          ? isCorrectOption ? 'bg-secondary/30 text-secondary'
                          : isSelected ? 'bg-red-500/30 text-red-400' : 'bg-white/5 text-slate-500'
                          : 'bg-white/10 text-slate-300'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span>{option[language]}</span>
                      {showCorrectness && isCorrectOption && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                          <Star className="w-5 h-5 text-secondary" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-xl text-center">
                {isCorrect ? (
                  <div className="text-secondary font-semibold flex items-center justify-center gap-2">
                    <Star className="w-5 h-5" />
                    Correct! Well done!
                    {adaptiveMode && <span className="text-xs text-slate-400 ml-2">(Difficulty increased)</span>}
                  </div>
                ) : (
                  <div className="text-red-400 font-semibold">
                    Oops! The correct answer was {String.fromCharCode(65 + question.correctIndex)}
                    {adaptiveMode && <span className="text-xs text-slate-400 ml-2">(Difficulty adjusted)</span>}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-md mx-auto glass-card p-8 text-center space-y-6"
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Trophy className="w-10 h-10 text-primary" />
              </div>
            </motion.div>

            <h3 className="text-2xl font-bold text-white">Quiz Complete!</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-3xl font-bold text-primary">{score}</div>
                <div className="text-sm text-slate-400">Correct</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <div className="text-3xl font-bold text-accent">
                  {Math.round((score / filteredQuestions.length) * 100)}%
                </div>
                <div className="text-sm text-slate-400">Accuracy</div>
              </div>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2">
              {Array.from({ length: 3 }).map((_, i) => {
                const threshold = (i + 1) * (filteredQuestions.length / 3);
                const earned = score >= threshold;
                return (
                  <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + i * 0.2 }}>
                    <Star className={`w-10 h-10 ${earned ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
                  </motion.div>
                );
              })}
            </div>

            {score === filteredQuestions.length && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="p-3 bg-secondary/10 rounded-xl border border-secondary/30">
                <div className="text-sm text-secondary font-medium">
                  Badge Unlocked: {badges.find(b => b.id === 'perfect-score')?.name}
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium flex items-center gap-2 mx-auto hover:bg-primary/90 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
