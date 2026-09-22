import React from 'react';
import Navbar from '../components/common/Navbar';
import ExperiencesList from '../components/feature/ExperiencesList';
import useApiResource from '../hooks/useApiResource';

function Home() {
  const { data: experiences, loading, error } = useApiResource('/experiences');

  return (
    <div className="min-h-screen bg-deep-black">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-6 text-3xl font-bold text-white">Expériences</h1>

        {loading && <p className="text-sm text-gray-400">Chargement des expériences…</p>}
        {error && (
          <p role="alert" className="text-sm text-red-400">
            Impossible de charger les expériences : {error.message}
          </p>
        )}

        {experiences && <ExperiencesList experiences={experiences} />}
      </main>
    </div>
  );
}

export default Home;
