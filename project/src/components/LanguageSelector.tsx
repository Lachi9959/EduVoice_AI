import { motion } from 'framer-motion';
import type { Language } from '../types';

interface LanguageSelectorProps {
  value: Language;
  onChange: (lang: Language) => void;
}

const languages: { id: Language; label: string; flag: string }[] = [
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'hi', label: 'Hindi', flag: '🇮🇳' },
];

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
      {languages.map(lang => (
        <motion.button
          key={lang.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(lang.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            value === lang.id
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="mr-1">{lang.flag}</span>
          {lang.label}
        </motion.button>
      ))}
    </div>
  );
}
