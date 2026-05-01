'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle =
    'font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeStyle = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size];

  const variantStyle = {
    primary:
      'bg-green-700 text-white hover:bg-green-800 focus:ring-green-500 disabled:bg-gray-400',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400 disabled:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-gray-400',
    ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-400',
  }[variant];

  return (
    <button
      className={`${baseStyle} ${sizeStyle} ${variantStyle} ${
        loading ? 'opacity-60 cursor-wait' : ''
      }`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? '...' : children}
    </button>
  );
}
