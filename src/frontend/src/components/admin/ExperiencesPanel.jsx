import React, { useState } from 'react';
import useApiResource from '../../hooks/useApiResource';
import { apiRequest } from '../../lib/api';
import { INTENSITY_OPTIONS } from '../../lib/intensity';
import { themeForExperience } from '../../lib/themes';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import Field from '../ui/Field';
import Skeleton from '../ui/Skeleton';
import { useToast } from '../ui/ToastProvider';
import ConfirmDelete, { focusLater } from './ConfirmDelete';

const currencyFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

const BLANK_FORM = {
  name: '',
  description: '',
  image: '',
  category: '',
  duration: '',
  intensity_level: '',
  max_participants: '',
  price: '',
};

function experienceToFormValues(experience) {
  return {
    name: experience.name,
    description: experience.description,
    image: experience.image || '',
    category: experience.category,
    duration: experience.duration,
    intensity_level: experience.intensity_level,
    max_participants: experience.max_participants,
    price: experience.price,
  };
}

function ExperienceForm({ initialValues, submitLabel, submittingLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialValues || BLANK_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  function handleChange(field) {
    return (event) => setValues((prev) => ({ ...prev, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      await onSubmit({
        name: values.name,
        description: values.description,
        image: values.image || undefined,
        category: values.category,
        duration: Number(values.duration),
        intensity_level: Number(values.intensity_level),
        max_participants: Number(values.max_participants),
        price: Number(values.price),
      });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-xl border border-line bg-canvas/60 p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Nom" type="text" required value={values.name} onChange={handleChange('name')} />
        <Field label="Catégorie" type="text" required value={values.category} onChange={handleChange('category')} />
        <Field
          label="Intensité"
          as="select"
          required
          value={values.intensity_level}
          onChange={handleChange('intensity_level')}
        >
          <option value="" disabled>
            Choisir…
          </option>
          {INTENSITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Field>
        <Field
          label="Durée (min)"
          type="number"
          min={1}
          required
          value={values.duration}
          onChange={handleChange('duration')}
        />
        <Field
          label="Participants max."
          type="number"
          min={1}
          required
          value={values.max_participants}
          onChange={handleChange('max_participants')}
        />
        <Field
          label="Prix (€)"
          type="number"
          min={0}
          step="0.01"
          required
          value={values.price}
          onChange={handleChange('price')}
        />
        <Field
          label="Nom du fichier image"
          type="text"
          value={values.image}
          onChange={handleChange('image')}
        />
        <Field
          label="Description"
          as="textarea"
          rows={3}
          required
          wrapperClassName="sm:col-span-2 lg:col-span-3"
          value={values.description}
          onChange={handleChange('description')}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="submit" className="min-h-10" disabled={submitting}>
          {submitting ? submittingLabel : submitLabel}
        </Button>
        <Button variant="ghost" className="min-h-10" onClick={onCancel}>
          Annuler
        </Button>
      </div>

      {feedback && (
        <Alert variant="error" className="mt-3">
          {feedback.message}
        </Alert>
      )}
    </form>
  );
}

function ExperiencesPanel({ token }) {
  const { data: experiences, loading, error, refetch } = useApiResource('/experiences', {
    token,
    enabled: Boolean(token),
  });
  const { notify } = useToast();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [rowErrors, setRowErrors] = useState({});

  async function handleCreate(body) {
    await apiRequest('/experiences', { method: 'POST', token, body: JSON.stringify(body) });
    setCreating(false);
    notify({ variant: 'success', title: 'Expérience créée', message: body.name });
    refetch();
  }

  async function handleUpdate(id, body) {
    await apiRequest(`/experiences/${id}`, { method: 'PUT', token, body: JSON.stringify(body) });
    setEditingId(null);
    notify({ variant: 'success', title: 'Expérience modifiée', message: body.name });
    refetch();
  }

  function cancelDelete(experience) {
    setConfirmingId(null);
    focusLater(`delete-experience-${experience.id}`);
  }

  async function handleDelete(experience) {
    setBusyId(experience.id);
    setRowErrors((prev) => ({ ...prev, [experience.id]: null }));
    try {
      await apiRequest(`/experiences/${experience.id}`, { method: 'DELETE', token });
      notify({ variant: 'success', title: 'Expérience supprimée', message: experience.name });
      setConfirmingId(null);
      refetch();
    } catch (err) {
      setRowErrors((prev) => ({ ...prev, [experience.id]: err.message }));
      cancelDelete(experience);
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggleArchive(experience) {
    setBusyId(experience.id);
    setRowErrors((prev) => ({ ...prev, [experience.id]: null }));
    try {
      await apiRequest(`/experiences/${experience.id}/toggle-archive`, { method: 'PATCH', token });
      refetch();
    } catch (err) {
      setRowErrors((prev) => ({ ...prev, [experience.id]: err.message }));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section aria-labelledby="experiences-heading" className="mb-12">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 id="experiences-heading" className="font-display text-3xl text-ink">
          Expériences
        </h2>
        {token && (
          <Button className="min-h-10" onClick={() => setCreating((current) => !current)}>
            {creating ? 'Annuler' : 'Nouvelle expérience'}
          </Button>
        )}
      </div>

      {!token && (
        <p className="text-sm text-ink-muted">Connectez-vous en administrateur pour voir les expériences.</p>
      )}

      {creating && (
        <ExperienceForm
          submitLabel="Créer"
          submittingLabel="Création…"
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
        />
      )}

      {token && loading && (
        <div role="status" className="space-y-3">
          <span className="sr-only">Chargement des expériences…</span>
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      )}

      {token && error && (
        <Alert variant="error">
          Impossible de charger les expériences : {error.message}
          {error.status === 401 && ' (jeton manquant ou expiré)'}
          {error.status === 403 && " (ce compte n'est pas administrateur)"}
        </Alert>
      )}

      {token && experiences && experiences.length === 0 && (
        <p className="text-sm text-ink-muted">Aucune expérience pour le moment.</p>
      )}

      {token && experiences && experiences.length > 0 && (
        <ul className="mt-4 space-y-3">
          {experiences.map((experience) => {
            const confirming = confirmingId === experience.id;

            return (
              <li
                key={experience.id}
                data-theme={themeForExperience(experience)}
                className={`rounded-xl border border-l-4 border-l-accent bg-surface p-4 ${
                  confirming ? 'border-red-400/60' : 'border-line'
                }`}
              >
                {confirming ? (
                  <ConfirmDelete
                    title={`Supprimer « ${experience.name} » ?`}
                    detail="Action définitive. Les réservations liées seront supprimées aussi."
                    busy={busyId === experience.id}
                    onCancel={() => cancelDelete(experience)}
                    onConfirm={() => handleDelete(experience)}
                  />
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg text-ink">{experience.name}</span>
                        {Boolean(experience.is_archived) && (
                          <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] uppercase tracking-widest text-ink-muted">
                            Archivée
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-ink-muted">
                        {experience.category} · {experience.duration} min ·{' '}
                        {currencyFormatter.format(Number(experience.price))}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="ghost"
                        className="min-h-10"
                        onClick={() =>
                          setEditingId((current) => (current === experience.id ? null : experience.id))
                        }
                      >
                        {editingId === experience.id ? 'Annuler' : 'Modifier'}
                      </Button>
                      <Button
                        variant="ghost"
                        className="min-h-10"
                        onClick={() => handleToggleArchive(experience)}
                        disabled={busyId === experience.id}
                      >
                        {experience.is_archived ? 'Désarchiver' : 'Archiver'}
                      </Button>
                      <Button
                        id={`delete-experience-${experience.id}`}
                        variant="danger"
                        className="min-h-10"
                        onClick={() => {
                          setEditingId(null);
                          setConfirmingId(experience.id);
                        }}
                        disabled={busyId === experience.id}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                )}

                {rowErrors[experience.id] && (
                  <Alert variant="error" className="mt-3">
                    {rowErrors[experience.id]}
                  </Alert>
                )}

                {editingId === experience.id && !confirming && (
                  <ExperienceForm
                    initialValues={experienceToFormValues(experience)}
                    submitLabel="Enregistrer"
                    submittingLabel="Enregistrement…"
                    onSubmit={(body) => handleUpdate(experience.id, body)}
                    onCancel={() => setEditingId(null)}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default ExperiencesPanel;
