'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
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
    'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyle = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size];

  const variantStyle = {
    primary:
      'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg focus:ring-green-500',
    secondary:
      'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400 border border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:border-slate-600 dark:focus:ring-slate-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg focus:ring-red-500',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg focus:ring-emerald-500',
    ghost: 'bg-transparent text-green-700 hover:bg-green-50 focus:ring-green-400 dark:text-green-300 dark:hover:bg-slate-800',
  }[variant];

  return (
    <button
      className={`${baseStyle} ${sizeStyle} ${variantStyle} ${
        loading ? 'opacity-60 cursor-wait' : ''
      }`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M22 12a10 10 0 0 0-10-10" /></svg>
          Cargando...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {/** render icon when provided */}
          {(props as any).icon ? <span className="flex items-center">{(props as any).icon}</span> : null}
          {children}
        </span>
      )}
    </button>
  );
}
