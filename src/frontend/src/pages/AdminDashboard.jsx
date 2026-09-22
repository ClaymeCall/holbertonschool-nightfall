import React from 'react';
import Navbar from '../components/common/Navbar';
import AdminTokenGate from '../components/admin/AdminTokenGate';
import UsersPanel from '../components/admin/UsersPanel';
import ExperiencesPanel from '../components/admin/ExperiencesPanel';
import ReservationsPanel from '../components/admin/ReservationsPanel';
import useAdminToken from '../hooks/useAdminToken';

function AdminDashboard() {
  const { token, setToken, clearToken } = useAdminToken();

  return (
    <div className="min-h-screen bg-deep-black">
      <main className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-white">Admin dashboard</h1>

        <AdminTokenGate token={token} onSetToken={setToken} onClearToken={clearToken} />

        <ExperiencesPanel token={token} />
        <ReservationsPanel token={token} />
        <UsersPanel token={token} />
      </main>
    </div>
  );
}

export default AdminDashboard;
