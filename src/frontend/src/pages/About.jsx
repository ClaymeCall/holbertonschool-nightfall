import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { GitHubIcon } from '../components/ui/icons';

const TEAM = [
  {
    name: 'Clément Callejon',
    role: 'Développeur full-stack',
    github: 'https://github.com/ClaymeCall',
    bio: "Clément a posé l'architecture du projet et développé une grande partie de l'API (expériences, réservations, utilisateurs, authentification) ainsi que le frontend. Il a aussi mis en place l'environnement Docker et le déploiement des trois services.",
  },
  {
    name: 'Thomas Rousseau',
    role: 'Développeur authentification',
    github: 'https://github.com/Tomsonne',
    bio: "Thomas a développé le système d'authentification du site : inscription, connexion et gestion des sessions côté backend, ainsi que les pages de connexion et d'inscription côté frontend.",
  },
  {
    name: 'Haitu Nguyen',
    role: 'Développeur interface & réservations',
    github: 'https://github.com/N-Haitu31',
    bio: "Haitu a implémenté le parcours de réservation (création, consultation, annulation) côté backend et frontend, ainsi qu'une bonne partie des composants d'interface réutilisables du site.",
  },
];

function MemberCard({ name, role, github, bio }) {
  return (
    <li className="flex h-full flex-col rounded-xl border border-line bg-surface/60 p-6 text-left">
      <div className="flex-1">
        <h3 className="font-display text-2xl font-semibold text-ink">{name}</h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-accent">{role}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{bio}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <a
          href={github}
          target="_blank"
          rel="noreferrer"
          aria-label={`Profil GitHub de ${name}`}
          className="text-ink-muted hover:text-ink"
        >
          <GitHubIcon size={22} />
        </a>
      </div>
    </li>
  );
}

function About() {
  return (
    <div className="min-h-screen bg-canvas">
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-highlight">À propos</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Nightfall n'est pas un parc comme les autres.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
          Tout a commencé avec une question simple : et si les visiteurs n'assistaient plus au danger,
          mais le vivaient ? De cette idée est né un parc où chaque zone abandonnée, chaque laboratoire
          contaminé et chaque signal venu d'ailleurs raconte sa propre histoire — et vous y tient le
          premier rôle.
        </p>
      </section>

      <section aria-labelledby="mission-title" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 rounded-xl border border-line bg-surface/60 p-8 md:grid-cols-2">
          <div>
            <h2 id="mission-title" className="font-display text-2xl font-semibold text-ink">
              Notre mission
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Offrir des expériences immersives où la peur, le mystère et la survie se vivent en
              sécurité. Derrière chaque décor se cache une équipe qui contrôle tout — l'intensité,
              le rythme, l'issue — pour que le seul vrai risque soit celui d'y prendre goût.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Depuis les coulisses</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Nightfall est conçu et exploité par une petite équipe qui fait tourner aussi bien les
              scénarios que les serveurs qui les réservent. Trois personnes, un parc, et beaucoup trop
              de nuits blanches passées à peaufiner des couloirs qui n'existent pas encore.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="team-title" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-highlight">
            L'équipe
          </p>
          <h2 id="team-title" className="mt-3 font-display text-4xl font-semibold text-ink">
            L'équipe derrière les grilles
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-muted">
            Voici qui ouvre — et referme — les portes de chaque expérience.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {TEAM.map((member) => (
            <MemberCard key={member.name} {...member} />
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 text-center">
        <Button as={Link} to="/" size="lg">
          Découvrir les expériences
        </Button>
      </section>
    </div>
  );
}

export default About;
