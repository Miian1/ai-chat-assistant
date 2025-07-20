
import React from 'react';

export const Spinner: React.FC = () => (
  <div className="w-16 h-16">
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="w-full h-full">
      <circle cx="50" cy="50" r="45" stroke="url(#grad)" strokeWidth="8" fill="none" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1" />
      </circle>
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 0 }} />
        </linearGradient>
      </defs>
    </svg>
  </div>
);
