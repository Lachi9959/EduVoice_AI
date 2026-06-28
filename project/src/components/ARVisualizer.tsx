import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, RotateCcw, ZoomIn, ZoomOut, Move, Layers, Info, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface Model3D {
  id: string;
  topic: string;
  title: string;
  description: string;
  parts: { name: string; description: string; color: string }[];
  funFact: string;
}

const models: Model3D[] = [
  {
    id: 'solar-system',
    topic: 'Solar System',
    title: 'Interactive Solar System',
    description: 'Explore the planets orbiting around the Sun in real-time 3D simulation.',
    parts: [
      { name: 'Sun', description: 'Center star, provides light and heat', color: '#F59E0B' },
      { name: 'Mercury', description: 'Closest planet, very hot', color: '#94A3B8' },
      { name: 'Venus', description: 'Hottest planet, thick atmosphere', color: '#FCD34D' },
      { name: 'Earth', description: 'Our home, only planet with life', color: '#3B82F6' },
      { name: 'Mars', description: 'Red planet, has polar ice caps', color: '#EF4444' },
      { name: 'Jupiter', description: 'Largest planet, gas giant', color: '#D97706' },
      { name: 'Saturn', description: 'Famous rings, gas giant', color: '#FDE68A' },
      { name: 'Uranus', description: 'Ice giant, rotates on its side', color: '#22D3EE' },
      { name: 'Neptune', description: 'Windiest planet, deep blue', color: '#4F46E5' },
    ],
    funFact: 'If the Sun were the size of a basketball, Earth would be the size of a sesame seed!',
  },
  {
    id: 'human-heart',
    topic: 'Human Body',
    title: 'Human Heart Explorer',
    description: 'Discover how the heart pumps blood throughout the body.',
    parts: [
      { name: 'Right Atrium', description: 'Receives blood from the body', color: '#EF4444' },
      { name: 'Right Ventricle', description: 'Pumps blood to the lungs', color: '#DC2626' },
      { name: 'Left Atrium', description: 'Receives oxygen-rich blood', color: '#F87171' },
      { name: 'Left Ventricle', description: 'Pumps blood to the body', color: '#B91C1C' },
      { name: 'Aorta', description: 'Largest artery in the body', color: '#7F1D1D' },
      { name: 'Valves', description: 'Prevent backflow of blood', color: '#FCA5A5' },
    ],
    funFact: 'Your heart beats about 100,000 times per day, pumping 2,000 gallons of blood!',
  },
  {
    id: 'atom',
    topic: 'Chemistry',
    title: 'Atom Structure',
    description: 'Visualize the building blocks of matter.',
    parts: [
      { name: 'Protons', description: 'Positively charged, in nucleus', color: '#EF4444' },
      { name: 'Neutrons', description: 'Neutral charge, in nucleus', color: '#3B82F6' },
      { name: 'Electrons', description: 'Negatively charged, orbit nucleus', color: '#22C55E' },
      { name: 'Nucleus', description: 'Center of the atom', color: '#F59E0B' },
    ],
    funFact: 'Atoms are 99.9999999% empty space. If an atom were the size of a stadium, the nucleus would be a pea!',
  },
];

