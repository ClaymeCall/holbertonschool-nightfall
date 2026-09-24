import React from 'react';
import { CANCELLATION_WINDOW_HOURS } from '../../lib/cancellation';

const STEPS = [
  { title: 'Choisissez votre peur.', text: 'Un laboratoire hors de contrôle, un bunker oublié, une présence dans l’obscurité… Trouvez l’univers qui vous attire autant qu’il vous inquiète.' },
  { title: 'Rassemblez votre équipe.', text: 'Choisissez votre date et vos compagnons d’aventure. Chaque expérience précise sa durée, son intensité et la taille de votre groupe.' },
  { title: 'Passez de l’autre côté.', text: 'Ici, vous faites partie de l’histoire. Explorez, cherchez, coopérez. Le prochain chapitre dépend de vous.' },
];
function ParkConcept() {
  return (
    <>
      <section id="concept" className="concept-section" aria-labelledby="concept-title">
        <div className="site-container concept-grid">
          <div className="concept-image">
            <img src="/images/nightfall-gates.jpg" alt="Les portes du parc Nightfall, baignées de brume et de lumière orange" loading="lazy" />
            <span className="concept-stamp">Vous n’êtes plus<br /><strong>spectateur.</strong></span>
          </div>
          <div>
            <p className="eyebrow">Le concept Nightfall</p>
            <h2 id="concept-title" className="section-title">Ne regardez pas<br />le film.<br /><em>Vivez-le.</em></h2>
            <p className="mt-6 max-w-lg leading-relaxed text-ink-muted">Nightfall est un parc d’expériences immersives où chaque porte ouvre sur une autre réalité. Horreur, survie ou science-fiction : des histoires à traverser ensemble, jusqu’au dernier frisson.</p>
            <ol className="concept-steps">
              {STEPS.map(({ title, text }, index) => (
                <li key={title}><span className="step-number">0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <section id="prepare" className="site-container prepare-section" aria-labelledby="prepare-title">
        <div><p className="eyebrow">Avant de franchir les portes</p><h2 id="prepare-title" className="section-title">Les derniers<br /><em>détails.</em></h2></div>
        <div className="faq-list">
          <details><summary>Comment choisir mon expérience ?<span aria-hidden="true">+</span></summary><p>Filtrez le catalogue par univers, intensité, budget et durée. Sur chaque fiche, retrouvez le scénario et le nombre maximum de participants pour choisir une aventure adaptée à votre groupe.</p></details>
          <details><summary>Comment réserver notre aventure ?<span aria-hidden="true">+</span></summary><p>Créez votre compte ou connectez-vous, ouvrez la fiche de votre expérience, puis sélectionnez une date, une heure et le nombre de participants. Vous retrouverez votre réservation dans votre espace personnel.</p></details>
          <details><summary>Un imprévu : puis-je annuler ?<span aria-hidden="true">+</span></summary><p>L’annulation est possible depuis votre espace personnel plus de {CANCELLATION_WINDOW_HOURS} heures avant le début de l’expérience.</p></details>
        </div>
      </section>
    </>
  );
}
export default ParkConcept;
