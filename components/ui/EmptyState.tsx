'use client';

import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && <div className="text-5xl mb-4 opacity-50">{icon}</div>}
      <h3 className="text-lg font-semibold mb-2" style={{ color: '#2D5016' }}>
        {title}
      </h3>
      {description && (
        <p className="text-sm mb-4 text-center" style={{ color: '#6B5635' }}>
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
