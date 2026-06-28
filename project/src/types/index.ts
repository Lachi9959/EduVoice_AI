export type Language = 'en' | 'hi';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Concept {
  id: number;
  topic: string;
  grade: string;
  explanation: Record<Language, string>;
  keyPoints: Array<Record<Language, string>>;
  funExample: Record<Language, string>;
  diagram: string;
}

export interface QuizQuestion {
  id: number;
  question: Record<Language, string>;
  options: Array<Record<Language, string>>;
  correctIndex: number;
  difficulty: Difficulty;
}

export interface Quiz {
  id: number;
  topic: string;
  questions: QuizQuestion[];
}

export interface TranslationItem {
  en: string;
  hi: string;
}

export interface ActivityGuide {
  id: number;
  title: string;
  steps: string[];
  safety: string[];
  duration: string;
  materials: string[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  condition: string;
}

export interface UserProgress {
  xp: number;
  streak: number;
  badges: string[];
  quizzesTaken: number;
  correctAnswers: number;
  totalAnswers: number;
}
