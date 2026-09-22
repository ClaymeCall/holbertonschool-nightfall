import React from 'react';
import Navbar from '../components/common/Navbar';
import EndpointsCatalog from '../components/admin/EndpointsCatalog';
import AdminTokenGate from '../components/admin/AdminTokenGate';
import UsersPanel from '../components/admin/UsersPanel';
import ExperiencesPanel from '../components/admin/ExperiencesPanel';
import useAdminToken from '../hooks/useAdminToken';

function AdminDashboard() {
  const { token, setToken, clearToken } = useAdminToken();

  return (
    <div className="min-h-screen bg-deep-black">
      <main className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-white">Admin dashboard</h1>

        <AdminTokenGate token={token} onSetToken={setToken} onClearToken={clearToken} />

        <EndpointsCatalog token={token} />
        <ExperiencesPanel />
        <UsersPanel token={token} />
      </main>
    </div>
  );
}

export default AdminDashboard;
