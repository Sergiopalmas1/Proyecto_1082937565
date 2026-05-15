'use client';

import React from 'react';

export function CowIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className ?? 'w-10 h-10 text-emerald-400'} 
      fill="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm8 5h-1V6c0-1.1-.9-2-2-2h-2V2h-2v2H9c-1.1 0-2 .9-2 2v1H4c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2v2h2v-2h12v2h2v-2c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2zm-7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm7-4c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z" />
    </svg>
  );
}

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      <svg 
        className="w-6 h-6 text-emerald-300" 
        fill="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm8 5h-1V6c0-1.1-.9-2-2-2h-2V2h-2v2H9c-1.1 0-2 .9-2 2v1H4c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2v2h2v-2h12v2h2v-2c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2zm-7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm7-4c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z" />
      </svg>
      <span className="font-semibold text-lg text-emerald-100">SIG Bovino</span>
    </div>
  );
}
