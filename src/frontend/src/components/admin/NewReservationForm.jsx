import React, { useState } from 'react';
import { apiRequest } from '../../lib/api';
import useApiResource from '../../hooks/useApiResource';

/**
 * Creates a reservation for a given user. POST /api/reservations doesn't
 * exist yet (issue #26, owned by a teammate) — this form is wired to the
 * endpoint as designed so it starts working the moment that route ships;
 * until then it surfaces the real "not implemented" response.
 */
function NewReservationForm({ user, token }) {
  const { data: experiences } = useApiResource('/experiences');
  const [experienceId, setExperienceId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [participants, setParticipants] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!experienceId || !dateTime) {
      setFeedback({ type: 'error', message: 'Pick an experience and a date/time.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      await apiRequest('/reservations', {
        method: 'POST',
        token,
        body: JSON.stringify({
          user_id: user.id,
          experience_id: Number(experienceId),
          date_time: new Date(dateTime).toISOString(),
          participants: Number(participants),
        }),
      });
      setFeedback({ type: 'success', message: 'Reservation created.' });
    } catch (err) {
      const message =
        err.status === 404
          ? 'POST /api/reservations is not implemented yet (see issue #26).'
          : err.message;
      setFeedback({ type: 'error', message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 rounded-md border border-gray-800 bg-black/30 p-3">
      <div className="flex flex-wrap items-end gap-2">
        <label className="text-xs text-gray-400">
          <span className="mb-1 block">Experience</span>
          <select
            value={experienceId}
            onChange={(e) => setExperienceId(e.target.value)}
            className="rounded border border-gray-700 bg-deep-black px-2 py-1.5 text-sm text-white focus:border-night-mauve focus:outline-none"
          >
            <option className="bg-deep-black text-white" value="">
              Select…
            </option>
            {(experiences || []).map((experience) => (
              <option className="bg-deep-black text-white" key={experience.id} value={experience.id}>
                {experience.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs text-gray-400">
          <span className="mb-1 block">Date &amp; time</span>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="rounded border border-gray-700 bg-deep-black px-2 py-1.5 text-sm text-white focus:border-night-mauve focus:outline-none"
          />
        </label>

        <label className="text-xs text-gray-400">
          <span className="mb-1 block">Participants</span>
          <input
            type="number"
            min={1}
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            className="w-20 rounded border border-gray-700 bg-deep-black px-2 py-1.5 text-sm text-white focus:border-night-mauve focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-night-mauve px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Booking…' : 'Book for this user'}
        </button>
      </div>

      {feedback && (
        <p
          role={feedback.type === 'error' ? 'alert' : 'status'}
          className={`mt-2 text-sm ${feedback.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}
        >
          {feedback.message}
        </p>
      )}
    </form>
  );
}

export default NewReservationForm;
