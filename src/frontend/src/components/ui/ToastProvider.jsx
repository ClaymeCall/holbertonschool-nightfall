import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AlertIcon, CheckIcon, CloseIcon, InfoIcon } from './icons';

const ToastContext = createContext(null);

const MAX_TOASTS = 3;

// Errors stay longer: they usually need to be read and acted on.
const DURATIONS = { success: 5000, info: 6000, error: 8000 };

const VARIANTS = {
  success: { Icon: CheckIcon, badge: 'bg-emerald-400/15 text-emerald-300' },
  error: { Icon: AlertIcon, badge: 'bg-red-400/15 text-red-300' },
  info: { Icon: InfoIcon, badge: 'bg-highlight/15 text-highlight' },
};

function ToastItem({ toast, onDismiss }) {
  const { id, variant, title, message } = toast;
  const [paused, setPaused] = useState(false);
  const { Icon, badge } = VARIANTS[variant] || VARIANTS.info;

  const dismiss = useCallback(() => onDismiss(id), [onDismiss, id]);

  // The timer stops while the toast is hovered or focused, so it never
  // disappears while someone is reading it or reaching for its button.
  useEffect(() => {
    if (paused) {
      return undefined;
    }
    const timer = setTimeout(dismiss, DURATIONS[variant] ?? DURATIONS.info);
    return () => clearTimeout(timer);
  }, [paused, variant, dismiss]);

  return (
    <div
      role={variant === 'error' ? 'alert' : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 shadow-2xl shadow-black/50 motion-safe:animate-fade-up"
    >
      <span aria-hidden="true" className={`flex h-9 w-9 flex-none items-center justify-center rounded-full ${badge}`}>
        <Icon size={20} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ink">{title}</p>
        {message && <p className="mt-0.5 text-sm leading-snug text-ink-muted">{message}</p>}
      </div>

      <button
        type="button"
        aria-label="Fermer la notification"
        onClick={dismiss}
        className="-mr-1.5 -mt-1.5 flex h-10 w-10 flex-none items-center justify-center rounded-lg text-ink-muted transition hover:bg-line hover:text-ink"
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(({ variant = 'info', title, message }) => {
    const id = nextId.current;
    nextId.current += 1;
    setToasts((current) => [...current, { id, variant, title, message }].slice(-MAX_TOASTS));
    return id;
  }, []);

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* The live region exists before any toast, so screen readers announce new ones. */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-3 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-96"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return context;
}

export default ToastProvider;
