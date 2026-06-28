import { useState, useCallback } from 'react';
import type { UserProgress } from '../types';

const initialProgress: UserProgress = {
  xp: 0,
  streak: 3,
  badges: ['first-quiz', 'explorer'],
  quizzesTaken: 2,
  correctAnswers: 7,
  totalAnswers: 10,
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(initialProgress);

  const addXP = useCallback((amount: number) => {
    setProgress(prev => ({ ...prev, xp: prev.xp + amount }));
  }, []);

  const addBadge = useCallback((badgeId: string) => {
    setProgress(prev => {
      if (prev.badges.includes(badgeId)) return prev;
      return { ...prev, badges: [...prev.badges, badgeId] };
    });
  }, []);

  const recordQuiz = useCallback((correct: number, total: number) => {
    setProgress(prev => ({
      ...prev,
      quizzesTaken: prev.quizzesTaken + 1,
      correctAnswers: prev.correctAnswers + correct,
      totalAnswers: prev.totalAnswers + total,
      xp: prev.xp + correct * 10,
    }));
  }, []);

  const incrementStreak = useCallback(() => {
    setProgress(prev => ({ ...prev, streak: prev.streak + 1 }));
  }, []);

  const accuracy = progress.totalAnswers > 0
    ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100)
    : 0;

  return { progress, addXP, addBadge, recordQuiz, incrementStreak, accuracy };
}
