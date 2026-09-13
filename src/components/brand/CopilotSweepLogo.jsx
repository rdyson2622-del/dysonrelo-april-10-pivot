import React from 'react';

/**
 * CopilotSweepLogo
 * Renders the gold cursive "copilot" SWEEP logo with elegant cursive typography
 * and an organic calligraphy flourish / sweep tail.
 */
export default function CopilotSweepLogo({ size = 'md', className = '' }) {
  const sizes = {
    sm: { height: 26, fontSize: 24, strokeWidth: 2 },
    md: { height: 38, fontSize: 36, strokeWidth: 2.5 },
    lg: { height: 56, fontSize: 52, strokeWidth: 3.5 },
    xl: { height: 76, fontSize: 70, strokeWidth: 4.5 },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className={`inline-flex flex-col items-center justify-center relative select-none ${className}`}>
      <svg
        viewBox="0 0 240 70"
        height={s.height}
        style={{ width: 'auto', overflow: 'visible' }}
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_2px_10px_rgba(212,175,55,0.45)]"
      >
        <defs>
          <linearGradient id="copilotGoldSweep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="25%" stopColor="#E5C158" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="80%" stopColor="#B38714" />
            <stop offset="100%" stopColor="#F5DB7A" />
          </linearGradient>

          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Cursive "copilot" lettering */}
        <text
          x="12"
          y="46"
          fill="url(#copilotGoldSweep)"
          style={{
            fontFamily: "'Cormorant Garamond', 'Bickham Script Pro', 'Brush Script MT', 'Great Vibes', cursive, serif",
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: '52px',
            letterSpacing: '1px'
          }}
        >
          copilot
        </text>

        {/* Dynamic elegant sweep tail / flourish underline */}
        <path
          d="M 12 56 Q 70 65 140 60 Q 200 55 228 42 Q 234 38 238 34"
          fill="none"
          stroke="url(#copilotGoldSweep)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Subtle accent dot on sweep */}
        <circle cx="238" cy="34" r="2" fill="url(#copilotGoldSweep)" />
      </svg>
    </div>
  );
}