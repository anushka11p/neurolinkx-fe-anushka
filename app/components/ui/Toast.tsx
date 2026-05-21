'use client';

import { useEffect } from 'react';
import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  variant: ToastVariant;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts.slice(-4), { ...toast, id: Math.random().toString(36).slice(2) }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const toast = {
  success: (message: string, duration?: number) =>
    useToastStore.getState().addToast({ variant: 'success', message, duration }),
  error: (message: string, duration?: number) =>
    useToastStore.getState().addToast({ variant: 'error', message, duration }),
  warning: (message: string, duration?: number) =>
    useToastStore.getState().addToast({ variant: 'warning', message, duration }),
  info: (message: string, duration?: number) =>
    useToastStore.getState().addToast({ variant: 'info', message, duration }),
};

const variantStyles: Record<ToastVariant, { container: string; icon: string }> = {
  success: {
    container: 'border-[var(--color-success)] bg-[#F0FDF4]',
    icon: '✓',
  },
  error: {
    container: 'border-[var(--color-danger)] bg-[#FEF2F2]',
    icon: '✕',
  },
  warning: {
    container: 'border-[var(--color-warning)] bg-[#FFFBEB]',
    icon: '⚠',
  },
  info: {
    container: 'border-[var(--color-secondary)] bg-[#EFF6FF]',
    icon: 'ℹ',
  },
};

const iconColors: Record<ToastVariant, string> = {
  success: 'text-[var(--color-success)]',
  error: 'text-[var(--color-danger)]',
  warning: 'text-[var(--color-warning)]',
  info: 'text-[var(--color-secondary)]',
};

function ToastItem({ toast: t, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const duration = t.duration ?? 4000;

  useEffect(() => {
    const timer = setTimeout(() => onRemove(t.id), duration);
    return () => clearTimeout(timer);
  }, [t.id, duration, onRemove]);

  const { container, icon } = variantStyles[t.variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'relative flex items-start gap-3 w-80 p-4 rounded-[var(--radius-md)]',
        'border shadow-[var(--shadow-md)] overflow-hidden',
        'animate-in slide-in-from-right-full duration-300',
        container,
      ].join(' ')}
    >
      <span className={`text-lg font-bold ${iconColors[t.variant]}`}>{icon}</span>
      <p className="flex-1 text-sm text-[var(--color-text-primary)] font-medium">{t.message}</p>
      <button
        onClick={() => onRemove(t.id)}
        aria-label="Dismiss notification"
        className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        ✕
      </button>
      <div
        className="absolute bottom-0 left-0 h-1 bg-current opacity-30 animate-[shrink_linear]"
        style={{
          animation: `shrink ${duration}ms linear forwards`,
        }}
      />
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-label="Notifications">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
}
