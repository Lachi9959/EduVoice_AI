import { motion } from 'framer-motion';

interface DiagramProps {
  type: string;
}

export function Diagram({ type }: DiagramProps) {
  if (type === 'photosynthesis') {
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Sun */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx="200" cy="60" r="30" fill="#F59E0B" opacity="0.9" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <motion.line
              key={angle}
              x1={200 + 35 * Math.cos((angle * Math.PI) / 180)}
              y1={60 + 35 * Math.sin((angle * Math.PI) / 180)}
              x2={200 + 50 * Math.cos((angle * Math.PI) / 180)}
              y2={60 + 50 * Math.sin((angle * Math.PI) / 180)}
              stroke="#F59E0B"
              strokeWidth="3"
              opacity="0.7"
            />
          ))}
        </motion.g>

        {/* Rays */}
        {[160, 180, 200, 220, 240].map((x, i) => (
          <motion.line
            key={x}
            x1={x}
            y1="90"
            x2={x + (x - 200) * 0.3}
            y2="140"
            stroke="#F59E0B"
            strokeWidth="2"
            opacity="0.5"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          />
        ))}

        {/* Plant */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          {/* Stem */}
          <path d="M200 280 Q200 200 200 150" stroke="#22C55E" strokeWidth="8" fill="none" />
          {/* Leaves */}
          <motion.ellipse
            cx="170" cy="170" rx="35" ry="20"
            fill="#22C55E" opacity="0.9"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.ellipse
            cx="230" cy="160" rx="35" ry="20"
            fill="#22C55E" opacity="0.9"
            animate={{ rotate: [5, -5, 5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Roots */}
          <path d="M200 280 Q180 300 170 310" stroke="#8B6914" strokeWidth="3" fill="none" />
          <path d="M200 280 Q200 305 200 315" stroke="#8B6914" strokeWidth="3" fill="none" />
          <path d="M200 280 Q220 300 230 310" stroke="#8B6914" strokeWidth="3" fill="none" />
        </motion.g>

        {/* CO2 arrows */}
        <motion.g
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <text x="80" y="180" fill="#94A3B8" fontSize="14">CO₂</text>
          <path d="M110 175 L150 170" stroke="#94A3B8" strokeWidth="2" markerEnd="url(#arrow)" />
        </motion.g>

        {/* Water arrows */}
        <motion.g
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <text x="280" y="250" fill="#3B82F6" fontSize="14">H₂O</text>
          <path d="M260 245 L220 230" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrow)" />
        </motion.g>

        {/* Oxygen output */}
        <motion.g
          animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <text x="280" y="150" fill="#22C55E" fontSize="14">O₂</text>
          <path d="M250 160 L270 145" stroke="#22C55E" strokeWidth="2" markerEnd="url(#arrow)" />
        </motion.g>

        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
            markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>

        {/* Labels */}
        <text x="185" y="40" fill="#F59E0B" fontSize="12" fontWeight="bold">Sunlight</text>
        <text x="150" y="200" fill="#22C55E" fontSize="12" fontWeight="bold">Leaf</text>
      </svg>
    );
  }

  if (type === 'solar-system') {
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Sun */}
        <motion.circle
          cx="200" cy="150" r="25"
          fill="#F59E0B"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <text x="200" y="110" textAnchor="middle" fill="#F59E0B" fontSize="11" fontWeight="bold">Sun</text>

        {/* Orbits */}
        {[60, 85, 110, 140, 175, 210, 245, 280].map((r, i) => (
          <ellipse
            key={i}
            cx="200" cy="150"
            rx={r * (400/560)} ry={r * (300/560)}
            fill="none"
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Planets */}
        {[
          { r: 60, color: '#94A3B8', size: 4, name: 'Mercury', speed: 4 },
          { r: 85, color: '#F59E0B', size: 6, name: 'Venus', speed: 6 },
          { r: 110, color: '#3B82F6', size: 6, name: 'Earth', speed: 8 },
          { r: 140, color: '#EF4444', size: 5, name: 'Mars', speed: 10 },
          { r: 175, color: '#D97706', size: 12, name: 'Jupiter', speed: 14 },
          { r: 210, color: '#FCD34D', size: 10, name: 'Saturn', speed: 18 },
          { r: 245, color: '#22D3EE', size: 8, name: 'Uranus', speed: 22 },
          { r: 280, color: '#4F46E5', size: 8, name: 'Neptune', speed: 26 },
        ].map((planet, i) => (
          <motion.g key={i}>
            <motion.circle
              cx={200 + planet.r * (400/560)}
              cy={150}
              r={planet.size}
              fill={planet.color}
              animate={{
                cx: [
                  200 + planet.r * (400/560) * Math.cos(0),
                  200 + planet.r * (400/560) * Math.cos(Math.PI / 2),
                  200 + planet.r * (400/560) * Math.cos(Math.PI),
                  200 + planet.r * (400/560) * Math.cos(3 * Math.PI / 2),
                  200 + planet.r * (400/560) * Math.cos(2 * Math.PI),
                ],
                cy: [
                  150 + planet.r * (300/560) * Math.sin(0),
                  150 + planet.r * (300/560) * Math.sin(Math.PI / 2),
                  150 + planet.r * (300/560) * Math.sin(Math.PI),
                  150 + planet.r * (300/560) * Math.sin(3 * Math.PI / 2),
                  150 + planet.r * (300/560) * Math.sin(2 * Math.PI),
                ],
              }}
              transition={{ duration: planet.speed, repeat: Infinity, ease: 'linear' }}
            />
          </motion.g>
        ))}
      </svg>
    );
  }

  if (type === 'water-cycle') {
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Sun */}
        <circle cx="320" cy="50" r="20" fill="#F59E0B" opacity="0.8" />
        <text x="320" y="30" textAnchor="middle" fill="#F59E0B" fontSize="10">Sun</text>

        {/* Ocean */}
        <rect x="20" y="220" width="120" height="60" fill="#1E40AF" opacity="0.6" rx="5" />
        <text x="80" y="255" textAnchor="middle" fill="#60A5FA" fontSize="11">Ocean</text>

        {/* Evaporation arrows */}
        <motion.g
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <path d="M60 210 L60 170" stroke="#94A3B8" strokeWidth="2" markerEnd="url(#arrow2)" />
          <path d="M90 210 L90 170" stroke="#94A3B8" strokeWidth="2" markerEnd="url(#arrow2)" />
          <text x="75" y="160" textAnchor="middle" fill="#94A3B8" fontSize="10">Evaporation</text>
        </motion.g>

        {/* Clouds */}
        <motion.g
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <ellipse cx="200" cy="80" rx="40" ry="20" fill="#94A3B8" opacity="0.8" />
          <ellipse cx="230" cy="75" rx="35" ry="18" fill="#94A3B8" opacity="0.8" />
          <ellipse cx="170" cy="78" rx="30" ry="16" fill="#94A3B8" opacity="0.8" />
          <text x="200" y="55" textAnchor="middle" fill="#CBD5E1" fontSize="10">Clouds</text>
        </motion.g>

        {/* Mountains */}
        <path d="M250 220 L300 140 L350 220 Z" fill="#475569" opacity="0.8" />
        <path d="M280 220 L330 160 L380 220 Z" fill="#64748B" opacity="0.7" />

        {/* Rain */}
        <motion.g
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {[180, 200, 220, 240].map((x, i) => (
            <motion.line
              key={i}
              x1={x} y1="100"
              x2={x - 10} y2="130"
              stroke="#3B82F6"
              strokeWidth="2"
              animate={{ y1: [100, 110], y2: [130, 140] }}
              transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }}
            />
          ))}
          <text x="210" y="145" fill="#3B82F6" fontSize="10">Precipitation</text>
        </motion.g>

        {/* River */}
        <path d="M280 220 Q260 240 240 250 Q200 260 150 250 Q100 240 80 220" stroke="#3B82F6" strokeWidth="4" fill="none" opacity="0.6" />
        <text x="200" y="275" textAnchor="middle" fill="#60A5FA" fontSize="10">River (Collection)</text>

        <defs>
          <marker id="arrow2" viewBox="0 0 10 10" refX="5" refY="5"
            markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94A3B8" />
          </marker>
        </defs>
      </svg>
    );
  }

  return (
    <div className="flex items-center justify-center h-full text-slate-400">
      <span className="text-sm">Interactive diagram will appear here</span>
    </div>
  );
}
