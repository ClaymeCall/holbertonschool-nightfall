import React, { useState } from 'react';
import useApiResource from '../../hooks/useApiResource';
import { apiRequest } from '../../lib/api';
import { formatDateTimeShort } from '../../lib/format';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import { useToast } from '../ui/ToastProvider';
import ConfirmDelete, { focusLater } from './ConfirmDelete';
import NewReservationForm from './NewReservationForm';
import PanelStatus from './PanelStatus';

function ReservationsList({ reservations }) {
  if (reservations.length === 0) {
    return <p className="pl-4 text-sm text-ink-muted">Aucune réservation.</p>;
  }

  return (
    <ul className="ml-4 space-y-1.5 border-l border-line pl-4">
      {reservations.map((reservation) => (
        <li key={reservation.id} className="text-sm text-ink-muted">
          <span className="text-ink">{reservation.experience?.name}</span>
          {' — '}
          {formatDateTimeShort(reservation.date_time)}
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
  const { notify } = useToast();
  const [busyUserId, setBusyUserId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [rowErrors, setRowErrors] = useState({});
  const [openReservationFormFor, setOpenReservationFormFor] = useState(null);

  function cancelDelete(user) {
    setConfirmingId(null);
    focusLater(`delete-user-${user.id}`);
  }

  async function handleDelete(user) {
    setBusyUserId(user.id);
    setRowErrors((prev) => ({ ...prev, [user.id]: null }));
    try {
      await apiRequest(`/users/${user.id}`, { method: 'DELETE', token });
      notify({ variant: 'success', title: 'Utilisateur supprimé', message: user.email });
      setConfirmingId(null);
      refetch();
    } catch (err) {
      setRowErrors((prev) => ({ ...prev, [user.id]: err.message }));
      cancelDelete(user);
    } finally {
      setBusyUserId(null);
    }
  }

  return (
    <section aria-labelledby="users-heading" className="mb-12">
      <h2 id="users-heading" className="mb-4 font-display text-3xl text-ink">
        Utilisateurs et réservations
      </h2>

      <PanelStatus
        token={token}
        loading={loading}
        error={error}
        isEmpty={users?.length === 0}
        name="utilisateurs"
        emptyText="Aucun utilisateur pour le moment."
        skeletonCount={2}
        skeletonClass="h-24"
      />

      {token && users && users.length > 0 && (
        <ul className="space-y-3">
          {users.map((user) => {
            const confirming = confirmingId === user.id;

            return (
              <li
                key={user.id}
                className={`rounded-xl border bg-surface p-4 ${confirming ? 'border-red-400/60' : 'border-line'}`}
              >
                {confirming ? (
                  <ConfirmDelete
                    title={`Supprimer ${user.email} ?`}
                    detail="Action définitive. Ses réservations seront supprimées aussi."
                    busy={busyUserId === user.id}
                    onCancel={() => cancelDelete(user)}
                    onConfirm={() => handleDelete(user)}
                  />
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg text-ink">{user.email}</span>
                        {Boolean(user.is_admin) && (
                          <span className="rounded-full border border-highlight/50 bg-highlight/10 px-2.5 py-0.5 text-[11px] uppercase tracking-widest text-highlight">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-ink-muted">Inscrit le {formatDateTimeShort(user.created_at)}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="ghost"
                        className="min-h-10"
                        onClick={() =>
                          setOpenReservationFormFor((current) => (current === user.id ? null : user.id))
                        }
                      >
                        {openReservationFormFor === user.id ? 'Fermer le formulaire' : 'Nouvelle réservation'}
                      </Button>
                      <Button
                        id={`delete-user-${user.id}`}
                        variant="danger"
                        className="min-h-10"
                        onClick={() => {
                          setOpenReservationFormFor(null);
                          setConfirmingId(user.id);
                        }}
                        disabled={busyUserId === user.id}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                )}

                {rowErrors[user.id] && (
                  <Alert variant="error" className="mt-3">
                    {rowErrors[user.id]}
                  </Alert>
                )}

                {openReservationFormFor === user.id && !confirming && (
                  <NewReservationForm user={user} token={token} />
                )}

                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink-muted">
                    Réservations ({user.reservations.length})
                  </p>
                  <ReservationsList reservations={user.reservations} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default UsersPanel;
