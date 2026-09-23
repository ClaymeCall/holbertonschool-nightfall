import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {

    const navigate = useNavigate();

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
      const response = await fetch(
        'http://localhost:5080/api/auth/logout',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        console.error('Erreur pendant la déconnexion');
      }
    } catch (error) {
      console.error('Impossible de contacter le serveur', error);
    }

    localStorage.removeItem('token');
    setIsConnected(false);

    navigate('/');
  }

  return (
    <nav className="flex justify-between items-center min-h-[64px] px-8 bg-deep-black" aria-label="Navigation principale">
      <a className="flex items-center justify-center h-10 w-10 text-night-mauve text-3xl font-bold no-underline" href="/" aria-label="Nightfall, accueil">
        N
      </a>
      <div className="flex items-center gap-4">
        <Link to="/admin" className="text-sm text-gray-300 no-underline hover:text-white">
          Admin
        </Link>

        {isConnected ? (
          <button
            type="button"
            onClick={handleLogout}
            className="bg-blood-red text-white border-0 rounded-md cursor-pointer font-bold py-2 px-4"
          >
            Déconnexion
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-blood-red text-white border-0 rounded-md cursor-pointer font-bold py-2 px-4 no-underline inline-block"
          >
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
