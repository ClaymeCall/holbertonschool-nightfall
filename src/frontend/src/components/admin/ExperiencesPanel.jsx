import React from 'react';
import useApiResource from '../../hooks/useApiResource';

const currencyFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

function ExperiencesPanel() {
  const { data: experiences, loading, error } = useApiResource('/experiences');

  return (
    <section aria-labelledby="experiences-heading" className="mb-10">
      <h2 id="experiences-heading" className="mb-3 text-xl font-bold text-white">
        Experiences
      </h2>

      {loading && <p className="text-sm text-gray-400">Loading experiences…</p>}
      {error && (
        <p role="alert" className="text-sm text-red-400">
          Failed to load experiences: {error.message}
        </p>
      )}

      {experiences && experiences.length === 0 && (
        <p className="text-sm text-gray-400">No experiences yet.</p>
      )}

      {experiences && experiences.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-gray-900/60 text-gray-400">
                <th scope="col" className="px-4 py-2 font-medium">
                  Name
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Category
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Duration
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Max participants
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((experience) => (
                <tr key={experience.id} className="border-t border-gray-800">
                  <td className="px-4 py-2 text-gray-200">{experience.name}</td>
                  <td className="px-4 py-2 text-gray-400">{experience.category}</td>
                  <td className="px-4 py-2 text-gray-400">{experience.duration} min</td>
                  <td className="px-4 py-2 text-gray-400">{experience.max_participants}</td>
                  <td className="px-4 py-2 text-gray-400">
                    {currencyFormatter.format(Number(experience.price))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default ExperiencesPanel;
