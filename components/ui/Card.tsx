'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const variantStyle = {
    default: 'bg-white rounded-xl p-6 border border-gray-200',
    elevated: 'bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200',
    outlined: 'bg-white rounded-xl p-6 border-2 border-green-200',
  }[variant];

  return (
    <div className={`${variantStyle} ${className}`}>
      {children}
    </div>
  );
}
