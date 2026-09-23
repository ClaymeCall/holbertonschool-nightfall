import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function RequireAdmin({ children }) {
  const { token, isAdmin } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-deep-black">
        <main className="mx-auto max-w-2xl px-6 py-16 text-center">
          <h1 className="mb-3 text-2xl font-bold text-white">Access denied</h1>
          <p className="text-sm text-gray-400">
            This account isn&apos;t an administrator.{' '}
            <Link to="/" className="text-night-mauve hover:underline">
              Back to the catalog
            </Link>
          </p>
        </main>
      </div>
    );
  }

  return children;
}

export default RequireAdmin;
