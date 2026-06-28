import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Play, Clock, Star, ChevronRight, Search, Filter } from 'lucide-react';
import { sampleConcepts } from '../data/mockData';
import type { Language } from '../types';
import { LanguageSelector } from './LanguageSelector';
import { Diagram } from './Diagram';

const allLessons = [
  ...sampleConcepts,
  {
    id: 4,
    topic: "Fractions",
    grade: "Class 5",
    explanation: {
      en: "Fractions represent parts of a whole. If you cut a pizza into 4 equal slices, each slice is 1/4 of the pizza!",
      hi: "भिन्न एक पूरे के भागों को दर्शाती हैं। यदि आप एक पिज्जा को 4 बराबर टुकड़ों में काटते हैं, तो प्रत्येक टुकड़ा पिज्जा का 1/4 है!",
      hinglish: "Fractions ek whole ke parts ko darshati hain. Agar aap ek pizza ko 4 equal pieces mein kaat te hain, toh har piece pizza ka 1/4 hai!"
    },
    keyPoints: [
      { en: "Numerator is the top number", hi: "अंश ऊपर की संख्या है", hinglish: "Numerator upar ki number hai" },
      { en: "Denominator is the bottom number", hi: "हर नीचे की संख्या है", hinglish: "Denominator neeche ki number hai" },
      { en: "Same denominator means same size pieces", hi: "समान हर का अर्थ है समान आकार के टुकड़े", hinglish: "Same denominator matlab same size pieces" }
    ],
    funExample: {
      en: "If you have 3/4 of a chocolate bar, you have 3 pieces and need 1 more to make a whole bar!",
      hi: "यदि आपके पास चॉकलेट बार का 3/4 है, तो आपके पास 3 टुकड़े हैं और एक पूरी बार बनाने के लिए 1 और चाहिए!",
      hinglish: "Agar aapke paas chocolate bar ka 3/4 hai, toh aapke paas 3 pieces hain aur ek poori bar banane ke liye 1 aur chahiye!"
    },
    diagram: "fractions"
  },
  {
    id: 5,
    topic: "States of Matter",
    grade: "Class 6",
    explanation: {
      en: "Matter exists in three states: solid, liquid, and gas. Ice is solid water, liquid water flows, and steam is water as gas!",
      hi: "पदार्थ तीन अवस्थाओं में मौजूद है: ठोस, द्रव और गैस। बर्फ ठोस पानी है, तरल पानी बहता है, और भाप गैस के रूप में पानी है!",
      hinglish: "Matter teen states mein exist karta hai: solid, liquid, aur gas. Barf solid paani hai, liquid paani behta hai, aur steam gas ke roop mein paani hai!"
    },
    keyPoints: [
      { en: "Solids have fixed shape", hi: "ठोसों का आकार निश्चित होता है", hinglish: "Solids ka shape fixed hota hai" },
      { en: "Liquids take the shape of their container", hi: "द्रव अपने बर्तन का आकार लेते हैं", hinglish: "Liquids apne container ka shape lete hain" },
      { en: "Gases spread to fill space", hi: "गैसें फैलकर स्थान भरती हैं", hinglish: "Gases failkar space bhar deti hain" }
    ],
    funExample: {
      en: "Think of a snowman! Solid snow melts to liquid water, which evaporates to gas you can't see!",
      hi: "एक स्नोमैन के बारे में सोचें! ठोस बर्फ पिघलकर तरल पानी बनती है, जो भाप बनकर उड़ जाती है!",
      hinglish: "Ek snowman ke baare mein socho! Solid barf pighal ke liquid paani ban jaati hai, jo evaporate ho ke gas ban jaati hai jo dikhai nahi deti!"
    },
    diagram: "states-of-matter"
  },
  {
    id: 6,
    topic: "Indian Constitution",
    grade: "Class 8",
    explanation: {
      en: "The Indian Constitution is the supreme law of India, adopted in 1950. It defines the structure, powers, and duties of government institutions.",
      hi: "भारतीय संविधान भारत का सर्वोच्च कानून है, जो 1950 में अपनाया गया। यह सरकारी संस्थानों की संरचना, शक्तियों और कर्तव्यों को परिभाषित करता है।",
      hinglish: "Bharatiya Samvidhan Bharat ka sarvochch kanoon hai, jo 1950 mein apnaya gaya. Yeh sarkari sansthaon ki structure, powers aur duties ko define karta hai."
    },
    keyPoints: [
      { en: "Longest written constitution in the world", hi: "दुनिया का सबसे लंबा लिखित संविधान", hinglish: "Duniya ka sabse lamba likhit samvidhan" },
      { en: "Fundamental Rights for all citizens", hi: "सभी नागरिकों के लिए मौलिक अधिकार", hinglish: "Sabhi nagriko ke liye maulik adhikaar" },
      { en: "Secular and Democratic Republic", hi: "धर्मनिरपेक्ष और लोकतांत्रिक गणराज्य", hinglish: "Dharmanirapeksh aur loktantrik ganrajya" }
    ],
    funExample: {
      en: "The Constitution is like a rulebook for a game - it ensures everyone plays fair!",
      hi: "संविधान एक खेल की नियमावली की तरह है - यह सुनिश्चित करता है कि सभी निष्पक्ष रूप से खेलें!",
      hinglish: "Samvidhan ek game ke rulebook ki tarah hai - yeh ensure karta hai ki sabhi fair khelein!"
    },
    diagram: "constitution"
  }
];

