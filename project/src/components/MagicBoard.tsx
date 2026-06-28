import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Eraser, Wand2, Download, RotateCcw, Shapes, Zap, Check } from 'lucide-react';

interface Point { x: number; y: number }

export function MagicBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#4F46E5');
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [showConverted, setShowConverted] = useState(false);
  const [convertedType, setConvertedType] = useState<'diagram' | 'flowchart' | 'mindmap'>('diagram');
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const currentStroke = useRef<Point[]>([]);

  const colors = ['#4F46E5', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#FFFFFF'];

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getCanvasPos(e);
    currentStroke.current = [pos];
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getCanvasPos(e);
    currentStroke.current.push(pos);

    ctx.beginPath();
    ctx.strokeStyle = tool === 'eraser' ? '#0F172A' : brushColor;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const points = currentStroke.current;
    if (points.length >= 2) {
      const prev = points[points.length - 2];
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  }, [isDrawing, brushColor, brushSize, tool]);

  const stopDrawing = useCallback(() => {
    if (isDrawing && currentStroke.current.length > 0) {
      setStrokes(prev => [...prev, currentStroke.current]);
    }
    setIsDrawing(false);
    currentStroke.current = [];
  }, [isDrawing]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
    setShowConverted(false);
  };

  const handleConvert = (type: 'diagram' | 'flowchart' | 'mindmap') => {
    setConvertedType(type);
    setShowConverted(true);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'magic-board.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Initialize canvas
  const initCanvas = useCallback((canvas: HTMLCanvasElement) => {
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-purple-400" />
          AI Magic Board
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Draw rough sketches and watch AI convert them into professional diagrams
        </p>
      </div>

      {/* Toolbar */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Tools */}
          <div className="flex gap-2">
            <button
              onClick={() => setTool('pen')}
              className={`p-2.5 rounded-xl transition-all ${tool === 'pen' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-400 hover:text-white'}`}
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2.5 rounded-xl transition-all ${tool === 'eraser' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-slate-400 hover:text-white'}`}
            >
              <Eraser className="w-5 h-5" />
            </button>
          </div>

          <div className="w-px h-8 bg-white/10" />

          {/* Colors */}
          <div className="flex gap-1.5">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => { setBrushColor(c); setTool('pen'); }}
                className={`w-7 h-7 rounded-full border-2 transition-all ${brushColor === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="w-px h-8 bg-white/10" />

          {/* Brush Size */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Size</span>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-24 accent-primary"
            />
          </div>

          <div className="w-px h-8 bg-white/10" />

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={clearCanvas} className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button onClick={handleDownload} className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Convert Options */}
      <div className="flex gap-3 flex-wrap">
        {[
          { id: 'diagram' as const, label: 'Professional Diagram', icon: Shapes },
          { id: 'flowchart' as const, label: 'Flowchart', icon: Zap },
          { id: 'mindmap' as const, label: 'Mind Map', icon: Wand2 },
        ].map(opt => {
          const Icon = opt.icon;
          return (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleConvert(opt.id)}
              className="px-5 py-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl font-medium flex items-center gap-2 hover:bg-purple-500/30 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {opt.label}
            </motion.button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Drawing Canvas */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Your Sketch</h3>
            <span className="text-xs text-slate-400">Draw here</span>
          </div>
          <div className="relative aspect-video bg-[#0F172A] rounded-xl overflow-hidden border border-white/10">
            <canvas
              ref={(canvas) => { canvasRef.current = canvas; initCanvas(canvas!); }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">Draw your concept, then click Convert above</p>
        </div>

        {/* Converted Result */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">AI Converted</h3>
            {showConverted && (
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" />
                Converted
              </span>
            )}
          </div>
          <div className="aspect-video bg-[#0F172A] rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {showConverted ? (
                <motion.div
                  key={convertedType}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full h-full p-4"
                >
                  {convertedType === 'diagram' && (
                    <svg viewBox="0 0 400 250" className="w-full h-full">
                      <rect x="150" y="20" width="100" height="50" rx="8" fill="#4F46E5" opacity="0.8" />
                      <text x="200" y="50" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">Input</text>
                      <line x1="200" y1="70" x2="200" y2="100" stroke="#4F46E5" strokeWidth="2" />
                      <rect x="120" y="100" width="160" height="50" rx="8" fill="#22C55E" opacity="0.8" />
                      <text x="200" y="130" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">Process</text>
                      <line x1="200" y1="150" x2="200" y2="180" stroke="#22C55E" strokeWidth="2" />
                      <rect x="150" y="180" width="100" height="50" rx="8" fill="#F59E0B" opacity="0.8" />
                      <text x="200" y="210" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">Output</text>
                    </svg>
                  )}
                  {convertedType === 'flowchart' && (
                    <svg viewBox="0 0 400 250" className="w-full h-full">
                      <ellipse cx="200" cy="40" rx="60" ry="25" fill="#4F46E5" opacity="0.8" />
                      <text x="200" y="45" textAnchor="middle" fill="#fff" fontSize="11">Start</text>
                      <line x1="200" y1="65" x2="200" y2="90" stroke="#fff" strokeWidth="2" markerEnd="url(#arr)" />
                      <rect x="140" y="90" width="120" height="40" rx="4" fill="#22C55E" opacity="0.8" />
                      <text x="200" y="115" textAnchor="middle" fill="#fff" fontSize="11">Decision?</text>
                      <line x1="200" y1="130" x2="200" y2="155" stroke="#fff" strokeWidth="2" markerEnd="url(#arr)" />
                      <rect x="140" y="155" width="120" height="40" rx="4" fill="#F59E0B" opacity="0.8" />
                      <text x="200" y="180" textAnchor="middle" fill="#fff" fontSize="11">Action</text>
                      <line x1="200" y1="195" x2="200" y2="220" stroke="#fff" strokeWidth="2" markerEnd="url(#arr)" />
                      <ellipse cx="200" cy="235" rx="50" ry="20" fill="#EF4444" opacity="0.8" />
                      <text x="200" y="240" textAnchor="middle" fill="#fff" fontSize="11">End</text>
                      <defs><marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#fff"/></marker></defs>
                    </svg>
                  )}
                  {convertedType === 'mindmap' && (
                    <svg viewBox="0 0 400 250" className="w-full h-full">
                      <circle cx="200" cy="125" r="40" fill="#4F46E5" opacity="0.8" />
                      <text x="200" y="130" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">Core</text>
                      {[30, 90, 150, 210, 270, 330].map((angle, i) => {
                        const rad = (angle * Math.PI) / 180;
                        const x2 = 200 + 130 * Math.cos(rad);
                        const y2 = 125 + 80 * Math.sin(rad);
                        return (
                          <g key={i}>
                            <line x1="200" y1="125" x2={x2} y2={y2} stroke={`hsl(${i * 60}, 70%, 60%)`} strokeWidth="2" />
                            <circle cx={x2} cy={y2} r="25" fill={`hsl(${i * 60}, 70%, 50%)`} opacity="0.8" />
                            <text x={x2} y={y2 + 4} textAnchor="middle" fill="#fff" fontSize="9">Node {i + 1}</text>
                          </g>
                        );
                      })}
                    </svg>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-slate-500"
                >
                  <Wand2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Draw something and click Convert</p>
                  <p className="text-xs mt-1">AI will transform your sketch into a professional diagram</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
