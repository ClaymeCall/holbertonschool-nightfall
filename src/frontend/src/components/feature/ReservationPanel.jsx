import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { apiRequest } from '../../lib/api';
import { CANCELLATION_WINDOW_HOURS } from '../../lib/cancellation';
import { formatDateTime, formatPrice } from '../../lib/format';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import { useToast } from '../ui/ToastProvider';

const FIELD_LABEL = 'text-xs font-semibold uppercase tracking-[0.15em] text-ink-muted';

const INPUT =
  'w-full rounded-lg border border-line bg-canvas px-3.5 py-3 text-base text-ink focus:border-highlight focus:outline-none focus:ring-2 focus:ring-highlight/40';

const STEP_BUTTON =
  'flex h-11 w-11 items-center justify-center rounded-lg bg-surface text-xl font-bold text-ink transition hover:bg-line disabled:cursor-not-allowed disabled:opacity-40';

// <input type="datetime-local"> expects the local time, not UTC.
function toLocalInputValue(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function ReservationPanel({ experience }) {
  const { token } = useAuth();
  const { notify } = useToast();
  const fieldId = useId();

  const [dateTime, setDateTime] = useState('');
  const [participants, setParticipants] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const unitPrice = Number(experience.price);
  const maxParticipants = Number(experience.max_participants) > 0 ? Number(experience.max_participants) : 99;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!dateTime) {
      setError('Choisis une date et une heure.');
      return;
    }

    const bookingDate = new Date(dateTime);
    if (bookingDate <= new Date()) {
      setError('La date doit être dans le futur.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await apiRequest('/reservations', {
        method: 'POST',
        token,
        body: JSON.stringify({
          experience_id: experience.id,
          date: bookingDate.toISOString(),
          participants: Number(participants),
        }),
      });
      notify({
        variant: 'success',
        title: 'Réservation confirmée',
        message: `${experience.name}, ${formatDateTime(bookingDate)}, ${participants} participant${participants > 1 ? 's' : ''}.`,
      });
      setDateTime('');
      setParticipants(1);
    } catch (err) {
      const expired = err.status === 401;
      notify({
        variant: 'error',
        title: expired ? 'Session expirée' : 'Réservation impossible',
        message: expired ? 'Reconnecte-toi pour réserver cette expérience.' : err.message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="reservation-ticket border border-line bg-surface p-6 shadow-2xl shadow-black/40">
      <p className="eyebrow mb-3">Votre billet pour l’inconnu</p>
      <h2 className="mb-6 font-display text-3xl text-ink">Osez entrer.</h2>
      <p className="flex items-baseline gap-2">
        <span className="font-display text-5xl font-bold leading-none text-highlight lining-nums">{formatPrice(unitPrice)}</span>
        <span className="text-sm text-ink-muted">par personne</span>
      </p>

      {!token ? (
        <div className="mt-6">
          <p className="text-sm text-ink-muted">Connecte-toi pour réserver cette expérience.</p>
          <Button as={Link} to="/login" size="lg" className="mt-4 w-full">
            Se connecter
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor={`${fieldId}-date`} className={FIELD_LABEL}>
              Date et heure
            </label>
            <input
              id={`${fieldId}-date`}
              type="datetime-local"
              value={dateTime}
              min={toLocalInputValue(new Date())}
              onChange={(event) => setDateTime(event.target.value)}
              className={INPUT}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span id={`${fieldId}-participants`} className={FIELD_LABEL}>
              Participants
            </span>
            <div className="flex items-center justify-between rounded-lg border border-line bg-canvas p-1.5">
              <button
                type="button"
                aria-label="Retirer un participant"
                disabled={participants <= 1}
                onClick={() => setParticipants((count) => count - 1)}
                className={STEP_BUTTON}
              >
                −
              </button>
              <output aria-labelledby={`${fieldId}-participants`} className="text-xl font-bold text-ink">
                {participants}
              </output>
              <button
                type="button"
                aria-label="Ajouter un participant"
                disabled={participants >= maxParticipants}
                onClick={() => setParticipants((count) => count + 1)}
                className={STEP_BUTTON}
              >
                +
              </button>
            </div>
            {experience.max_participants ? (
              <p className="text-xs text-ink-muted">{maxParticipants} maximum</p>
            ) : null}
          </div>

          <div className="flex items-baseline justify-between border-t border-dashed border-line pt-5">
            <span className="text-sm text-ink-muted">
              {participants} × {formatPrice(unitPrice)}
            </span>
            <span className="text-2xl font-bold text-ink">{formatPrice(unitPrice * participants)}</span>
          </div>

          <Button type="submit" size="lg" disabled={submitting} className="w-full">
            {submitting ? 'Réservation…' : 'Réserver'}
          </Button>

          <Alert variant="error">{error}</Alert>
        </form>
      )}

      <p className="mt-5 text-center text-xs leading-relaxed text-ink-muted">
        Annulation possible plus de {CANCELLATION_WINDOW_HOURS} heures avant l'expérience.
      </p>
    </div>
  );
}

export default ReservationPanel;
