import React from 'react';
import { motion } from 'framer-motion';

// D&D (Concierge Relocation Services) Logo Component
export default function DnDLogo({ size = 'md', speaking = false, onClick }) {
  const sizes = {
    sm: { outer: 'w-10 h-10', text: '9px', sub: '4.5px' },
    md: { outer: 'w-16 h-16', text: '14px', sub: '7px' },
    lg: { outer: 'w-24 h-24', text: '20px', sub: '10px' },
    xl: { outer: 'w-36 h-36', text: '30px', sub: '14px' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <motion.div
      className={`relative cursor-pointer shrink-0 ${s.outer}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Speaking glow */}
      {speaking && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.05, 0.5] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Outer ring */}
        <circle cx="50" cy="50" r="48" fill="#0a0a0a" stroke="#D4AF37" strokeWidth="2" />

        {/* Inner decorative ring */}
        <circle cx="50" cy="50" r="42" fill="none" stroke="#D4AF3744" strokeWidth="0.8" strokeDasharray="3 2" />

        {/* Background subtle gradient */}
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1500" stopOpacity="1" />
          <stop offset="100%" stopColor="#0a0a0a" stopOpacity="1" />
        </radialGradient>
        <circle cx="50" cy="50" r="47" fill="url(#bgGrad)" />
        <circle cx="50" cy="50" r="48" fill="none" stroke="#D4AF37" strokeWidth="2" />

        {/* D&D Text */}
        <text
          x="50"
          y="54"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Georgia, serif"
          fontWeight="bold"
          fontSize="32"
          fill="#D4AF37"
          letterSpacing="-1"
        >
          D&amp;D
        </text>

        {/* Top arc text */}
        <path id="topArc" d="M 18 50 A 32 32 0 0 1 82 50" fill="none" />
        <text fontSize="6.5" fill="#D4AF37" fontFamily="Arial, sans-serif" letterSpacing="2" opacity="0.85">
          <textPath href="#topArc" startOffset="50%" textAnchor="middle">
            CONCIERGE RELOCATION
          </textPath>
        </text>

        {/* Bottom arc text */}
        <path id="bottomArc" d="M 18 52 A 32 32 0 0 0 82 52" fill="none" />
        <text fontSize="6" fill="#D4AF37" fontFamily="Arial, sans-serif" letterSpacing="2.5" opacity="0.85">
          <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
            SERVICES
          </textPath>
        </text>

        {/* Corner ornaments */}
        <circle cx="50" cy="10" r="2" fill="#D4AF37" opacity="0.7" />
        <circle cx="50" cy="90" r="2" fill="#D4AF37" opacity="0.7" />
        <circle cx="10" cy="50" r="2" fill="#D4AF37" opacity="0.7" />
        <circle cx="90" cy="50" r="2" fill="#D4AF37" opacity="0.7" />
      </svg>

      {/* Online indicator */}
      <div
        className="absolute bottom-0 right-0 w-[22%] aspect-square rounded-full border-2"
        style={{ background: '#D4AF37', borderColor: '#080808' }}
      />
    </motion.div>
  );
}