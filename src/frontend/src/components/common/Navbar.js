import React from 'react';

function Navbar() {
  return (
    <nav className="navbar" aria-label="Navigation principale">
      <a className="navbar__logo" href="/" aria-label="Nightfall, accueil">
        N
      </a>
      <button className="navbar__login" type="button">
        Connexion
      </button>
    </nav>
  );
}

export default Navbar;