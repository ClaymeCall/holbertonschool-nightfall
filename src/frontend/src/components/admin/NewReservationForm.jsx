import React, { useState } from 'react';
import { apiRequest } from '../../lib/api';
import useApiResource from '../../hooks/useApiResource';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import Field from '../ui/Field';

/** Creates a reservation for a given user. */
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
      setFeedback({ type: 'error', message: 'Choisissez une expérience, une date et une heure.' });
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
      setFeedback({ type: 'success', message: 'Réservation créée.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-xl border border-line bg-canvas/60 p-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="Expérience"
          as="select"
          value={experienceId}
          onChange={(e) => setExperienceId(e.target.value)}
        >
          <option value="">Choisir…</option>
          {(experiences || []).map((experience) => (
            <option key={experience.id} value={experience.id}>
              {experience.name}
            </option>
          ))}
        </Field>

        <Field
          label="Date et heure"
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />

        <Field
          label="Participants"
          type="number"
          min={1}
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
        />
      </div>

      <Button type="submit" className="mt-4 min-h-10" disabled={submitting}>
        {submitting ? 'Réservation…' : 'Réserver pour cet utilisateur'}
      </Button>

      {feedback && (
        <Alert variant={feedback.type} className="mt-3">
          {feedback.message}
        </Alert>
      )}
    </form>
  );
}

export default NewReservationForm;
