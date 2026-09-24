import React, { useEffect, useRef } from 'react';

const FIELD_LABEL = 'text-xs font-semibold uppercase tracking-[0.15em] text-ink-muted';

function RangeSlider({
  minValue,
  onMinChange,
  maxValue,
  onMaxChange,
  limits,
  unit,
  minLabel,
  maxLabel
}) {
  const trackRef = useRef(null);
  const activeThumbRef = useRef(null);
  const currentMin = Number(minValue || limits.min);
  const currentMax = Number(maxValue || limits.max);
  const valueRange = limits.max - limits.min;
  const minPercent = valueRange > 0
    ? ((currentMin - limits.min) / valueRange) * 100
    : 0;
  const maxPercent = valueRange > 0
    ? ((currentMax - limits.min) / valueRange) * 100
    : 100;

  function updateValue(clientX) {
    if (!trackRef.current || !activeThumbRef.current) {
      return;
    }

    const bounds = trackRef.current.getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (clientX - bounds.left) / bounds.width)
    );
    const value = Math.round(
      limits.min + ratio * (limits.max - limits.min)
    );

    if (activeThumbRef.current === 'min') {
      onMinChange(String(Math.min(value, currentMax)));
    } else {
      onMaxChange(String(Math.max(value, currentMin)));
    }
  }

  useEffect(() => {
    function handlePointerMove(event) {
      updateValue(event.clientX);
    }

    function handlePointerUp() {
      activeThumbRef.current = null;
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  });

  function handlePointerDown(thumb, event) {
    event.preventDefault();
    activeThumbRef.current = thumb;
  }

  function handleKeyDown(thumb, event) {
    const currentValue = thumb === 'min' ? currentMin : currentMax;
    const step = event.shiftKey ? 10 : 1;
    let nextValue = currentValue;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      nextValue -= step;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      nextValue += step;
    }

    if (event.key === 'Home') {
      nextValue = limits.min;
    }

    if (event.key === 'End') {
      nextValue = limits.max;
    }

    nextValue = Math.max(limits.min, Math.min(nextValue, limits.max));

    if (nextValue === currentValue) {
      return;
    }

    event.preventDefault();

    if (thumb === 'min') {
      onMinChange(String(Math.min(nextValue, currentMax)));
    } else {
      onMaxChange(String(Math.max(nextValue, currentMin)));
    }
  }

  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between">
        <span className={FIELD_LABEL}>Intervalle sélectionné</span>
        <span className="font-display text-lg font-semibold text-ink lining-nums">
          {currentMin} - {currentMax} {unit}
        </span>
      </div>

      <div ref={trackRef} className="relative mt-3 h-8">
        <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-line" />
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-highlight"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`
          }}
        />

        <button
          type="button"
          aria-label={minLabel}
          aria-valuemin={limits.min}
          aria-valuemax={limits.max}
          aria-valuenow={currentMin}
          role="slider"
          tabIndex="0"
          onPointerDown={(event) => handlePointerDown('min', event)}
          onKeyDown={(event) => handleKeyDown('min', event)}
          className="absolute top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-canvas bg-highlight shadow-[0_0_0_1px_rgb(var(--color-highlight)/0.5)] transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-highlight"
          style={{ left: `${minPercent}%` }}
        />
        <button
          type="button"
          aria-label={maxLabel}
          aria-valuemin={limits.min}
          aria-valuemax={limits.max}
          aria-valuenow={currentMax}
          role="slider"
          tabIndex="0"
          onPointerDown={(event) => handlePointerDown('max', event)}
          onKeyDown={(event) => handleKeyDown('max', event)}
          className="absolute top-1/2 z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-canvas bg-highlight shadow-[0_0_0_1px_rgb(var(--color-highlight)/0.5)] transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-highlight"
          style={{ left: `${maxPercent}%` }}
        />
      </div>
    </div>
  );
}

export default RangeSlider;