import React from 'react';
import ExperienceCard from '../common/ExperienceCard';

function ExperiencesList({ experiences , hasFilters}) {
  if (!experiences || experiences.length === 0) {
    return (
      <p className="empty-catalogue text-sm text-ink-muted">
        {hasFilters
          ? 'Aucune expérience ne correspond à vos critères.'
          : 'Aucune expérience disponible.'}
      </p>
    );
  }

  return (
    <div className="experiences-grid">
      {experiences.map((experience) => (
        <ExperienceCard
          key={experience.id}
          experience={experience}
        />
      ))}
    </div>
  );
}

export default ExperiencesList;
