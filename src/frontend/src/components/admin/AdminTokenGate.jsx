import React, { useState } from 'react';

/**
 * Lets an admin paste a JWT (minted via the API) to authenticate the
 * dashboard's requests. Stopgap until #33 (login page) and #20
 * (POST /auth/login) ship.
 */
function AdminTokenGate({ token, onSetToken, onClearToken }) {
  const [draft, setDraft] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (draft.trim()) {
      onSetToken(draft.trim());
      setDraft('');
    }
  }

  if (token) {
    return (
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-800 bg-gray-900/40 px-4 py-3">
        <p className="text-sm text-gray-300">
          Using a stored admin token.{' '}
          <span className="text-gray-500">
            (No login page yet &mdash; paste a fresh token here once it expires.)
          </span>
        </p>
        <button
          type="button"
          onClick={onClearToken}
          className="rounded-md border border-gray-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800"
        >
          Clear token
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-lg border border-gray-800 bg-gray-900/40 p-4"
      aria-labelledby="token-gate-heading"
    >
      <h2 id="token-gate-heading" className="mb-1 text-sm font-semibold text-white">
        Admin token required
      </h2>
      <p className="mb-3 text-sm text-gray-400">
        There is no login page yet, so paste an admin JWT (e.g. minted via{' '}
        <code className="font-mono text-gray-300">POST /api/users</code>&apos;s test tooling) to load
        users and their reservations.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="admin-token-input" className="sr-only">
          Admin JWT
        </label>
        <input
          id="admin-token-input"
          type="password"
          autoComplete="off"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Paste admin JWT"
          className="flex-1 rounded-md border border-gray-700 bg-deep-black px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-night-mauve focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-night-mauve px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Use token
        </button>
      </div>
    </form>
  );
}

export default AdminTokenGate;
