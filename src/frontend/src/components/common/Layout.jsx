import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash, key]);
  return (
    <>
      <a className="skip-link" href="#main-content">Aller au contenu</a>
      <Navbar />
      <div id="page-content"><Outlet /></div>
      <Footer />
    </>
  );
}
export default Layout;
