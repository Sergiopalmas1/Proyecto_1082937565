'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-lg p-6 shadow-md ${className}`}
      style={{ backgroundColor: '#FAF7F2', borderColor: '#D4C7B0' }}
    >
      {children}
    </div>
  );
}
