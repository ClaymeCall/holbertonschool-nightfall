import React from 'react';
import useApiResource from '../../hooks/useApiResource';
import { formatDateTimeShort } from '../../lib/format';
import PanelStatus from './PanelStatus';

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

      <PanelStatus
        token={token}
        loading={loading}
        error={error}
        isEmpty={reservations?.length === 0}
        name="réservations"
        emptyText="Aucune réservation pour le moment."
        skeletonCount={2}
        skeletonClass="h-12"
        skeletonGap="space-y-2"
      />

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
                  <td className="px-4 py-3 text-ink-muted">{formatDateTimeShort(reservation.date_time)}</td>
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
