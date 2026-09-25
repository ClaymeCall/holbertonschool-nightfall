import React from 'react';
import NightfallLogo from '../ui/NightfallLogo';

const LINK_CLASS = 'text-ink-muted underline decoration-line underline-offset-2 hover:text-ink';

const REPO_URL = 'https://github.com/ClaymeCall/holbertonschool-nightfall';

const DEVS = [
  {
    name: 'Clément Callejon',
    github: 'https://github.com/ClaymeCall',
    codeberg: 'https://codeberg.org/Clemcall',
    website: 'https://clemcall.dev',
    linkedin: 'https://www.linkedin.com/in/clement-callejon/',
  },
  {
    name: 'Thomas Rousseau',
    github: 'https://github.com/Tomsonne',
    linkedin: 'https://www.linkedin.com/in/thomas-rousseau/',
  },
  {
    name: 'Haitu Nguyen',
    github: 'https://github.com/N-Haitu31',
    linkedin: 'https://www.linkedin.com/in/haitu-nguyen-76941638b/',
  },
];

function Footer() {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-3">
          <NightfallLogo className="h-9 w-9" title="" />
          <span className="font-display text-xl tracking-wide text-ink">Nightfall</span>
        </div>

        <nav aria-label="Projet" className="flex flex-col gap-2 text-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-highlight">Projet</p>
          <a href={REPO_URL} target="_blank" rel="noreferrer" className={LINK_CLASS}>
            Code source (GitHub)
          </a>
        </nav>

        <nav aria-label="Équipe" className="flex flex-col text-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-highlight">Équipe</p>
          <ul className="mt-2 flex flex-col divide-y divide-line lg:flex-row lg:divide-y-0 lg:divide-x">
            {DEVS.map(({ name, github, linkedin, codeberg, website }) => (
              <li
                key={name}
                className="flex flex-col gap-1.5 py-4 first:pt-0 last:pb-0 lg:py-0 lg:px-6 lg:first:pl-0 lg:last:pr-0"
              >
                <h3 className="font-display text-base tracking-wide text-ink">{name}</h3>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <a href={github} target="_blank" rel="noreferrer" className={LINK_CLASS}>
                    GitHub
                  </a>
                  {linkedin && (
                    <a href={linkedin} target="_blank" rel="noreferrer" className={LINK_CLASS}>
                      LinkedIn
                    </a>
                  )}
                  {codeberg && (
                    <a href={codeberg} target="_blank" rel="noreferrer" className={LINK_CLASS}>
                      Codeberg
                    </a>
                  )}
                  {website && (
                    <a href={website} target="_blank" rel="noreferrer" className={LINK_CLASS}>
                      clemcall.dev
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line px-6 py-4 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} Nightfall — Projet étudiant Holberton School.
      </div>
    </footer>
  );
}

export default Footer;
