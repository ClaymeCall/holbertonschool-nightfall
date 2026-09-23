import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useApiResource from '../hooks/useApiResource';
import { apiRequest, API_ORIGIN } from '../lib/api';
import { intensityLabel } from '../lib/intensity';

const currencyFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

const IMAGE_BASE_URL = `${API_ORIGIN}/images/experiences/`;

function ExperienceDetails() {
  const { id } = useParams();
  const { data: experiences, loading, error } = useApiResource('/experiences');

  const experience = experiences?.find((item) => String(item.id) === id);

  return (
    <div className="min-h-screen bg-deep-black">
      <main className="mx-auto max-w-4xl px-6 py-10">
        <Link to="/" className="text-sm text-gray-400 hover:text-white">
          ← Retour aux expériences
        </Link>

        {loading && <p className="mt-6 text-sm text-gray-400">Chargement de l'expérience…</p>}

        {error && (
          <p role="alert" className="mt-6 text-sm text-red-400">
            Impossible de charger l'expérience : {error.message}
          </p>
        )}

        {!loading && !error && experiences && !experience && (
          <p role="alert" className="mt-6 text-sm text-red-400">
            Cette expérience n'existe pas ou n'est plus disponible.
          </p>
        )}

        {experience && (
          <ExperienceDetailsContent experience={experience} />
        )}
      </main>
    </div>
  );
}

function ExperienceDetailsContent({ experience }) {
  const {
    name,
    description,
    image,
    category,
    duration,
    intensity_level: intensityLevel,
    max_participants: maxParticipants,
    price,
  } = experience;

  const imageUrl = image ? `${IMAGE_BASE_URL}${image}` : null;
  const intensityLabelText = intensityLabel(intensityLevel);

  return (
    <article className="mt-6">
      <div
        className="relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-xl border border-gray-800 bg-cover bg-center p-8"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundColor: '#0a0a0a',
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(139,0,0,0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/70 to-transparent" />

        {category && (
          <span className="relative mb-3 w-fit rounded-full border border-blood-red/60 bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-blood-red">
            {category}
          </span>
        )}

        <h1 className="relative text-4xl font-bold leading-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          {name}
        </h1>

        {(duration || intensityLabelText || maxParticipants) && (
          <p className="relative mt-3 text-sm uppercase tracking-widest text-gray-300">
            {duration ? `${duration} min` : null}
            {duration && intensityLabelText ? ' · ' : null}
            {intensityLabelText}
            {(duration || intensityLabelText) && maxParticipants ? ' · ' : null}
            {maxParticipants ? `${maxParticipants} participants max` : null}
          </p>
        )}
      </div>

      {description && (
        <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-gray-300">
          {description}
        </p>
      )}

      <div className="mt-8 rounded-xl border border-gray-800 bg-black/40 p-6">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">
            {currencyFormatter.format(Number(price))}
          </span>
        </div>

        <ReservationForm experience={experience} />
      </div>
    </article>
  );
}

function ReservationForm({ experience }) {
  const token = localStorage.getItem('token');
  const [dateTime, setDateTime] = useState('');
  const [participants, setParticipants] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!token) {
    return (
      <p className="mt-6 text-sm text-gray-400">
        <Link to="/login" className="text-night-mauve hover:underline">
          Connecte-toi
        </Link>{' '}
        pour réserver cette expérience.
      </p>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!dateTime) {
      setFeedback({ type: 'error', message: 'Choisis une date et une heure.' });
      return;
    }

    const bookingDate = new Date(dateTime);
    if (bookingDate <= new Date()) {
      setFeedback({ type: 'error', message: 'La date doit être dans le futur.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      await apiRequest('/reservations', {
        method: 'POST',
        token,
        body: JSON.stringify({
          experience_id: experience.id,
          date: bookingDate.toISOString(),
          participants: Number(participants),
        }),
      });
      setFeedback({ type: 'success', message: 'Réservation confirmée !' });
      setDateTime('');
      setParticipants(1);
    } catch (err) {
      const message =
        err.status === 401
          ? 'Ta session a expiré, reconnecte-toi pour réserver.'
          : err.message;
      setFeedback({ type: 'error', message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-wrap items-end gap-4">
      <label className="text-xs text-gray-400">
        <span className="mb-1 block">Date &amp; heure</span>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="rounded border border-gray-700 bg-deep-black px-3 py-2 text-sm text-white focus:border-night-mauve focus:outline-none"
        />
      </label>

      <label className="text-xs text-gray-400">
        <span className="mb-1 block">Participants</span>
        <input
          type="number"
          min={1}
          max={experience.max_participants || undefined}
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          className="w-20 rounded border border-gray-700 bg-deep-black px-3 py-2 text-sm text-white focus:border-night-mauve focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-blood-red px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Réservation…' : 'Réserver'}
      </button>

      {feedback && (
        <p
          role={feedback.type === 'error' ? 'alert' : 'status'}
          className={`w-full text-sm ${feedback.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}
        >
          {feedback.message}
        </p>
      )}
    </form>
  );
}

export default ExperienceDetails;
