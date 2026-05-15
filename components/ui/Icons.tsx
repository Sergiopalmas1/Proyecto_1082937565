'use client';

import React from 'react';
import { GiCow } from 'react-icons/gi';

export function CowIcon({ className }: { className?: string }) {
  return <GiCow className={className ?? 'text-4xl text-emerald-400'} aria-hidden="true" />;
}

export function AppLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      <GiCow className="text-2xl text-emerald-300" />
      <span className="font-semibold text-lg text-emerald-100">SIG Bovino</span>
    </div>
  );
}
