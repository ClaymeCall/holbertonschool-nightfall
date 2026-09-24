import React from 'react';

const BASE =
  'nightfall-button inline-flex items-center justify-center gap-3 rounded-sm font-bold no-underline transition disabled:cursor-not-allowed disabled:opacity-50';

const VARIANTS = {
  primary: 'bg-accent text-accent-fg hover:brightness-110',
  secondary: 'border border-highlight text-highlight hover:bg-highlight hover:text-canvas',
  ghost: 'border border-line text-ink-muted hover:border-accent hover:text-ink',
  danger: 'border border-red-400/70 text-red-300 hover:bg-red-400/10',
  dangerSolid: 'bg-red-400 text-red-950 hover:brightness-110',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-4 text-sm',
};

// `as` lets the same look be used on a router <Link> or an <a>. The ref is
// forwarded so callers can move keyboard focus onto the button.
const Button = React.forwardRef(function Button(
  { as: Component = 'button', variant = 'primary', size = 'md', className = '', ...props },
  ref,
) {
  const defaultProps = Component === 'button' ? { type: 'button' } : {};

  return (
    <Component
      ref={ref}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...defaultProps}
      {...props}
    />
  );
});

export default Button;
