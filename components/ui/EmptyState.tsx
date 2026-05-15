'use client';

import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const DefaultCowIcon = () => (
  <svg className="w-24 h-24 mb-4 text-emerald-300 opacity-90" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm8 5h-1V6c0-1.1-.9-2-2-2h-2V2h-2v2H9c-1.1 0-2 .9-2 2v1H4c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2v2h2v-2h12v2h2v-2c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2zm-7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm7-4c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z" />
  </svg>
);

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const resolvedIcon = icon ?? <DefaultCowIcon />;
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
