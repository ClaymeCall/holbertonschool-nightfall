import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { apiRequest } from '../../lib/api';
import NightfallLogo from '../ui/NightfallLogo';
import Button from '../ui/Button';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuToggleRef = useRef(null);
  useEffect(() => { setMenuOpen(false); }, [location.pathname, location.hash]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await apiRequest('/auth/logout', { method: 'POST', token });
    } catch (error) {
      console.error('Erreur pendant la déconnexion', error);
    } finally {
      logout();
      setLoggingOut(false);
      setMenuOpen(false);
      navigate('/');
    }
  }

  return (
    <header className="site-header">
      <nav className="site-container site-nav" aria-label="Navigation principale">
        <Link className="brand" to="/" aria-label="Nightfall, accueil">
          <NightfallLogo className="h-10 w-10" title="" />
          <span>NIGHTFALL<small>Beyond your fears</small></span>
        </Link>
        <button ref={menuToggleRef} type="button" className="menu-toggle" aria-expanded={menuOpen} aria-controls="navigation-links" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Fermer ×' : 'Menu ☰'}</button>
        <div id="navigation-links" className={`nav-links ${menuOpen ? 'is-open' : ''}`} onKeyDown={(event) => { if (event.key === 'Escape') { setMenuOpen(false); menuToggleRef.current?.focus(); } }}>
          <Link to="/#experiences">Les expériences</Link>
          <Link to="/#concept">Le parc</Link>
          <Link to="/#prepare">Préparer sa visite</Link>
          <span className="nav-divider" aria-hidden="true" />
          {token ? (
            <>
              <Link to={isAdmin ? '/admin' : '/dashboard'}>{isAdmin ? 'Administration' : 'Mes réservations'}</Link>
              <button type="button" onClick={handleLogout} disabled={loggingOut} className="nav-logout">{loggingOut ? 'Déconnexion…' : 'Déconnexion'}</button>
            </>
          ) : (
            <Link to="/login">Mon espace</Link>
          )}
          <Button as={Link} to="/#experiences" className="nav-book">Réserver <span aria-hidden="true">↗</span></Button>
        </div>
      </nav>
    </header>
  );
}
export default Navbar;
