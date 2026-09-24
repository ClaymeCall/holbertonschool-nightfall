import React from 'react';
import ExperienceCard from '../common/ExperienceCard';

function ExperiencesList({ experiences , hasFilters}) {
  if (!experiences || experiences.length === 0) {
    return (
      <p className="text-sm text-gray-400">
        {hasFilters
          ? 'Aucune expérience ne correspond à vos critères.'
          : 'Aucune expérience disponible.'}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
