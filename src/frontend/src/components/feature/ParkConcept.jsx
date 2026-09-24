import React from 'react';

const STEPS = [
  {
    title: 'Choisir',
    text: "Parcourez le catalogue : chaque expérience a son univers, sa durée, son niveau d'intensité et son nombre maximum de participants.",
  },
  {
    title: 'Réserver',
    text: "Une date, un nombre de participants, et votre place est confirmée. Il suffit d'avoir un compte.",
  },
  {
    title: 'Retrouver',
    text: "Vos réservations sont réunies dans votre espace personnel. Vous pouvez les annuler jusqu'à 48 heures avant l'heure prévue.",
  },
];

function ParkConcept() {
  return (
    <section id="concept" aria-labelledby="concept-title" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-highlight">Le parc</p>
        <h2 id="concept-title" className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Ici, on ne fait pas des attractions.
        </h2>
        <p className="mt-5 text-base leading-relaxed text-ink-muted">
          Laboratoire contaminé, bunker abandonné, zone radioactive, invasion extraterrestre… Chaque
          expérience de Nightfall est un univers à part entière, avec sa propre ambiance. Vous n'y
          entrez pas en spectateur : vous y participez.
        </p>
      </div>

      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {STEPS.map(({ title, text }, index) => (
          <li key={title} className="rounded-xl border border-line bg-surface/60 p-6">
            <span aria-hidden="true" className="font-display text-4xl font-semibold text-accent lining-nums">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default ParkConcept;
