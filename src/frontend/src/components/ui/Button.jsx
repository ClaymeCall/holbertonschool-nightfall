import React from 'react';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-md font-bold no-underline transition disabled:cursor-not-allowed disabled:opacity-50';

const VARIANTS = {
  primary: 'bg-accent text-accent-fg hover:brightness-110',
  secondary: 'border border-highlight text-highlight hover:bg-highlight hover:text-canvas',
  ghost: 'border border-line text-ink-muted hover:border-accent hover:text-ink',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
};

// `as` lets the same look be used on a router <Link> or an <a>.
function Button({ as: Component = 'button', variant = 'primary', size = 'md', className = '', ...props }) {
  const defaultProps = Component === 'button' ? { type: 'button' } : {};

  return (
    <Component
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...defaultProps}
      {...props}
    />
  );
}

export default Button;
