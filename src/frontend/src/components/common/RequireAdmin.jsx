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
      <div className="min-h-screen bg-canvas text-ink">
        <main className="mx-auto max-w-2xl px-6 py-16 text-center">
          <h1 className="mb-3 font-display text-4xl text-ink">Accès refusé</h1>
          <p className="text-ink-muted">
            Ce compte n&apos;est pas administrateur.{' '}
            <Link to="/" className="font-bold text-highlight underline hover:brightness-125">
              Retour au catalogue
            </Link>
          </p>
        </main>
      </div>
    );
  }

  return children;
}

export default RequireAdmin;
