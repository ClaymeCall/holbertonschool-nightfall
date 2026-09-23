import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useApiResource from '../hooks/useApiResource';
import { apiRequest, API_ORIGIN } from '../lib/api';

const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const currencyFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

const IMAGE_BASE_URL = `${API_ORIGIN}/images/experiences/`;

function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateTimeFormatter.format(date);
}

function UserDashboard() {
  const { token, user } = useAuth();
  const { data: reservations, loading, error, refetch } = useApiResource('/reservations', {
    token,
    enabled: Boolean(token),
  });
  const [busyReservationId, setBusyReservationId] = useState(null);
  const [rowErrors, setRowErrors] = useState({});

  async function handleCancel(reservation) {
    if (!window.confirm(`Annuler la réservation pour ${reservation.experience?.name} ?`)) {
      return;
    }

    setBusyReservationId(reservation.id);
    setRowErrors((prev) => ({ ...prev, [reservation.id]: null }));
    try {
      await apiRequest(`/reservations/${reservation.id}`, { method: 'DELETE', token });
      refetch();
    } catch (err) {
      setRowErrors((prev) => ({ ...prev, [reservation.id]: err.message }));
    } finally {
      setBusyReservationId(null);
    }
  }

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
              {reservations.map((reservation) => {
                const { experience } = reservation;
                const imageUrl = experience?.image ? `${IMAGE_BASE_URL}${experience.image}` : null;

                return (
                  <li
                    key={reservation.id}
                    className="flex gap-4 rounded-lg border border-gray-800 bg-gray-900/30 p-4"
                  >
                    <div
                      className="h-20 w-20 flex-shrink-0 rounded-md bg-cover bg-center"
                      style={{
                        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                        backgroundColor: '#111',
                      }}
                      aria-hidden="true"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          {experience?.category && (
                            <span className="mb-1 inline-block rounded-full border border-blood-red/60 bg-black/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-blood-red">
                              {experience.category}
                            </span>
                          )}
                          <p className="truncate font-medium text-white">{experience?.name}</p>
                          <p className="mt-1 text-sm text-gray-400">
                            {formatDateTime(reservation.date_time)}
                            {' · '}
                            {reservation.participants} participant{reservation.participants > 1 ? 's' : ''}
                            {experience?.duration ? ` · ${experience.duration} min` : ''}
                          </p>
                        </div>

                        <div className="flex flex-shrink-0 flex-col items-end gap-2">
                          {experience?.price != null && (
                            <span className="text-sm font-bold text-white">
                              {currencyFormatter.format(Number(experience.price))}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleCancel(reservation)}
                            disabled={busyReservationId === reservation.id}
                            className="rounded-md border border-gray-700 px-3 py-1.5 text-xs font-semibold text-gray-300 transition-colors hover:border-blood-red hover:text-blood-red disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {busyReservationId === reservation.id ? 'Annulation…' : 'Annuler la réservation'}
                          </button>
                        </div>
                      </div>

                      {rowErrors[reservation.id] && (
                        <p role="alert" className="mt-2 text-xs text-red-400">
                          {rowErrors[reservation.id]}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;
