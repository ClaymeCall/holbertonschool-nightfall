import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useApiResource from '../hooks/useApiResource';

const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateTimeFormatter.format(date);
}

function UserDashboard() {
  const { token, user } = useAuth();
  const { data: reservations, loading, error } = useApiResource('/reservations', {
    token,
    enabled: Boolean(token),
  });

  return (
    <div className="min-h-screen bg-deep-black">
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Mon espace</h1>
          <p className="mt-1 text-sm text-gray-400">
            Connecté en tant que <span className="text-gray-200">{user?.email}</span>
          </p>
        </div>

        <section aria-labelledby="my-reservations-heading">
          <h2 id="my-reservations-heading" className="mb-3 text-xl font-bold text-white">
            Mes réservations
          </h2>

          {loading && <p className="text-sm text-gray-400">Chargement de tes réservations…</p>}

          {error && (
            <p role="alert" className="text-sm text-red-400">
              Impossible de charger tes réservations : {error.message}
              {error.status === 401 && ' (session expirée, reconnecte-toi)'}
            </p>
          )}

          {reservations && reservations.length === 0 && (
            <p className="text-sm text-gray-400">
              Tu n&apos;as pas encore de réservation.{' '}
              <Link to="/" className="text-night-mauve hover:underline">
                Découvrir les expériences
              </Link>
            </p>
          )}

          {reservations && reservations.length > 0 && (
            <ul className="space-y-4">
              {reservations.map((reservation) => (
                <li key={reservation.id} className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
                  <p className="font-medium text-white">{reservation.experience?.name}</p>
                  <p className="mt-1 text-sm text-gray-400">
                    {formatDateTime(reservation.date_time)}
                    {' · '}
                    {reservation.participants} participant{reservation.participants > 1 ? 's' : ''}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;
