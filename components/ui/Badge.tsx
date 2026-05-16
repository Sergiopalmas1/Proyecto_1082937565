'use client';

import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', children }: BadgeProps) {
  const variantStyle = {
    default: 'bg-slate-100 text-slate-900 border border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600',
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-400/50',
    warning: 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-400/50',
    danger: 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/30 dark:text-red-200 dark:border-red-400/50',
    info: 'bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-400/50',
  }[variant];

  return (
    <span className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-full ${variantStyle}`}>
      {children}
    </span>
  );
}
