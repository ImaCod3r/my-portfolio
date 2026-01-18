
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  type?: 'default' | 'danger';
}

export default function Modal({ isOpen, onClose, title, children, footer, type = 'default' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`bg-gray-900 border ${type === 'danger' ? 'border-red-500/50' : 'border-white/20'} 
        rounded-xl w-full max-w-lg shadow-2xl transform transition-all scale-100 p-6`}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className={`text-xl font-bold ${type === 'danger' ? 'text-red-400' : 'text-white'}`}>
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="text-gray-300 mb-6">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end gap-3 pt-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
