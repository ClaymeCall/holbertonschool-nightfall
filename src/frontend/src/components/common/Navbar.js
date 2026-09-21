import React from 'react';

function Navbar() {
  return (
    <nav className="flex justify-between items-center min-h-[64px] px-8 bg-noir-profond" aria-label="Navigation principale">
      <a className="flex items-center color-red justify-center h-10 w-10 text-bleu-nuit text-3xl font-bold no-underline" href="/" aria-label="Nightfall, accueil">
        N
      </a>
      <button className="bg-rouge-sang text-white border-0 rounded-md cursor-pointer font-bold py-2 px-4" type="button">
        Connexion
      </button>
    </nav>
  );
}

export default Navbar;
