import React from 'react';
import { Link } from 'react-router-dom';
import NightfallLogo from '../ui/NightfallLogo';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-top">
          <div><Link to="/" className="brand"><NightfallLogo className="h-11 w-11" title="" /><span>NIGHTFALL<small>Beyond your fears</small></span></Link><p>La nuit s’achève.<br />Les souvenirs restent.</p></div>
          <div><p className="eyebrow">Franchir les portes</p><Link to="/#experiences">Les expériences ↗</Link><Link to="/#concept">L’univers Nightfall</Link><Link to="/#prepare">Préparer sa visite</Link></div>
          <div><p className="eyebrow">Votre aventure</p><Link to="/dashboard">Mes réservations</Link><Link to="/login">Se connecter</Link><Link to="/register">Créer un compte</Link></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Nightfall · Parc à thème fictif</span><span>Entrez ensemble. Frissonnez ensemble.</span></div>
      </div>
    </footer>
  );
}
export default Footer;
