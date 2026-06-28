import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  rotation: number;
}

const colors = ['#4F46E5', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export function Confetti({ trigger }: { trigger: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (trigger) {
      const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8,
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
      }));
      setPieces(newPieces);
      const timer = setTimeout(() => setPieces([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <AnimatePresence>
        {pieces.map(piece => (
          <motion.div
            key={piece.id}
            className="absolute rounded-sm"
            style={{
              left: `${piece.x}%`,
              width: piece.size,
              height: piece.size * 0.6,
              backgroundColor: piece.color,
              top: -20,
            }}
            initial={{ y: -20, rotate: 0, opacity: 1 }}
            animate={{
              y: window.innerHeight + 50,
              rotate: piece.rotation + 720,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2 + Math.random() * 1,
              delay: piece.delay,
              ease: 'easeIn',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
