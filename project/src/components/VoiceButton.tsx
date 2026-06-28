import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function VoiceButton({ isListening, onToggle, size = 'md' }: VoiceButtonProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`relative ${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-300 ${
        isListening
          ? 'bg-red-500/20 border-2 border-red-500'
          : 'bg-primary/20 border-2 border-primary hover:bg-primary/30'
      }`}
    >
      {isListening && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500/10"
            animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </>
      )}
      {isListening ? (
        <MicOff className={`${iconSizes[size]} text-red-400`} />
      ) : (
        <Mic className={`${iconSizes[size]} text-primary`} />
      )}
    </motion.button>
  );
}
