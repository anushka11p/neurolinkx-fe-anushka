'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import FocusTrap from 'focus-trap-react';

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: ModalAction[];
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
};

const actionVariantStyles = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
  secondary:
    'bg-transparent text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)]',
  ghost: 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]',
  danger: 'bg-[var(--color-danger)] text-white hover:opacity-90',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions = [],
  size = 'md',
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <FocusTrap>
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />

        {/* Panel */}
        <div
          className={[
            'relative z-10 w-full bg-[var(--color-bg)] rounded-[var(--radius-lg)]',
            'shadow-[var(--shadow-lg)] border border-[var(--color-border)]',
            'animate-in zoom-in-95 fade-in duration-200',
            sizeStyles[size],
          ].join(' ')}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
            <h2
              id="modal-title"
              className="text-[var(--font-size-lg)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors p-1 rounded-[var(--radius-sm)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-6 text-[var(--color-text-primary)]">{children}</div>

          {/* Footer */}
          {actions.length > 0 && (
            <div className="flex justify-end gap-3 px-6 pb-6">
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className={[
                    'px-4 py-2 rounded-[var(--radius-md)] font-medium text-sm transition-all',
                    'focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
                    actionVariantStyles[action.variant ?? 'primary'],
                  ].join(' ')}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </FocusTrap>,
    document.body
  );
}
