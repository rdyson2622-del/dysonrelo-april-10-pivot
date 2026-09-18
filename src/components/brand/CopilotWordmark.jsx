import React from 'react';

const WORDMARK_URL = 'https://media.base44.com/images/public/69d905d72ff7c93b5ef050c4/8a9ac7a01_Screenshot2026-09-18at93242AM.png';

export default function CopilotWordmark({ className = '' }) {
  return <img src={WORDMARK_URL} alt="CoPilot" className={`object-contain ${className}`} />;
}