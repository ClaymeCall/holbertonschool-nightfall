import React, { useEffect, useRef } from 'react';
import { CANCELLATION_WINDOW_HOURS, getCancellationInfo } from '../../lib/cancellation';
import { experienceImageUrl, formatDateTime, formatPrice, formatTimeUntil } from '../../lib/format';
import { themeForExperience } from '../../lib/themes';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { CalendarIcon, ClockIcon } from '../ui/icons';

const STATUS_COLORS = {
  open: 'text-emerald-300',
  closed: 'text-amber-300',
  past: 'text-ink-muted',
};

function ReservationCard({ reservation, now, confirming, busy, onAskCancel, onKeep, onConfirm }) {
  const { id, participants, date_time: dateTime, experience } = reservation;
  const name = experience?.name || 'Expérience';
  const imageUrl = experienceImageUrl(experience?.image);
  const unitPrice = experience?.price != null ? Number(experience.price) : null;
  const cancellation = getCancellationInfo(dateTime, now);

  const triggerRef = useRef(null);
  const confirmRef = useRef(null);
  const wasConfirming = useRef(false);

  // Move keyboard focus into the confirmation, and back to the trigger if the
  // person chooses to keep the reservation.
  useEffect(() => {
    if (confirming) {
      confirmRef.current?.focus();
    } else if (wasConfirming.current) {
      triggerRef.current?.focus();
    }
    wasConfirming.current = confirming;
  }, [confirming]);

  let statusText = 'Expérience terminée';
  if (cancellation.state === 'open') {
    statusText = `Annulable jusqu'au ${formatDateTime(cancellation.deadline)}`;
  } else if (cancellation.state === 'closed') {
    statusText = `Annulation impossible : moins de ${CANCELLATION_WINDOW_HOURS} heures avant l'expérience`;
  }

  const statusId = `reservation-${id}-status`;
  let actions = null;

  if (cancellation.state === 'open' && confirming) {
    actions = (
      <div role="group" aria-label={`Confirmer l'annulation de ${name}`} className="flex flex-col gap-2 sm:items-end">
        <p className="text-sm font-bold text-ink">Annuler cette réservation ?</p>
        <div className="flex gap-2">
          <Button ref={confirmRef} variant="dangerSolid" size="sm" disabled={busy} onClick={onConfirm}>
            {busy ? 'Annulation…' : 'Oui, annuler'}
          </Button>
          <Button variant="ghost" size="sm" disabled={busy} onClick={onKeep}>
            Garder
          </Button>
        </div>
      </div>
    );
  } else if (cancellation.state === 'open') {
    actions = (
      <Button
        ref={triggerRef}
        variant="danger"
        size="sm"
        onClick={onAskCancel}
        aria-label={`Annuler la réservation pour ${name}`}
      >
        Annuler la réservation
      </Button>
    );
  } else if (cancellation.state === 'closed') {
    actions = (
      <Button variant="ghost" size="sm" disabled aria-describedby={statusId}>
        Annuler la réservation
      </Button>
    );
  }

  return (
    <li
      data-theme={themeForExperience(experience)}
      className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 sm:flex-row"
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" loading="lazy" className="h-44 w-full flex-none rounded-xl object-cover sm:h-36 sm:w-36" />
      ) : (
        <div aria-hidden="true" className="h-44 w-full flex-none rounded-xl bg-canvas sm:h-36 sm:w-36" />
      )}

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div>
          {experience?.category && <Badge>{experience.category}</Badge>}
          <h3 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink">{name}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted">
            <CalendarIcon size={16} className="flex-none" />
            <span>{formatDateTime(dateTime)}</span>
            <span aria-hidden="true">·</span>
            <span>
              {participants} participant{participants > 1 ? 's' : ''}
            </span>
          </p>
        </div>

        <p id={statusId} className={`flex items-center gap-2 text-sm font-bold ${STATUS_COLORS[cancellation.state]}`}>
          <ClockIcon size={16} className="flex-none" />
          {statusText}
        </p>
      </div>

      <div className="flex flex-none flex-col justify-between gap-3 sm:w-56 sm:items-end sm:text-right">
        <div>
          {unitPrice != null && (
            <>
              <p className="font-display text-3xl font-bold text-highlight lining-nums">{formatPrice(unitPrice * participants)}</p>
              <p className="text-xs text-ink-muted">
                {participants} × {formatPrice(unitPrice)}
              </p>
            </>
          )}
          {cancellation.state !== 'past' && (
            <p className="mt-1 text-sm text-ink-muted">{formatTimeUntil(cancellation.msUntilStart)}</p>
          )}
        </div>

        {actions}
      </div>
    </li>
  );
}

export default ReservationCard;
