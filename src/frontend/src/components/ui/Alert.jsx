import React from 'react';

const VARIANTS = {
  error: 'border-red-400/40 bg-red-950/30 text-red-300',
  success: 'border-emerald-400/40 bg-emerald-950/30 text-emerald-300',
  info: 'border-highlight/40 bg-highlight/10 text-highlight',
};

// Renders nothing when there is no message, so callers can pass state directly.
function Alert({ variant = 'info', children, className = '' }) {
  if (!children) {
    return null;
  }

  return (
    <p
      role={variant === 'error' ? 'alert' : 'status'}
      className={`rounded-md border px-3 py-2 text-sm ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </p>
  );
}

export default Alert;
