'use client';

import React from 'react';

interface TableProps {
  children: React.ReactNode;
}

interface TableHeadProps {
  children: React.ReactNode;
}

interface TableBodyProps {
  children: React.ReactNode;
}

interface TableRowProps {
  children: React.ReactNode;
}

interface TableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

function Table({ children }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border" style={{ borderColor: '#D4C7B0' }}>
      <table className="w-full" style={{ backgroundColor: '#FAF7F2' }}>
        {children}
      </table>
    </div>
  );
}

function Thead({ children }: TableHeadProps) {
  return (
    <thead style={{ backgroundColor: '#F5EFE0' }}>
      {children}
    </thead>
  );
}

function Tbody({ children }: TableBodyProps) {
  return <tbody>{children}</tbody>;
}

function Tr({ children }: TableRowProps) {
  return (
    <tr className="border-b" style={{ borderColor: '#E8DFC9' }}>
      {children}
    </tr>
  );
}

function Th({ children, className = '' }: TableHeaderCellProps) {
  return (
    <th
      className={`px-6 py-3 text-left text-sm font-semibold ${className}`}
      style={{ color: '#2D5016' }}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: TableCellProps) {
  return (
    <td className={`px-6 py-4 text-sm ${className}`} style={{ color: '#2C2416' }}>
      {children}
    </td>
  );
}

export { Table, Thead, Tbody, Tr, Th, Td };
