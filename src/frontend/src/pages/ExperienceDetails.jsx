import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import useApiResource from '../hooks/useApiResource';
import { apiRequest } from '../lib/api';
import { experienceImageUrl, formatPrice } from '../lib/format';
import { themeForExperience } from '../lib/themes';

function ExperienceDetails() {
  const { id } = useParams();
  const { data: experiences, loading, error } = useApiResource('/experiences');

  const experience = experiences?.find((item) => String(item.id) === id);

  return (
    <div className="min-h-screen bg-canvas" data-theme={themeForExperience(experience)}>
      <main className="mx-auto max-w-4xl px-6 py-10">
        <Link to="/" className="text-sm text-ink-muted hover:text-ink">
          ← Retour aux expériences
        </Link>

        {loading && <ExperienceDetailsSkeleton />}

        {error && (
          <Alert variant="error" className="mt-6">
            Impossible de charger l'expérience : {error.message}
          </Alert>
        )}

        {!loading && !error && experiences && !experience && (
          <Alert variant="error" className="mt-6">
            Cette expérience n'existe pas ou n'est plus disponible.
          </Alert>
        )}

        {experience && (
          <ExperienceDetailsContent experience={experience} />
        )}
      </main>
    </div>
  );
}

function ExperienceDetailsSkeleton() {
  return (
    <div role="status" className="mt-6">
      <span className="sr-only">Chargement de l'expérience…</span>
      <Skeleton className="min-h-[320px] rounded-xl" />
      <Skeleton className="mt-6 h-4 w-11/12" />
      <Skeleton className="mt-3 h-4 w-10/12" />
      <Skeleton className="mt-3 h-4 w-8/12" />
      <Skeleton className="mt-8 h-28 rounded-xl" />
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

  const imageUrl = experienceImageUrl(image);

  return (
    <article className="mt-6 motion-safe:animate-fade-up">
      <div
        className="relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-xl border border-line bg-cover bg-center p-8"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundColor: 'rgb(var(--color-canvas))',
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgb(var(--color-accent)/0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/70 to-transparent" />

        {category && <Badge className="relative mb-3">{category}</Badge>}

        <h1 className="relative font-display text-5xl font-semibold leading-tight text-ink drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          {name}
        </h1>

        {(duration || intensityLevel || maxParticipants) && (
          <p className="relative mt-3 text-sm uppercase tracking-widest text-ink-muted">
            {duration ? `${duration} min` : null}
            {duration && intensityLevel ? ' · ' : null}
            {intensityLevel}
            {(duration || intensityLevel) && maxParticipants ? ' · ' : null}
            {maxParticipants ? `${maxParticipants} participants max` : null}
          </p>
        )}
      </div>

      {description && (
        <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-ink-muted">
          {description}
        </p>
      )}

      <div className="mt-8 rounded-xl border border-line bg-surface/60 p-6">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-ink">
            {formatPrice(price)}
          </span>
        </div>

        <ReservationForm experience={experience} />
      </div>
    </article>
  );
}

const INPUT_CLASSES =
  'rounded border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-highlight focus:outline-none focus:ring-2 focus:ring-highlight/40';

function ReservationForm({ experience }) {
  const token = localStorage.getItem('token');
  const [dateTime, setDateTime] = useState('');
  const [participants, setParticipants] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!token) {
    return (
      <p className="mt-6 text-sm text-ink-muted">
        <Link to="/login" className="text-highlight hover:underline">
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
      <label className="text-xs text-ink-muted">
        <span className="mb-1 block">Date &amp; heure</span>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className={INPUT_CLASSES}
        />
      </label>

      <label className="text-xs text-ink-muted">
        <span className="mb-1 block">Participants</span>
        <input
          type="number"
          min={1}
          max={experience.max_participants || undefined}
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          className={`w-20 ${INPUT_CLASSES}`}
        />
      </label>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Réservation…' : 'Réserver'}
      </Button>

      <Alert variant={feedback?.type === 'error' ? 'error' : 'success'} className="w-full">
        {feedback?.message}
      </Alert>
    </form>
  );
}

export default ExperienceDetails;
