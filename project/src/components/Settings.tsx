import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Volume2, Type, Moon, Globe, Bell, Shield, ChevronRight } from 'lucide-react';

export function SettingsView() {
  const [settings, setSettings] = useState({
    voiceEnabled: true,
    textToSpeech: true,
    largeFont: false,
    darkMode: true,
    notifications: true,
    autoTranslate: false,
    hindiInput: true,
    englishInput: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      title: 'Voice & Audio',
      items: [
        { key: 'voiceEnabled' as const, label: 'Voice Commands', icon: Volume2, desc: 'Enable microphone for voice input' },
        { key: 'textToSpeech' as const, label: 'Text to Speech', icon: Volume2, desc: 'Read explanations aloud' },
      ],
    },
    {
      title: 'Accessibility',
      items: [
        { key: 'largeFont' as const, label: 'Large Font Size', icon: Type, desc: 'Increase text size for better readability' },
        { key: 'darkMode' as const, label: 'Dark Mode', icon: Moon, desc: 'Use dark theme throughout the app' },
      ],
    },
    {
      title: 'Language',
      items: [
        { key: 'hindiInput' as const, label: 'Hindi Voice Input', icon: Globe, desc: 'Recognize Hindi speech' },
        { key: 'englishInput' as const, label: 'English Voice Input', icon: Globe, desc: 'Recognize English speech' },
        { key: 'autoTranslate' as const, label: 'Auto Translate', icon: Globe, desc: 'Automatically translate all content' },
      ],
    },
    {
      title: 'Notifications',
      items: [
        { key: 'notifications' as const, label: 'Push Notifications', icon: Bell, desc: 'Get updates on new lessons and quizzes' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-400" />
          Settings
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Customize your EduVoice AI experience
        </p>
      </div>

      {sections.map((section, si) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            {section.title}
          </h3>
          <div className="space-y-4">
            {section.items.map(item => {
              const Icon = item.icon;
              const isEnabled = settings[item.key];
              return (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isEnabled ? 'bg-primary/20' : 'bg-white/5'
                    }`}>
                      <Icon className={`w-5 h-5 ${isEnabled ? 'text-primary' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <div className="text-white font-medium">{item.label}</div>
                      <div className="text-xs text-slate-400">{item.desc}</div>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleSetting(item.key)}
                    className={`w-12 h-7 rounded-full transition-colors relative ${
                      isEnabled ? 'bg-primary' : 'bg-white/10'
                    }`}
                  >
                    <motion.div
                      animate={{ x: isEnabled ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-5 h-5 rounded-full bg-white shadow-lg absolute top-1"
                    />
                  </motion.button>
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* About */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          About
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-300">Version</span>
            <span className="text-slate-400 text-sm">1.0.0</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-300">Built for</span>
            <span className="text-slate-400 text-sm">Indian Government Schools</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-300">Languages</span>
            <span className="text-slate-400 text-sm">English, Hindi, Hinglish</span>
          </div>
        </div>
      </div>
    </div>
  );
}
