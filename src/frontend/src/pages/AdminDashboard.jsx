import React from 'react';
import { useNavigate } from 'react-router-dom';
import UsersPanel from '../components/admin/UsersPanel';
import ExperiencesPanel from '../components/admin/ExperiencesPanel';
import ReservationsPanel from '../components/admin/ReservationsPanel';
import Button from '../components/ui/Button';
import useAuth from '../hooks/useAuth';

function AdminDashboard() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-highlight">Administration</p>
            <h1 className="mt-1 font-display text-4xl text-ink sm:text-5xl">Tableau de bord</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
            <span>
              Connecté : <span className="text-ink">{user?.email}</span>
            </span>
            <Button variant="ghost" size="sm" className="min-h-10" onClick={handleLogout}>
              Se déconnecter
            </Button>
          </div>
        </div>

        <ExperiencesPanel token={token} />
        <ReservationsPanel token={token} />
        <UsersPanel token={token} />
      </main>
    </div>
  );
}

export default AdminDashboard;
