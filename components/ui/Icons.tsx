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

export function SyringeIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className ?? 'w-5 h-5'} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 015.646 5.646 9 9 0 1020.354 15.354z" />
    </svg>
  );
}

export function AlertIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className ?? 'w-5 h-5'} 
      fill="currentColor" 
      viewBox="0 0 20 20" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

export function StatsIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className ?? 'w-5 h-5'} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

export function PlusIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className ?? 'w-5 h-5'} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className ?? 'w-5 h-5'} 
      fill="currentColor" 
      viewBox="0 0 20 20" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}
