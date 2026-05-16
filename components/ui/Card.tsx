'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const variantStyle = {
    default: 'bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)]',
    elevated: 'bg-[var(--surface)] rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200',
    outlined: 'bg-[var(--surface)] rounded-xl p-6 border-2 border-emerald-200 dark:border-emerald-300/80',
  }[variant];

  return (
    <div className={`${variantStyle} ${className}`}>
      {children}
    </div>
  );
}
