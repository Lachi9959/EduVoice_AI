import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Particles } from './components/Particles';
import { Sidebar } from './components/Sidebar';
import { ProgressBar } from './components/ProgressBar';
import { LandingPage } from './components/LandingPage';
import { ConceptSimplifier } from './components/ConceptSimplifier';
import { QuizGenerator } from './components/QuizGenerator';
import { Translator } from './components/Translator';
import { ActivityGuide } from './components/ActivityGuide';
import { Analytics } from './components/Analytics';
import { Lessons } from './components/Lessons';
import { SettingsView } from './components/Settings';
import { ClassroomTwin } from './components/ClassroomTwin';
import { EmotionDetector } from './components/EmotionDetector';
import { ClassroomBattle } from './components/ClassroomBattle';
import { StoryGenerator } from './components/StoryGenerator';
import { CareerConnector } from './components/CareerConnector';
import { ExamMode } from './components/ExamMode';
import { MagicBoard } from './components/MagicBoard';
import { LearningDNA } from './components/LearningDNA';
import { EduBot } from './components/EduBot';
import { FocusDetector } from './components/FocusDetector';
import { ConfusionHeatmap } from './components/ConfusionHeatmap';
import { AnonymousDoubts } from './components/AnonymousDoubts';
import { ARVisualizer } from './components/ARVisualizer';
import { SmartRevision } from './components/SmartRevision';
import { useProgress } from './hooks/useProgress';

export type View = 'home' | 'teach' | 'lessons' | 'quiz' | 'translate' | 'activity' | 'analytics' | 'settings' | 'twin' | 'emotion' | 'battle' | 'story' | 'career' | 'exam' | 'magicboard' | 'dna' | 'focus' | 'heatmap' | 'doubts' | 'ar' | 'revision';

const viewComponents: Record<View, React.ComponentType> = {
  home: () => null,
  teach: ConceptSimplifier,
  lessons: Lessons,
  quiz: QuizGenerator,
  translate: Translator,
  activity: ActivityGuide,
  analytics: Analytics,
  settings: SettingsView,
  twin: ClassroomTwin,
  emotion: EmotionDetector,
  battle: ClassroomBattle,
  story: StoryGenerator,
  career: CareerConnector,
  exam: ExamMode,
  magicboard: MagicBoard,
  dna: LearningDNA,
  focus: FocusDetector,
  heatmap: ConfusionHeatmap,
  doubts: AnonymousDoubts,
  ar: ARVisualizer,
  revision: SmartRevision,
};

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const { progress, accuracy } = useProgress();

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  const CurrentComponent = viewComponents[currentView];

  return (
    <div className="min-h-screen bg-background">
      <Particles />

      {currentView !== 'home' && (
        <>
          <Sidebar currentView={currentView} onNavigate={handleNavigate} />
          <ProgressBar progress={progress} accuracy={accuracy} />
        </>
      )}

      <main
        className={`transition-all duration-300 ${
          currentView === 'home' ? '' : 'pl-20 lg:pl-64 pt-16'
        }`}
      >
        <AnimatePresence mode="wait">
          {currentView === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LandingPage onNavigate={handleNavigate} />
            </motion.div>
          ) : (
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6 max-w-6xl mx-auto"
            >
              <CurrentComponent />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <EduBot />
    </div>
  );
}
