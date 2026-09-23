import React, { useState } from 'react';
import useApiResource from '../../hooks/useApiResource';
import { apiRequest } from '../../lib/api';
import { INTENSITY_OPTIONS } from '../../lib/intensity';

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
    <form onSubmit={handleSubmit} className="mt-3 rounded-md border border-gray-800 bg-black/30 p-3">
      <div className="flex flex-wrap items-end gap-2">
        <label className="text-xs text-gray-400">
          <span className="mb-1 block">Name</span>
          <input
            type="text"
            required
            value={values.name}
            onChange={handleChange('name')}
            className="rounded border border-gray-700 bg-deep-black px-2 py-1.5 text-sm text-white focus:border-night-mauve focus:outline-none"
          />
        </label>

        <label className="text-xs text-gray-400">
          <span className="mb-1 block">Category</span>
          <input
            type="text"
            required
            value={values.category}
            onChange={handleChange('category')}
            className="rounded border border-gray-700 bg-deep-black px-2 py-1.5 text-sm text-white focus:border-night-mauve focus:outline-none"
          />
        </label>

        <label className="text-xs text-gray-400">
          <span className="mb-1 block">Intensity level</span>
          <select
            required
            value={values.intensity_level}
            onChange={handleChange('intensity_level')}
            className="rounded border border-gray-700 bg-deep-black px-2 py-1.5 text-sm text-white focus:border-night-mauve focus:outline-none"
          >
            <option value="" disabled>
              Select…
            </option>
            {INTENSITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs text-gray-400">
          <span className="mb-1 block">Duration (min)</span>
          <input
            type="number"
            min={1}
            required
            value={values.duration}
            onChange={handleChange('duration')}
            className="w-24 rounded border border-gray-700 bg-deep-black px-2 py-1.5 text-sm text-white focus:border-night-mauve focus:outline-none"
          />
        </label>

        <label className="text-xs text-gray-400">
          <span className="mb-1 block">Max participants</span>
          <input
            type="number"
            min={1}
            required
            value={values.max_participants}
            onChange={handleChange('max_participants')}
            className="w-24 rounded border border-gray-700 bg-deep-black px-2 py-1.5 text-sm text-white focus:border-night-mauve focus:outline-none"
          />
        </label>

        <label className="text-xs text-gray-400">
          <span className="mb-1 block">Price (€)</span>
          <input
            type="number"
            min={0}
            step="0.01"
            required
            value={values.price}
            onChange={handleChange('price')}
            className="w-24 rounded border border-gray-700 bg-deep-black px-2 py-1.5 text-sm text-white focus:border-night-mauve focus:outline-none"
          />
        </label>

        <label className="text-xs text-gray-400">
          <span className="mb-1 block">Image filename</span>
          <input
            type="text"
            value={values.image}
            onChange={handleChange('image')}
            className="rounded border border-gray-700 bg-deep-black px-2 py-1.5 text-sm text-white focus:border-night-mauve focus:outline-none"
          />
        </label>

        <label className="w-full text-xs text-gray-400">
          <span className="mb-1 block">Description</span>
          <textarea
            required
            rows={2}
            value={values.description}
            onChange={handleChange('description')}
            className="w-full rounded border border-gray-700 bg-deep-black px-2 py-1.5 text-sm text-white focus:border-night-mauve focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-night-mauve px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? submittingLabel : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-700 px-3 py-1.5 text-sm font-semibold text-gray-300 hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>

      {feedback && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          {feedback.message}
        </p>
      )}
    </form>
  );
}

function ExperiencesPanel({ token }) {
  const { data: experiences, loading, error, refetch } = useApiResource('/experiences', {
    token,
    enabled: Boolean(token),
  });
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [rowErrors, setRowErrors] = useState({});

  async function handleCreate(body) {
    await apiRequest('/experiences', { method: 'POST', token, body: JSON.stringify(body) });
    setCreating(false);
    refetch();
  }

  async function handleUpdate(id, body) {
    await apiRequest(`/experiences/${id}`, { method: 'PUT', token, body: JSON.stringify(body) });
    setEditingId(null);
    refetch();
  }

  async function handleDelete(experience) {
    if (!window.confirm(`Delete ${experience.name}? This cannot be undone.`)) {
      return;
    }

    setBusyId(experience.id);
    setRowErrors((prev) => ({ ...prev, [experience.id]: null }));
    try {
      await apiRequest(`/experiences/${experience.id}`, { method: 'DELETE', token });
      refetch();
    } catch (err) {
      setRowErrors((prev) => ({ ...prev, [experience.id]: err.message }));
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
    <section aria-labelledby="experiences-heading" className="mb-10">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 id="experiences-heading" className="text-xl font-bold text-white">
          Experiences
        </h2>
        {token && (
          <button
            type="button"
            onClick={() => setCreating((current) => !current)}
            className="rounded-md border border-gray-700 px-2.5 py-1 text-xs font-semibold text-gray-300 hover:bg-gray-800"
          >
            {creating ? 'Cancel' : 'New experience'}
          </button>
        )}
      </div>

      {!token && (
        <p className="text-sm text-gray-500">Provide an admin token above to load experiences.</p>
      )}

      {creating && (
        <ExperienceForm
          submitLabel="Create"
          submittingLabel="Creating…"
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
        />
      )}

      {token && loading && <p className="text-sm text-gray-400">Loading experiences…</p>}

      {token && error && (
        <p role="alert" className="text-sm text-red-400">
          Failed to load experiences: {error.message}
          {error.status === 401 && ' (token missing or expired)'}
          {error.status === 403 && ' (this token is not an admin account)'}
        </p>
      )}

      {token && experiences && experiences.length === 0 && (
        <p className="text-sm text-gray-400">No experiences yet.</p>
      )}

      {token && experiences && experiences.length > 0 && (
        <ul className="mt-3 space-y-4">
          {experiences.map((experience) => (
            <li key={experience.id} className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-white">{experience.name}</span>
                  {Boolean(experience.is_archived) && (
                    <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs font-semibold text-gray-400">
                      Archived
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {experience.category} · {experience.duration} min ·{' '}
                    {currencyFormatter.format(Number(experience.price))}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId((current) => (current === experience.id ? null : experience.id))}
                    className="rounded-md border border-gray-700 px-2.5 py-1 text-xs font-semibold text-gray-300 hover:bg-gray-800"
                  >
                    {editingId === experience.id ? 'Cancel' : 'Edit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleArchive(experience)}
                    disabled={busyId === experience.id}
                    className="rounded-md border border-gray-700 px-2.5 py-1 text-xs font-semibold text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                  >
                    {experience.is_archived ? 'Unarchive' : 'Archive'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(experience)}
                    disabled={busyId === experience.id}
                    className="rounded-md border border-blood-red/60 px-2.5 py-1 text-xs font-semibold text-red-300 hover:bg-blood-red/20 disabled:opacity-50"
                  >
                    {busyId === experience.id ? 'Working…' : 'Delete'}
                  </button>
                </div>
              </div>

              {rowErrors[experience.id] && (
                <p role="alert" className="mt-2 text-sm text-red-400">
                  {rowErrors[experience.id]}
                </p>
              )}

              {editingId === experience.id && (
                <ExperienceForm
                  initialValues={experienceToFormValues(experience)}
                  submitLabel="Save"
                  submittingLabel="Saving…"
                  onSubmit={(body) => handleUpdate(experience.id, body)}
                  onCancel={() => setEditingId(null)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ExperiencesPanel;
