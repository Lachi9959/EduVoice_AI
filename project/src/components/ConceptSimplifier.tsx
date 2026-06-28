import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, BookOpen, Volume2, Copy, Check, Baby, GraduationCap, Brain } from 'lucide-react';
import { sampleConcepts } from '../data/mockData';
import { useSpeech } from '../hooks/useSpeech';
import type { Language, Difficulty } from '../types';
import { LanguageSelector } from './LanguageSelector';
import { Diagram } from './Diagram';
import { VoiceButton } from './VoiceButton';

export function ConceptSimplifier() {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedConcept, setSelectedConcept] = useState(sampleConcepts[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [explainLike10, setExplainLike10] = useState(false);
  const { isListening, transcript, startListening, stopListening, speak } = useSpeech();

  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        setIsProcessing(true);
        setTimeout(() => {
          const matched = sampleConcepts.find(c =>
            transcript.toLowerCase().includes(c.topic.toLowerCase())
          );
          if (matched) setSelectedConcept(matched);
          setIsProcessing(false);
        }, 1500);
      }
    } else {
      startListening();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedConcept.explanation[language]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSimplifiedExplanation = (text: string, diff: Difficulty, like10: boolean) => {
    if (like10) {
      return text.replace(/complex|complicated|difficult|advanced/gi, 'simple')
        .replace(/carbon dioxide/gi, 'the air we breathe out')
        .replace(/photosynthesis/gi, 'how plants eat')
        .replace(/evaporation/gi, 'when water goes up to the sky')
        .replace(/condensation/gi, 'when water turns into clouds');
    }
    if (diff === 'beginner') {
      return text + '\n\n(Beginner mode: Think of it like a simple recipe!)';
    }
    if (diff === 'advanced') {
      return text + '\n\n(Advanced mode: Explore the chemical equations and molecular mechanisms in detail.)';
    }
    return text;
  };

  const diffConfig = {
    beginner: { icon: Baby, label: 'Beginner', color: 'text-green-400', bg: 'bg-green-500/10' },
    intermediate: { icon: GraduationCap, label: 'Intermediate', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    advanced: { icon: Brain, label: 'Advanced', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Live Concept Simplification
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Speak a topic and get instant simplified explanations with visuals
          </p>
        </div>
        <LanguageSelector value={language} onChange={setLanguage} />
      </div>

      {/* Difficulty & ELI10 */}
      <div className="flex flex-wrap gap-3">
        {(Object.entries(diffConfig) as [Difficulty, typeof diffConfig.beginner][]).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDifficulty(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                difficulty === key
                  ? `${cfg.bg} ${cfg.color} border border-white/20`
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cfg.label}
            </motion.button>
          );
        })}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setExplainLike10(!explainLike10)}
          className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
            explainLike10
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Baby className="w-4 h-4" />
          Explain Like I am 10
        </motion.button>
      </div>

      {/* Voice Input */}
      <div className="glass-card p-8 text-center">
        <div className="flex justify-center mb-6">
          <VoiceButton isListening={isListening} onToggle={handleVoiceCommand} size="lg" />
        </div>
        <p className="text-lg font-medium text-white mb-2">
          {isListening ? 'Listening...' : 'Tap microphone to speak'}
        </p>
        <p className="text-sm text-slate-400">
          Try saying: "Explain Photosynthesis to Class 7"
        </p>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-white/5 rounded-lg text-slate-300 text-sm"
          >
            "{transcript}"
          </motion.div>
        )}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center justify-center gap-2 text-primary"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <span className="text-sm">AI is generating your lesson...</span>
          </motion.div>
        )}
      </div>

      {/* Topic Selector */}
      <div className="flex gap-3 flex-wrap">
        {sampleConcepts.map(concept => (
          <motion.button
            key={concept.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedConcept(concept)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedConcept.id === concept.id
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {concept.topic}
            <span className="ml-2 text-xs opacity-70">{concept.grade}</span>
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedConcept.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Explanation */}
          <div className="space-y-4">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-white">Explanation</h3>
                  {explainLike10 && (
                    <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                      ELI10
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => speak(selectedConcept.explanation[language])}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Volume2 className="w-4 h-4 text-slate-400" />
                  </button>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-secondary" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {getSimplifiedExplanation(selectedConcept.explanation[language], difficulty, explainLike10)}
              </p>
            </div>

            {/* Key Points */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-white">Key Points</h3>
              </div>
              <div className="space-y-3">
                {selectedConcept.keyPoints.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-xl"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{i + 1}</span>
                    </div>
                    <p className="text-slate-300 text-sm">{point[language]}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Fun Example */}
            <div className="glass-card p-6 border-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-white">Fun Example</h3>
              </div>
              <p className="text-slate-300 text-sm italic">
                "{selectedConcept.funExample[language]}"
              </p>
            </div>
          </div>

          {/* Visual Diagram */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Visual Diagram</h3>
            <div className="aspect-square bg-white/5 rounded-xl overflow-hidden">
              <Diagram type={selectedConcept.diagram} />
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="w-3 h-3" />
              <span>Interactive diagram - watch the animations!</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
