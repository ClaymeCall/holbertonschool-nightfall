import React from 'react';
import { Link } from 'react-router-dom';

function AuthLayout({ children }) {
  return (
    <main id="main-content" className="auth-layout">
      <div className="auth-scenery"><img src="/images/nightfall-gates.jpg" alt="" /><div><p className="eyebrow">Votre aventure commence ici</p><h2>La peur se vit<br /><em>ensemble.</em></h2><p>Vos expériences. Votre équipe. Vos souvenirs.</p><Link to="/#experiences">Explorer les expériences ↗</Link></div></div>
      <div className="auth-content">{children}</div>
    </main>
  );
}
export default AuthLayout;
