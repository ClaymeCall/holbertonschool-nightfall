import React, { useState } from 'react';
import useApiResource from '../../hooks/useApiResource';
import { apiRequest } from '../../lib/api';
import NewReservationForm from './NewReservationForm';

const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateTimeFormatter.format(date);
}

function ReservationsList({ reservations }) {
  if (reservations.length === 0) {
    return <p className="pl-4 text-sm text-gray-500">No reservations.</p>;
  }

  return (
    <ul className="ml-4 space-y-1.5 border-l border-gray-800 pl-4">
      {reservations.map((reservation) => (
        <li key={reservation.id} className="text-sm text-gray-300">
          <span className="font-medium text-gray-200">{reservation.experience?.name}</span>
          {' — '}
          {formatDateTime(reservation.date_time)}
          {' · '}
          {reservation.participants} participant{reservation.participants > 1 ? 's' : ''}
        </li>
      ))}
    </ul>
  );
}

function UsersPanel({ token }) {
  const { data: users, loading, error, refetch } = useApiResource('/users', {
    token,
    enabled: Boolean(token),
  });
  const [busyUserId, setBusyUserId] = useState(null);
  const [rowErrors, setRowErrors] = useState({});
  const [openReservationFormFor, setOpenReservationFormFor] = useState(null);

  async function handleDelete(user) {
    if (!window.confirm(`Delete ${user.email}? This cannot be undone.`)) {
      return;
    }

    setBusyUserId(user.id);
    setRowErrors((prev) => ({ ...prev, [user.id]: null }));
    try {
      await apiRequest(`/users/${user.id}`, { method: 'DELETE', token });
      refetch();
    } catch (err) {
      setRowErrors((prev) => ({ ...prev, [user.id]: err.message }));
    } finally {
      setBusyUserId(null);
    }
  }

  return (
    <section aria-labelledby="users-heading" className="mb-10">
      <h2 id="users-heading" className="mb-3 text-xl font-bold text-white">
        Users &amp; reservations
      </h2>

      {!token && (
        <p className="text-sm text-gray-500">Provide an admin token above to load users.</p>
      )}

      {token && loading && <p className="text-sm text-gray-400">Loading users…</p>}

      {token && error && (
        <p role="alert" className="text-sm text-red-400">
          Failed to load users: {error.message}
          {error.status === 401 && ' (token missing or expired)'}
          {error.status === 403 && ' (this token is not an admin account)'}
        </p>
      )}

      {token && users && users.length === 0 && (
        <p className="text-sm text-gray-400">No users yet.</p>
      )}

      {token && users && users.length > 0 && (
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.id} className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-white">{user.email}</span>
                  {Boolean(user.is_admin) && (
                    <span className="rounded-full bg-night-mauve/30 px-2 py-0.5 text-xs font-semibold text-night-mauve">
                      Admin
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    Joined {formatDateTime(user.created_at)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenReservationFormFor((current) => (current === user.id ? null : user.id))
                    }
                    className="rounded-md border border-gray-700 px-2.5 py-1 text-xs font-semibold text-gray-300 hover:bg-gray-800"
                  >
                    {openReservationFormFor === user.id ? 'Cancel booking' : 'New reservation'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(user)}
                    disabled={busyUserId === user.id}
                    className="rounded-md border border-blood-red/60 px-2.5 py-1 text-xs font-semibold text-red-300 hover:bg-blood-red/20 disabled:opacity-50"
                  >
                    {busyUserId === user.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>

              {rowErrors[user.id] && (
                <p role="alert" className="mt-2 text-sm text-red-400">
                  {rowErrors[user.id]}
                </p>
              )}

              {openReservationFormFor === user.id && (
                <NewReservationForm user={user} token={token} />
              )}

              <div className="mt-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Reservations ({user.reservations.length})
                </p>
                <ReservationsList reservations={user.reservations} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default UsersPanel;
