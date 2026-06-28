import { motion } from 'framer-motion';

interface WaveformProps {
  isActive: boolean;
  color?: string;
}

export function Waveform({ isActive, color = '#4F46E5' }: WaveformProps) {
  const bars = 20;

  return (
    <div className="flex items-center justify-center gap-[2px] h-16">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{ backgroundColor: color }}
          animate={
            isActive
              ? {
                  height: [8, 24 + Math.random() * 32, 8],
                  opacity: [0.5, 1, 0.5],
                }
              : { height: 8, opacity: 0.3 }
          }
          transition={
            isActive
              ? {
                  duration: 0.6 + Math.random() * 0.4,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: i * 0.05,
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}
