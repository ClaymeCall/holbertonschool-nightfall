import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { apiRequest } from '../../lib/api';
import NightfallLogo from '../ui/NightfallLogo';

function Navbar() {

  const navigate = useNavigate();
  const { token, isAdmin, logout } = useAuth();

  const [isConnected, setIsConnected] = useState(
    Boolean(localStorage.getItem('token'))
  );

  async function handleLogout() {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsConnected(false);
      navigate('/login');
      return;
    }

    try {
      await apiRequest('/auth/logout', { method: 'POST', token });
    } catch (error) {
      console.error('Erreur pendant la déconnexion', error);
    }

    localStorage.removeItem('token');
    setIsConnected(false);

    window.location.assign('/');
  }

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center min-h-[64px] px-8 bg-canvas" aria-label="Navigation principale">
      <a className="flex items-center no-underline" href="/" aria-label="Nightfall, accueil">
        <NightfallLogo className="h-10 w-10" title="" />
      </a>
      <div className="flex items-center gap-4">
        {token && isAdmin && (
          <Link to="/admin" className="text-sm text-gray-300 no-underline hover:text-white">
            Admin
          </Link>
        )}
        {token && (
          <Link to="/dashboard" className="text-sm text-gray-300 no-underline hover:text-white">
            Mes réservations
          </Link>
        )}

        {isConnected ? (
          <button
            type="button"
            onClick={handleLogout}
            className="bg-accent text-accent-fg border-0 rounded-md cursor-pointer font-bold py-2 px-4"
          >
            Déconnexion
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-accent text-accent-fg border-0 rounded-md cursor-pointer font-bold py-2 px-4 no-underline inline-block"
          >
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
