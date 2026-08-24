import React from 'react';
import { Lock } from 'lucide-react';

const GOLD = '#D4AF37';

// Read-only scrollable viewer for displaying a locked page's source code
// on its own admin reference page — never on the live page itself.
export default function LockedPageSourceViewer({ title, filePath, code }) {
  return (
    <div className="w-full py-10 px-6" style={{ background: '#000' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-4 h-4" style={{ color: GOLD }} />
          <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: GOLD }}>
            {title || 'Locked Page Source'}
          </p>
        </div>
        {filePath && (
          <p className="text-[11px] text-gray-500 mb-3 font-mono">{filePath}</p>
        )}
        <pre
          className="overflow-auto rounded-lg p-4 text-[11px] leading-relaxed font-mono whitespace-pre"
          style={{
            background: 'rgba(212,175,55,0.05)',
            border: `1px solid rgba(212,175,55,0.3)`,
            color: '#ddd',
            maxHeight: '600px',
          }}
        >
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}