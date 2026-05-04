'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, actions }: ModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        style={{ backgroundColor: '#FAF7F2' }}
      >
        <div className="p-6 border-b" style={{ borderColor: '#D4C7B0' }}>
          <h2 className="text-lg font-bold" style={{ color: '#1F3A0D' }}>
            {title}
          </h2>
        </div>

        <div className="p-6">{children}</div>

        {actions && <div className="p-6 border-t flex gap-3 justify-end" style={{ borderColor: '#D4C7B0' }}>{actions}</div>}
      </motion.div>
    </motion.div>
  );
}
