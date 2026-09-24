import React from 'react';
import useApiResource from '../../hooks/useApiResource';
import Alert from '../ui/Alert';
import Skeleton from '../ui/Skeleton';

const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateTimeFormatter.format(date);
}

function flattenReservations(users) {
  return users
    .flatMap((user) => user.reservations.map((reservation) => ({ ...reservation, userEmail: user.email })))
    .sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
}

const HEAD_CELL = 'px-4 py-3 text-xs font-normal uppercase tracking-[0.15em]';

function ReservationsPanel({ token }) {
  const { data: users, loading, error } = useApiResource('/users', {
    token,
    enabled: Boolean(token),
  });
  const reservations = users ? flattenReservations(users) : null;

  return (
    <section aria-labelledby="reservations-heading" className="mb-12">
      <h2 id="reservations-heading" className="mb-4 font-display text-3xl text-ink">
        Réservations
      </h2>

      {!token && (
        <p className="text-sm text-ink-muted">Connectez-vous en administrateur pour voir les réservations.</p>
      )}

      {token && loading && (
        <div role="status" className="space-y-2">
          <span className="sr-only">Chargement des réservations…</span>
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      )}

      {token && error && (
        <Alert variant="error">
          Impossible de charger les réservations : {error.message}
          {error.status === 401 && ' (jeton manquant ou expiré)'}
          {error.status === 403 && " (ce compte n'est pas administrateur)"}
        </Alert>
      )}

      {reservations && reservations.length === 0 && (
        <p className="text-sm text-ink-muted">Aucune réservation pour le moment.</p>
      )}

      {reservations && reservations.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-canvas/50 text-ink-muted">
                <th scope="col" className={HEAD_CELL}>
                  Expérience
                </th>
                <th scope="col" className={HEAD_CELL}>
                  Date et heure
                </th>
                <th scope="col" className={HEAD_CELL}>
                  Participants
                </th>
                <th scope="col" className={HEAD_CELL}>
                  Utilisateur
                </th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="border-t border-line">
                  <td className="px-4 py-3 text-ink">{reservation.experience?.name}</td>
                  <td className="px-4 py-3 text-ink-muted">{formatDateTime(reservation.date_time)}</td>
                  <td className="px-4 py-3 text-ink-muted">{reservation.participants}</td>
                  <td className="px-4 py-3 text-ink-muted">{reservation.userEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default ReservationsPanel;
