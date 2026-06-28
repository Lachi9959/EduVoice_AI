import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, Volume2, Copy, Check, ArrowRightLeft, Mic, MicOff } from 'lucide-react';
import { translations } from '../data/mockData';
import { useSpeech } from '../hooks/useSpeech';
import type { Language } from '../types';

export function Translator() {
  const [inputText, setInputText] = useState('');
  const [output, setOutput] = useState<{ en: string; hi: string } | null>(null);
  const [copiedLang, setCopiedLang] = useState<Language | null>(null);
  const { isListening, transcript, startListening, stopListening, speak } = useSpeech();

  const handleTranslate = () => {
    const text = inputText.trim() || transcript.trim();
    if (!text) return;

    const matched = translations.find(t =>
      t.en.toLowerCase().includes(text.toLowerCase()) ||
      text.toLowerCase().includes(t.en.toLowerCase())
    );

    if (matched) {
      setOutput(matched);
    } else {
      setOutput({
        en: text,
        hi: `[Hindi translation of: ${text}]`,
      });
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        setInputText(transcript);
        setTimeout(handleTranslate, 100);
      }
    } else {
      startListening();
    }
  };

  const handleCopy = (lang: Language) => {
    if (!output) return;
    navigator.clipboard.writeText(output[lang]);
    setCopiedLang(lang);
    setTimeout(() => setCopiedLang(null), 2000);
  };

  const langConfig = [
    { id: 'en' as Language, label: 'English', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { id: 'hi' as Language, label: 'Hindi', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Languages className="w-6 h-6 text-accent" />
          Bilingual Dictation & Translation
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Speak or type in any language and get instant translations
        </p>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="text-sm text-slate-400 mb-2 block">Enter text or speak</label>
            <textarea
              value={isListening ? transcript : inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or speak something..."
              className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVoiceInput}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-red-500/20 border-2 border-red-500'
                  : 'bg-primary/20 border-2 border-primary hover:bg-primary/30'
              }`}
            >
              {isListening ? <MicOff className="w-6 h-6 text-red-400" /> : <Mic className="w-6 h-6 text-primary" />}
            </motion.button>
            <span className="text-xs text-slate-400 text-center">
              {isListening ? 'Stop' : 'Speak'}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTranslate}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Translate
          </motion.button>

          <div className="flex gap-2 flex-wrap">
            {translations.slice(0, 3).map((t, i) => (
              <button
                key={i}
                onClick={() => { setInputText(t.en); setTimeout(handleTranslate, 100); }}
                className="px-3 py-2 text-xs bg-white/5 text-slate-400 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                {t.en.substring(0, 25)}...
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {output && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-2 gap-4"
          >
            {langConfig.map((lang) => (
              <motion.div
                key={lang.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: langConfig.indexOf(lang) * 0.1 }}
                className={`glass-card p-5 border ${lang.border}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex items-center gap-2 ${lang.bg} px-3 py-1 rounded-lg`}>
                    <span className={`text-sm font-medium ${lang.color}`}>{lang.label}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => speak(output[lang.id], lang.id === 'hi' ? 'hi-IN' : 'en-IN')}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Volume2 className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => handleCopy(lang.id)}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      {copiedLang === lang.id ? (
                        <Check className="w-4 h-4 text-secondary" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-white text-sm leading-relaxed">
                  {output[lang.id]}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
