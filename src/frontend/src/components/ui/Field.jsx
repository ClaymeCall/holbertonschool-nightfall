import React, { useId } from 'react';

export const LABEL_CLASS = 'text-xs font-semibold uppercase tracking-[0.15em] text-ink-muted';

export const INPUT_CLASS =
  'w-full rounded-lg border border-line bg-canvas px-3.5 py-3 text-base text-ink placeholder:text-ink-muted/50 focus:border-highlight focus:outline-none focus:ring-2 focus:ring-highlight/40';

// A labelled control (input by default; pass as="select" or as="textarea").
// `hint` is linked to the control with aria-describedby so screen readers read
// it after the label.
function Field({
  label,
  hint,
  id,
  as: Control = 'input',
  wrapperClassName = '',
  className = '',
  children,
  ...controlProps
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hintId = `${inputId}-hint`;

  return (
    <div className={`flex flex-col gap-2 ${wrapperClassName}`}>
      <label htmlFor={inputId} className={LABEL_CLASS}>
        {label}
      </label>
      <Control
        id={inputId}
        aria-describedby={hint ? hintId : undefined}
        className={`${INPUT_CLASS} ${className}`}
        {...controlProps}
      >
        {children}
      </Control>
      {hint && (
        <p id={hintId} className="text-sm text-ink-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export default Field;
