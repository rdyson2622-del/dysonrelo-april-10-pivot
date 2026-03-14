import React from 'react';
import { motion } from 'framer-motion';

// Charlie Chaplin-inspired animated character
export default function CharlieAvatar({ size = 'md', speaking = false, onClick }) {
  const sizes = {
    sm: { outer: 'w-10 h-10', fontSize: '6px' },
    md: { outer: 'w-16 h-16', fontSize: '10px' },
    lg: { outer: 'w-24 h-24', fontSize: '14px' },
    xl: { outer: 'w-36 h-36', fontSize: '20px' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <motion.div
      className={`relative cursor-pointer ${s.outer} shrink-0`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Speaking glow ring - gold */}
      {speaking && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* SVG Charlie Chaplin character */}
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Body - black suit */}
        <ellipse cx="50" cy="78" rx="18" ry="22" fill="#111111" />

        {/* White shirt front */}
        <ellipse cx="50" cy="75" rx="8" ry="14" fill="#F5F0E8" />

        {/* Bow tie */}
        <polygon points="45,65 50,68 55,65 50,62" fill="#111111" />

        {/* Neck */}
        <rect x="46" y="54" width="8" height="8" rx="2" fill="#F5D5B0" />

        {/* Head */}
        <ellipse cx="50" cy="46" rx="18" ry="20" fill="#F5D5B0" />

        {/* Derby hat - black */}
        <ellipse cx="50" cy="30" rx="20" ry="5" fill="#111111" />
        <rect x="33" y="16" width="34" height="16" rx="10" fill="#111111" />
        {/* Hat highlight */}
        <ellipse cx="46" cy="20" rx="6" ry="3" fill="#2a2a2a" opacity="0.6" />

        {/* Eyes */}
        <motion.ellipse
          cx="43" cy="46"
          rx="4" ry={speaking ? 3 : 4}
          fill="#111111"
          animate={speaking ? { ry: [4, 2, 4] } : {}}
          transition={{ duration: 0.3, repeat: speaking ? Infinity : 0, repeatDelay: 2.5 }}
        />
        <motion.ellipse
          cx="57" cy="46"
          rx="4" ry={speaking ? 3 : 4}
          fill="#111111"
          animate={speaking ? { ry: [4, 2, 4] } : {}}
          transition={{ duration: 0.3, repeat: speaking ? Infinity : 0, repeatDelay: 2.5, delay: 0.1 }}
        />
        {/* Eye whites/shine */}
        <circle cx="44.5" cy="44.5" r="1.5" fill="white" opacity="0.9" />
        <circle cx="58.5" cy="44.5" r="1.5" fill="white" opacity="0.9" />

        {/* Chaplin mustache - signature small square */}
        <rect x="47" y="53" width="6" height="4" rx="1" fill="#111111" />

        {/* Mouth */}
        <motion.path
          d={speaking ? "M 44 60 Q 50 65 56 60" : "M 44 59 Q 50 63 56 59"}
          stroke="#8B4513"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          animate={speaking ? { d: ["M 44 59 Q 50 65 56 59", "M 44 60 Q 50 57 56 60", "M 44 59 Q 50 65 56 59"] } : {}}
          transition={{ duration: 0.4, repeat: speaking ? Infinity : 0 }}
        />

        {/* Ears */}
        <ellipse cx="32" cy="46" rx="4" ry="5" fill="#F5D5B0" />
        <ellipse cx="68" cy="46" rx="4" ry="5" fill="#F5D5B0" />

        {/* Arms */}
        <motion.line
          x1="32" y1="72" x2="18" y2="85"
          stroke="#111111" strokeWidth="7" strokeLinecap="round"
          animate={speaking ? { x2: [18, 15, 18], y2: [85, 82, 85] } : {}}
          transition={{ duration: 0.6, repeat: speaking ? Infinity : 0 }}
        />
        <motion.line
          x1="68" y1="72" x2="82" y2="85"
          stroke="#111111" strokeWidth="7" strokeLinecap="round"
          animate={speaking ? { x2: [82, 85, 82], y2: [85, 82, 85] } : {}}
          transition={{ duration: 0.6, repeat: speaking ? Infinity : 0, delay: 0.3 }}
        />

        {/* Cane (right hand) */}
        <line x1="82" y1="85" x2="90" y2="100" stroke="#8B6914" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="90" cy="100" rx="3" ry="2" fill="#D4AF37" />

        {/* Legs */}
        <line x1="44" y1="98" x2="40" y2="100" stroke="#111111" strokeWidth="6" strokeLinecap="round" />
        <line x1="56" y1="98" x2="60" y2="100" stroke="#111111" strokeWidth="6" strokeLinecap="round" />

        {/* Shoes */}
        <ellipse cx="37" cy="100" rx="7" ry="3" fill="#111111" />
        <ellipse cx="63" cy="100" rx="7" ry="3" fill="#111111" />
      </svg>

      {/* Online status - gold dot */}
      <div className="absolute bottom-0 right-0 w-[22%] aspect-square bg-yellow-400 rounded-full border-2 border-black" style={{ background: '#D4AF37' }} />
    </motion.div>
  );
}