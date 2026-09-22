import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import UsersPanel from '../components/admin/UsersPanel';
import ExperiencesPanel from '../components/admin/ExperiencesPanel';
import ReservationsPanel from '../components/admin/ReservationsPanel';
import useAuth from '../hooks/useAuth';

function AdminDashboard() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-deep-black">
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-white">Admin dashboard</h1>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>
              Logged in as <span className="text-gray-200">{user?.email}</span>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-gray-700 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-gray-800"
            >
              Log out
            </button>
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
