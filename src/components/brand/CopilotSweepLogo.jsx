import React from 'react';
const SWEEP_SRC = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/acf69797f_copilot-sweep-logo.png';
const HEIGHT = { xs: 18, sm: 28, md: 40, lg: 64, xl: 96 };
export default function CopilotSweepLogo({ size = 'md', className = '', onClick }) {
  const height = HEIGHT[size] || HEIGHT.md;
  return (
    <img 
      src={SWEEP_SRC} 
      alt="copilot" 
      onClick={onClick} 
      draggable={false} 
      className={`inline-block object-contain align-middle select-none mix-blend-screen ${onClick ? 'cursor-pointer' : ''} ${className}`} 
      style={{ 
        height: `${height}px`, 
        width: 'auto', 
        filter: 'contrast(160%) brightness(1.05)',
        boxShadow: 'none' 
      }} 
    />
  );
}