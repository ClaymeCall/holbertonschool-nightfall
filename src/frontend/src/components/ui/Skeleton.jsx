import React from 'react';

// Placeholder block shown while data loads. Decorative: give the surrounding
// container a role="status" and a screen-reader-only label instead.
function Skeleton({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-md bg-surface motion-safe:animate-pulse ${className}`}
    />
  );
}

export default Skeleton;
