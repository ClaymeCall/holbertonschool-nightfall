import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function Navbar() {
  const navigate = useNavigate();
  const { token, isAdmin, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="flex justify-between items-center min-h-[64px] px-8 bg-deep-black" aria-label="Navigation principale">
      <a className="flex items-center justify-center h-10 w-10 text-night-mauve text-3xl font-bold no-underline" href="/" aria-label="Nightfall, accueil">
        N
      </a>
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link to="/admin" className="text-sm text-gray-300 no-underline hover:text-white">
            Admin
          </Link>
        )}
        {token && !isAdmin && (
          <Link to="/dashboard" className="text-sm text-gray-300 no-underline hover:text-white">
            Mes réservations
          </Link>
        )}
        {token ? (
          <button
            type="button"
            onClick={handleLogout}
            className="bg-transparent border-0 cursor-pointer text-sm text-gray-300 hover:text-white"
          >
            Déconnexion
          </button>
        ) : (
          <Link to="/login" className="bg-blood-red text-white border-0 rounded-md cursor-pointer font-bold py-2 px-4 no-underline inline-block">
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