export function ARVisualizer() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleRotate = (direction: 'left' | 'right') => {
    setRotation(prev => prev + (direction === 'left' ? -30 : 30));
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => Math.max(0.5, Math.min(2, prev + (direction === 'in' ? 0.2 : -0.2))));
  };

  const renderModel = () => {
    if (selectedModel.id === 'solar-system') {
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <motion.g animate={{ rotate: rotation }} transition={{ duration: 0.5 }} style={{ transformOrigin: '200px 150px' }}>
            <circle cx="200" cy="150" r="25" fill="#F59E0B" opacity="0.9" />
            <text x="200" y="110" textAnchor="middle" fill="#F59E0B" fontSize="10">Sun</text>
            {selectedModel.parts.slice(1).map((planet, i) => {
              const orbitRadius = 50 + i * 22;
              const angle = (rotation + i * 40) * (Math.PI / 180);
              const px = 200 + orbitRadius * Math.cos(angle);
              const py = 150 + orbitRadius * Math.sin(angle) * 0.4;
              return (
                <g key={planet.name}>
                  <ellipse cx="200" cy="150" rx={orbitRadius} ry={orbitRadius * 0.4} fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                  <motion.circle
                    cx={px} cy={py} r={4 + (i === 4 ? 8 : i === 5 ? 7 : 3)}
                    fill={planet.color}
                    opacity={selectedPart === i + 1 ? 1 : 0.8}
                    stroke={selectedPart === i + 1 ? '#fff' : 'none'}
                    strokeWidth={selectedPart === i + 1 ? 2 : 0}
                    onClick={() => setSelectedPart(selectedPart === i + 1 ? null : i + 1)}
                    style={{ cursor: 'pointer' }}
                  />
                  {selectedPart === i + 1 && (
                    <text x={px} y={py - 12} textAnchor="middle" fill="#fff" fontSize="9">{planet.name}</text>
                  )}
                </g>
              );
            })}
          </motion.g>
        </svg>
      );
    }

    if (selectedModel.id === 'human-heart') {
      return (
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <motion.g animate={{ rotate: rotation }} transition={{ duration: 0.5 }} style={{ transformOrigin: '150px 150px' }}>
            <path d="M150 80 C120 50, 70 80, 70 130 C70 180, 150 250, 150 250 C150 250, 230 180, 230 130 C230 80, 180 50, 150 80" fill="#DC2626" opacity="0.8" />
            {selectedModel.parts.map((part, i) => {
              const positions = [
                { x: 100, y: 100 }, { x: 100, y: 160 }, { x: 180, y: 100 }, { x: 180, y: 160 }, { x: 150, y: 60 }, { x: 150, y: 200 },
              ];
              const pos = positions[i] || { x: 150, y: 150 };
              return (
                <g key={part.name}>
                  <motion.circle
                    cx={pos.x} cy={pos.y} r={selectedPart === i ? 18 : 14}
                    fill={part.color}
                    opacity={selectedPart === i ? 1 : 0.7}
                    stroke={selectedPart === i ? '#fff' : 'none'}
                    strokeWidth={selectedPart === i ? 2 : 0}
                    onClick={() => setSelectedPart(selectedPart === i ? null : i)}
                    style={{ cursor: 'pointer' }}
                  />
                  {selectedPart === i && (
                    <text x={pos.x} y={pos.y - 22} textAnchor="middle" fill="#fff" fontSize="9">{part.name}</text>
                  )}
                </g>
              );
            })}
          </motion.g>
        </svg>
      );
    }

    if (selectedModel.id === 'atom') {
      return (
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <motion.g animate={{ rotate: rotation }} transition={{ duration: 0.5 }} style={{ transformOrigin: '150px 150px' }}>
            <circle cx="150" cy="150" r="20" fill="#F59E0B" opacity="0.9" />
            {[0, 60, 120].map((angle, i) => (
              <g key={i}>
                <ellipse cx="150" cy="150" rx="80" ry="30" fill="none" stroke="#334155" strokeWidth="1" transform={`rotate(${angle} 150 150)`} />
                <motion.circle
                  cx={150 + 80 * Math.cos((rotation + angle) * Math.PI / 180)}
                  cy={150 + 30 * Math.sin((rotation + angle) * Math.PI / 180)}
                  r="6"
                  fill="#22C55E"
                  opacity={selectedPart === i ? 1 : 0.8}
                  stroke={selectedPart === i ? '#fff' : 'none'}
                  strokeWidth={selectedPart === i ? 2 : 0}
                  onClick={() => setSelectedPart(selectedPart === i ? null : i)}
                  style={{ cursor: 'pointer' }}
                />
              </g>
            ))}
            <text x="150" y="100" textAnchor="middle" fill="#fff" fontSize="10">Nucleus</text>
            {selectedPart !== null && selectedPart < 3 && (
              <text x={150 + 80 * Math.cos((rotation + selectedPart * 60) * Math.PI / 180)} y={150 + 30 * Math.sin((rotation + selectedPart * 60) * Math.PI / 180) - 12} textAnchor="middle" fill="#fff" fontSize="9">Electron</text>
            )}
          </motion.g>
        </svg>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Box className="w-6 h-6 text-violet-400" />
          AR Concept Visualizer
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Complex topics appear as interactive 3D models. Click parts to explore!
        </p>
      </div>

      {/* Model Selector */}
      <div className="flex gap-3 flex-wrap">
        {models.map(model => (
          <motion.button
            key={model.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setSelectedModel(model); setSelectedPart(null); setRotation(0); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedModel.id === model.id
                ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {model.title}
          </motion.button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 3D Viewer */}
        <div className="lg:col-span-2 glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">{selectedModel.title}</h3>
            <div className="flex gap-2">
              <button onClick={() => handleRotate('left')} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </button>
              <button onClick={() => handleRotate('right')} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button onClick={() => handleZoom('in')} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <ZoomIn className="w-4 h-4 text-slate-400" />
              </button>
              <button onClick={() => handleZoom('out')} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <ZoomOut className="w-4 h-4 text-slate-400" />
              </button>
              <button onClick={() => { setRotation(0); setZoom(1); }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <RotateCcw className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <motion.div
            className="aspect-video bg-[#0F172A] rounded-xl overflow-hidden relative"
            animate={{ scale: zoom }}
            transition={{ duration: 0.3 }}
          >
            {renderModel()}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-slate-500">
              <Move className="w-3 h-3" />
              Click parts to explore
            </div>
          </motion.div>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h4 className="text-white font-medium mb-2">{selectedModel.title}</h4>
            <p className="text-slate-400 text-sm">{selectedModel.description}</p>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-violet-400" />
              <h4 className="text-sm font-semibold text-white">Parts</h4>
            </div>
            <div className="space-y-2">
              {selectedModel.parts.map((part, i) => (
                <button
                  key={part.name}
                  onClick={() => setSelectedPart(selectedPart === i ? null : i)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                    selectedPart === i ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: part.color }} />
                  <span className="text-sm text-white">{part.name}</span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedPart !== null && selectedModel.parts[selectedPart] && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-5 border-violet-500/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-violet-400" />
                  <h4 className="text-sm font-semibold text-violet-400">{selectedModel.parts[selectedPart].name}</h4>
                </div>
                <p className="text-slate-300 text-sm">{selectedModel.parts[selectedPart].description}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="glass-card p-5 border-yellow-500/20 bg-yellow-500/5">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-yellow-400" />
              <h4 className="text-sm font-semibold text-yellow-400">Fun Fact</h4>
            </div>
            <p className="text-slate-300 text-sm italic">"{selectedModel.funFact}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
