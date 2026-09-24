import React, { useEffect } from 'react';
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
import { ambianceForExperience, themeForExperience } from '../lib/themes';
import { useSiteTheme } from '../context/SiteThemeContext';

const INTENSITY_LEVELS = 5;

function ExperienceDetails() {
  const { id } = useParams();
  const { data: experiences, loading, error } = useApiResource('/experiences');

  const experience = experiences?.find((item) => String(item.id) === id);
  const setSiteTheme = useSiteTheme();
  const theme = themeForExperience(experience);
  useEffect(() => {
    setSiteTheme(theme ?? null);
    return () => setSiteTheme(null);
  }, [theme, setSiteTheme]);

  return (
    <div className="experience-detail min-h-screen bg-canvas" data-theme={theme}>
      <main id="main-content" className="site-container py-10">
        <Link to="/#experiences" className="back-link text-sm text-ink-muted hover:text-ink">
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
  const ambiance = ambianceForExperience(experience);

  return (
    <article className="detail-article mt-6 grid gap-8 motion-safe:animate-fade-up lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <div>
        <div
          className="detail-poster relative flex min-h-[480px] flex-col justify-end overflow-hidden border border-line bg-cover bg-center p-8"
          style={{
            backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
            backgroundColor: 'rgb(var(--color-canvas))',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgb(var(--color-accent)/0.35),transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/20 to-transparent" />
          <p className="detail-status"><span className="signal-dot" />{ambiance.label}<span>{ambiance.code}</span></p>

          {category && <Badge className="relative mb-3">{category}</Badge>}
          <p className="relative mb-3 text-sm uppercase tracking-widest text-highlight">{ambiance.tagline}</p>

          <h1 className="detail-title relative text-ink">
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

        <section className="detail-story" aria-labelledby="mission-title"><p className="eyebrow">Votre mission</p><h2 id="mission-title">{ambiance.mission}</h2>{description && <p className="whitespace-pre-line">{description}</p>}<blockquote>{ambiance.atmosphere}</blockquote></section>

        <p className="mt-6 flex items-center gap-3 text-sm text-ink">
          <span aria-hidden="true" className="h-1.5 w-1.5 flex-none rounded-full bg-accent" />
          Annulation possible plus de {CANCELLATION_WINDOW_HOURS} heures avant l'expérience.
        </p>
      </div>

      <aside aria-label="Réserver cette expérience" className="lg:sticky lg:top-28">
        <ReservationPanel key={experience.id} experience={experience} />
      </aside>
    </article>
  );
}

export default ExperienceDetails;
