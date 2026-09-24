import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { experienceImageUrl } from '../lib/format';

// A dark veil with a circular hole that follows the pointer, like a flashlight.
const FLASHLIGHT =
  'bg-[radial-gradient(circle_250px_at_var(--x)_var(--y),transparent_0%,rgb(var(--color-canvas)/0.95)_100%)]';

function NotFound() {
  const sceneRef = useRef(null);

  // The position lives in CSS variables, so moving the light never re-renders React.
  function moveLight(event) {
    const scene = sceneRef.current;
    if (!scene || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const rect = scene.getBoundingClientRect();
    scene.style.setProperty('--x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    scene.style.setProperty('--y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }

  return (
    <section
      ref={sceneRef}
      onPointerMove={moveLight}
      data-theme="asile"
      style={{ '--x': '74%', '--y': '46%' }}
      className="relative isolate flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-canvas text-ink"
    >
      <img
        src={experienceImageUrl('asile-abandonne.jpg')}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute right-[6%] top-[14%] -z-10 select-none font-display text-[10rem] font-bold leading-none text-highlight/50 sm:text-[16rem] lg:text-[22rem]"
      >
        404
      </div>
      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 ${FLASHLIGHT}`} />

      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-highlight">Erreur 404</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] sm:text-6xl">
            Vous vous êtes perdu dans le noir.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Cette page n'existe pas ou n'existe plus. Suivez la lumière pour retrouver le chemin.
          </p>
          <Button as={Link} to="/" size="lg" className="mt-8">
            Retour à l'accueil
          </Button>
          <p className="mt-8 hidden text-sm text-ink-muted [@media(hover:hover)]:block">
            Bougez la souris pour éclairer la pièce.
          </p>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
