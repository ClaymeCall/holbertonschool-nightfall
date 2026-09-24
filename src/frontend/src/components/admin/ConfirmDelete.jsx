import React, { useEffect, useId, useRef } from 'react';
import Button from '../ui/Button';

// Puts focus back on a button that was unmounted while the confirmation was
// open. Waits one frame so the row has re-rendered with its normal buttons.
export function focusLater(elementId) {
  requestAnimationFrame(() => document.getElementById(elementId)?.focus());
}

// Replaces window.confirm: shown in place of a row's normal content. Focus
// starts on "Annuler" so a stray Enter never deletes anything.
function ConfirmDelete({ title, detail, busy = false, onCancel, onConfirm }) {
  const cancelRef = useRef(null);
  const titleId = useId();
  const detailId = useId();

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  function handleKeyDown(event) {
    if (event.key === 'Escape' && !busy) {
      onCancel();
    }
  }

  return (
    <div
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={detailId}
      onKeyDown={handleKeyDown}
      className="flex flex-wrap items-center justify-between gap-4"
    >
      <div>
        <p id={titleId} className="text-lg text-red-200">
          {title}
        </p>
        <p id={detailId} className="mt-1 text-sm text-ink-muted">
          {detail}
        </p>
      </div>

      <div className="flex gap-2">
        <Button ref={cancelRef} variant="ghost" className="min-h-10" onClick={onCancel} disabled={busy}>
          Annuler
        </Button>
        <Button variant="dangerSolid" className="min-h-10" onClick={onConfirm} disabled={busy}>
          {busy ? 'Suppression…' : 'Oui, supprimer'}
        </Button>
      </div>
    </div>
  );
}

export default ConfirmDelete;
