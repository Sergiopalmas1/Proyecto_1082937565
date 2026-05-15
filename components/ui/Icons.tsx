'use client';

import React from 'react';

export function CowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className ?? 'w-10 h-10'} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="30" fill="#e9f5ef" />
      <path d="M20 40c0-8 12-12 12-12s12 4 12 12-5 12-12 12-12-4-12-12z" fill="#2f855a" />
      <path d="M22 28s6-6 10-6 10 6 10 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      <CowIcon className="w-9 h-9" />
      <div>
        <div className="text-xl font-bold text-[#124021]">SIG Bovino</div>
        <div className="text-xs text-[#3b5b43]">Gestión de ganado</div>
      </div>
    </div>
  );
}
