'use client';

import React from 'react';
import { GiCow } from 'react-icons/gi';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const resolvedIcon = icon ?? <GiCow className="text-6xl mb-4 text-emerald-300 opacity-90" />;
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {resolvedIcon && <div className="mb-4">{resolvedIcon}</div>}
      <h3 className="text-lg font-semibold mb-2 text-emerald-100">{title}</h3>
      {description && (
        <p className="text-sm mb-4 text-center text-emerald-200">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