export function Lessons() {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedLesson, setSelectedLesson] = useState(allLessons[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');

  const grades = ['all', ...Array.from(new Set(allLessons.map(l => l.grade)))];

  const filteredLessons = allLessons.filter(lesson => {
    const matchesSearch = lesson.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = filterGrade === 'all' || lesson.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Lessons Library
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Browse all available lessons with AI-generated explanations
          </p>
        </div>
        <LanguageSelector value={language} onChange={setLanguage} />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons..."
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50"
          >
            {grades.map(grade => (
              <option key={grade} value={grade} className="bg-[#1E293B]">
                {grade === 'all' ? 'All Grades' : grade}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lesson List */}
        <div className="space-y-3 lg:col-span-1">
          {filteredLessons.map((lesson, i) => (
            <motion.button
              key={lesson.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedLesson(lesson)}
              className={`w-full text-left p-4 rounded-xl transition-all border ${
                selectedLesson.id === lesson.id
                  ? 'bg-primary/10 border-primary/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`font-medium ${selectedLesson.id === lesson.id ? 'text-primary' : 'text-white'}`}>
                    {lesson.topic}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">{lesson.grade}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">{lesson.keyPoints.length} key points</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${selectedLesson.id === lesson.id ? 'text-primary' : 'text-slate-500'}`} />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Lesson Detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedLesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Explanation Card */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{selectedLesson.topic}</h3>
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
                  {selectedLesson.grade}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                {selectedLesson.explanation[language]}
              </p>
            </div>

            {/* Key Points */}
            <div className="glass-card p-6">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-accent" />
                Key Points
              </h4>
              <div className="space-y-2">
                {selectedLesson.keyPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-slate-300 text-sm">{point[language]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fun Example */}
            <div className="glass-card p-6 border-accent/20">
              <h4 className="text-sm font-semibold text-accent mb-2">Fun Example</h4>
              <p className="text-slate-300 text-sm italic">
                "{selectedLesson.funExample[language]}"
              </p>
            </div>

            {/* Diagram */}
            <div className="glass-card p-6">
              <h4 className="text-sm font-semibold text-white mb-3">Visual Diagram</h4>
              <div className="aspect-video bg-white/5 rounded-xl overflow-hidden">
                <Diagram type={selectedLesson.diagram} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
