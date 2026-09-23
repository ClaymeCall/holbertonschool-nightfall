import React from 'react';
import useApiResource from '../../hooks/useApiResource';

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

function ReservationsPanel({ token }) {
  const { data: users, loading, error } = useApiResource('/users', {
    token,
    enabled: Boolean(token),
  });
  const reservations = users ? flattenReservations(users) : null;

  return (
    <section aria-labelledby="reservations-heading" className="mb-10">
      <h2 id="reservations-heading" className="mb-3 text-xl font-bold text-white">
        Reservations
      </h2>

      {!token && (
        <p className="text-sm text-gray-500">Provide an admin token above to load reservations.</p>
      )}

      {token && loading && <p className="text-sm text-gray-400">Loading reservations…</p>}

      {token && error && (
        <p role="alert" className="text-sm text-red-400">
          Failed to load reservations: {error.message}
          {error.status === 401 && ' (token missing or expired)'}
          {error.status === 403 && ' (this token is not an admin account)'}
        </p>
      )}

      {reservations && reservations.length === 0 && (
        <p className="text-sm text-gray-400">No reservations yet.</p>
      )}

      {reservations && reservations.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-gray-900/60 text-gray-400">
                <th scope="col" className="px-4 py-2 font-medium">
                  Experience
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Date &amp; time
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Participants
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  User
                </th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="border-t border-gray-800">
                  <td className="px-4 py-2 text-gray-200">{reservation.experience?.name}</td>
                  <td className="px-4 py-2 text-gray-400">{formatDateTime(reservation.date_time)}</td>
                  <td className="px-4 py-2 text-gray-400">{reservation.participants}</td>
                  <td className="px-4 py-2 text-gray-400">{reservation.userEmail}</td>
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
