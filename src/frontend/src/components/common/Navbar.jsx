import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { apiRequest } from '../../lib/api';
import NightfallLogo from '../ui/NightfallLogo';

const LINK_CLASS = 'text-sm text-gray-300 no-underline hover:text-white';
const MOBILE_LINK_CLASS = 'text-base text-gray-300 no-underline hover:text-white';
const CTA_CLASS = 'bg-accent text-accent-fg border-0 rounded-md cursor-pointer font-bold py-2 px-4 no-underline inline-block text-center';

function Navbar() {

  const navigate = useNavigate();
  const { token, isAdmin, logout } = useAuth();

  const [isConnected, setIsConnected] = useState(
    Boolean(localStorage.getItem('token'))
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  async function handleLogout() {
    const token = localStorage.getItem('token');
    closeMenu();

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
    <nav className="sticky top-0 z-50 bg-canvas" aria-label="Navigation principale">
      <div className="flex min-h-[64px] items-center justify-between px-4 sm:px-8">
        <a className="flex items-center gap-2 no-underline" href="/" aria-label="Nightfall, accueil">
          <NightfallLogo className="h-10 w-10" title="" />
          <span className="font-display text-xl tracking-wide text-ink">Nightfall</span>
        </a>

        <div className="hidden items-center gap-4 md:flex">
          <Link to="/about" className={LINK_CLASS}>
            À propos
          </Link>
          {token && isAdmin && (
            <Link to="/admin" className={LINK_CLASS}>
              Admin
            </Link>
          )}
          {token && (
            <Link to="/dashboard" className={LINK_CLASS}>
              Mes réservations
            </Link>
          )}

          {isConnected ? (
            <button type="button" onClick={handleLogout} className={CTA_CLASS}>
              Déconnexion
            </button>
          ) : (
            <Link to="/login" className={CTA_CLASS}>
              Connexion
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-ink md:hidden"
          aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div id="mobile-menu" className="flex flex-col gap-4 border-t border-line px-4 pb-6 pt-4 md:hidden">
          <Link to="/about" className={MOBILE_LINK_CLASS} onClick={closeMenu}>
            À propos
          </Link>
          {token && isAdmin && (
            <Link to="/admin" className={MOBILE_LINK_CLASS} onClick={closeMenu}>
              Admin
            </Link>
          )}
          {token && (
            <Link to="/dashboard" className={MOBILE_LINK_CLASS} onClick={closeMenu}>
              Mes réservations
            </Link>
          )}

          {isConnected ? (
            <button type="button" onClick={handleLogout} className={CTA_CLASS}>
              Déconnexion
            </button>
          ) : (
            <Link to="/login" className={CTA_CLASS} onClick={closeMenu}>
              Connexion
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
