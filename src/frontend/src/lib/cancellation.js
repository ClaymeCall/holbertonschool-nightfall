export const CANCELLATION_WINDOW_HOURS = 48;

const HOUR_MS = 60 * 60 * 1000;

// Mirrors the backend rule: DELETE /api/reservations/:id refuses a cancellation
// made 48 hours or less before the start. Used only to explain and disable the
// button; the server always has the final say.
export function getCancellationInfo(dateTime, now = new Date()) {
  const start = new Date(dateTime);
  const msUntilStart = start.getTime() - now.getTime();
  const deadline = new Date(start.getTime() - CANCELLATION_WINDOW_HOURS * HOUR_MS);

  let state = 'open';
  if (msUntilStart <= 0) {
    state = 'past';
  } else if (msUntilStart <= CANCELLATION_WINDOW_HOURS * HOUR_MS) {
    state = 'closed';
  }

  return { state, deadline, msUntilStart };
}
