'use client';

import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', children }: BadgeProps) {
  const variantStyle = {
    default: 'bg-gray-100 text-gray-800 border border-gray-300',
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    warning: 'bg-amber-100 text-amber-800 border border-amber-300',
    danger: 'bg-red-100 text-red-800 border border-red-300',
    info: 'bg-blue-100 text-blue-800 border border-blue-300',
  }[variant];

  return (
    <span className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-full ${variantStyle}`}>
      {children}
    </span>
  );
}
