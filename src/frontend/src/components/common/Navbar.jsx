import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function Navbar() {
  const { isAdmin } = useAuth();

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
        <Link to="/login" className="bg-blood-red text-white border-0 rounded-md cursor-pointer font-bold py-2 px-4 no-underline inline-block">
          Connexion
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
