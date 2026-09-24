import React from 'react';

function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-block w-fit rounded-full border border-accent/60 bg-canvas/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-highlight ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
