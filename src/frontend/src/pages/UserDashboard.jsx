import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReservationCard from '../components/feature/ReservationCard';
import Alert from '../components/ui/Alert';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../components/ui/ToastProvider';
import useAuth from '../hooks/useAuth';
import useApiResource from '../hooks/useApiResource';
import { apiRequest } from '../lib/api';
import { formatDateTime } from '../lib/format';

function ReservationsSkeleton() {
  return (
    <div role="status" className="space-y-4">
      <span className="sr-only">Chargement de tes réservations…</span>
      <Skeleton className="h-44 rounded-2xl" />
      <Skeleton className="h-44 rounded-2xl" />
    </div>
  );
}

function UserDashboard() {
  const { token, user } = useAuth();
  const { notify } = useToast();
  const { data: reservations, loading, error, refetch } = useApiResource('/reservations', {
    token,
    enabled: Boolean(token),
  });
  const [confirmingId, setConfirmingId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  async function handleCancel(reservation) {
    setBusyId(reservation.id);
    try {
      await apiRequest(`/reservations/${reservation.id}`, { method: 'DELETE', token });
      notify({
        variant: 'success',
        title: 'Réservation annulée',
        message: `${reservation.experience?.name}, ${formatDateTime(reservation.date_time)}.`,
      });
      refetch();
    } catch (err) {
      notify({
        variant: 'error',
        title: 'Annulation impossible',
        message: err.status === 401 ? 'Ta session a expiré, reconnecte-toi.' : err.message,
      });
    } finally {
      setBusyId(null);
      setConfirmingId(null);
    }
  }

  const now = new Date();

  return (
    <div className="min-h-screen bg-canvas">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-semibold text-ink">Mon espace</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Connecté en tant que <span className="text-ink">{user?.email}</span>
          </p>
        </div>

        <section aria-labelledby="my-reservations-heading">
          <h2
            id="my-reservations-heading"
            className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-highlight"
          >
            Mes réservations
          </h2>

          {loading && <ReservationsSkeleton />}

          {error && (
            <Alert variant="error">
              Impossible de charger tes réservations : {error.message}
              {error.status === 401 && ' (session expirée, reconnecte-toi)'}
            </Alert>
          )}

          {reservations && reservations.length === 0 && (
            <p className="text-sm text-ink-muted">
              Tu n&apos;as pas encore de réservation.{' '}
              <Link to="/" className="text-highlight hover:underline">
                Découvrir les expériences
              </Link>
            </p>
          )}

          {reservations && reservations.length > 0 && (
            <ul className="space-y-4">
              {reservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  now={now}
                  confirming={confirmingId === reservation.id}
                  busy={busyId === reservation.id}
                  onAskCancel={() => setConfirmingId(reservation.id)}
                  onKeep={() => setConfirmingId(null)}
                  onConfirm={() => handleCancel(reservation)}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;
