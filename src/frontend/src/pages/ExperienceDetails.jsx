import React from 'react';
import { Link, useParams } from 'react-router-dom';
import ReservationPanel from '../components/feature/ReservationPanel';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import { ClockIcon, UsersIcon } from '../components/ui/icons';
import Skeleton from '../components/ui/Skeleton';
import useApiResource from '../hooks/useApiResource';
import { CANCELLATION_WINDOW_HOURS } from '../lib/cancellation';
import { experienceImageUrl } from '../lib/format';
import { intensityLabel } from '../lib/intensity';
import { themeForExperience } from '../lib/themes';

const INTENSITY_LEVELS = 5;

function ExperienceDetails() {
  const { id } = useParams();
  const { data: experiences, loading, error } = useApiResource('/experiences');

  const experience = experiences?.find((item) => String(item.id) === id);

  return (
    <div className="min-h-screen bg-canvas" data-theme={themeForExperience(experience)}>
      <main className="mx-auto max-w-6xl px-6 py-10">
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
    <div role="status" className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <span className="sr-only">Chargement de l'expérience…</span>
      <div>
        <Skeleton className="min-h-[340px] rounded-2xl" />
        <Skeleton className="mt-5 h-20 rounded-2xl" />
        <Skeleton className="mt-6 h-4 w-11/12" />
        <Skeleton className="mt-3 h-4 w-10/12" />
        <Skeleton className="mt-3 h-4 w-8/12" />
      </div>
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
}

function Fact({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
      <Icon size={26} strokeWidth={1.8} className="flex-none text-highlight" />
      <div>
        <dt className="text-[11px] uppercase tracking-[0.2em] text-ink-muted">{label}</dt>
        <dd className="mt-0.5 text-lg font-bold text-ink">{children}</dd>
      </div>
    </div>
  );
}

function IntensityFact({ label, level }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <dt className="text-[11px] uppercase tracking-[0.2em] text-ink-muted">Intensité</dt>
      <dd className="mt-0.5 text-lg font-bold text-ink">
        {label}
        <span className="sr-only">
          {' '}
          (niveau {level} sur {INTENSITY_LEVELS})
        </span>
        <span aria-hidden="true" className="mt-3 flex gap-1.5">
          {Array.from({ length: INTENSITY_LEVELS }, (_, index) => (
            <span
              key={index}
              className={`h-2 flex-1 rounded-full ${index < level ? 'bg-accent' : 'bg-line'}`}
            />
          ))}
        </span>
      </dd>
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
  } = experience;

  const imageUrl = experienceImageUrl(image);
  const intensityText = intensityLabel(intensityLevel);

  return (
    <article className="mt-6 grid gap-8 motion-safe:animate-fade-up lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <div>
        <div
          className="relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-2xl border border-line bg-cover bg-center p-8"
          style={{
            backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
            backgroundColor: 'rgb(var(--color-canvas))',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgb(var(--color-accent)/0.35),transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/70 to-transparent" />

          {category && <Badge className="relative mb-3">{category}</Badge>}

          <h1 className="relative font-display text-5xl font-semibold leading-tight text-ink drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] sm:text-6xl">
            {name}
          </h1>
        </div>

        <dl className="mt-5 grid gap-4 sm:grid-cols-3">
          {duration ? (
            <Fact icon={ClockIcon} label="Durée">
              {duration} min
            </Fact>
          ) : null}
          {maxParticipants ? (
            <Fact icon={UsersIcon} label="Participants">
              {maxParticipants} maximum
            </Fact>
          ) : null}
          {intensityText ? <IntensityFact label={intensityText} level={Number(intensityLevel)} /> : null}
        </dl>

        {description && (
          <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-ink-muted">
            {description}
          </p>
        )}

        <p className="mt-6 flex items-center gap-3 text-sm text-ink">
          <span aria-hidden="true" className="h-1.5 w-1.5 flex-none rounded-full bg-accent" />
          Annulation possible jusqu'à {CANCELLATION_WINDOW_HOURS} heures avant l'expérience.
        </p>
      </div>

      <aside aria-label="Réserver cette expérience" className="lg:sticky lg:top-6">
        <ReservationPanel experience={experience} />
      </aside>
    </article>
  );
}

export default ExperienceDetails;
