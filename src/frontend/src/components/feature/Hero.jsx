import React from 'react';
import Button from '../ui/Button';

function Hero() {
  return (
    <section className="park-hero" aria-labelledby="hero-title">
      <img className="park-hero__image" src="/images/nightfall-gates.jpg" alt="" fetchpriority="high" />
      <div className="park-hero__shade" aria-hidden="true" />
      <div className="atmosphere-mist" aria-hidden="true" />
      <div className="site-container park-hero__content">
        <p className="eyebrow"><span className="signal-dot" /> Parc d’expériences immersives</p>
        <h1 id="hero-title">La nuit<br />vous <em>attend.</em></h1>
        <p className="park-hero__description">Derrière ces portes, vos peurs prennent vie.<br />Entrez dans l’histoire. Tentez d’en sortir.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button as="a" href="#experiences" size="lg">Choisir mon expérience <span aria-hidden="true">↗</span></Button>
          <Button as="a" href="#concept" variant="ghost" size="lg">Explorer le parc</Button>
        </div>
        <p className="park-hero__note">Horreur · Survie · Science-fiction</p>
      </div>
      <div className="park-hero__bottom site-container">
        <span>Bienvenue de l’autre côté.</span>
        <a href="#experiences">Descendre dans l’inconnu <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}
export default Hero;
