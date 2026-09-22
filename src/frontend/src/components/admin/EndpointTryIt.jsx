import React, { useMemo, useState } from 'react';
import { rawRequest } from '../../lib/api';

const BODY_METHODS = new Set(['POST', 'PUT', 'PATCH']);

function extractParamNames(path) {
  return [...path.matchAll(/:([a-zA-Z_][a-zA-Z0-9_]*)/g)].map((match) => match[1]);
}

function resolvePath(path, paramValues) {
  return path.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (_match, name) =>
    encodeURIComponent(paramValues[name] ?? '')
  );
}

function resultTone(result) {
  if (!result) return '';
  if (!result.ok) {
    return result.status >= 500 ? 'text-red-400' : 'text-amber-400';
  }
  return 'text-emerald-400';
}

function EndpointTryIt({ endpoint, token }) {
  const paramNames = useMemo(() => extractParamNames(endpoint.path), [endpoint.path]);
  const [paramValues, setParamValues] = useState({});
  const [bodyText, setBodyText] = useState(
    endpoint.bodyExample ? JSON.stringify(endpoint.bodyExample, null, 2) : ''
  );
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState(null);
  const [result, setResult] = useState(null);

  const hasBody = BODY_METHODS.has(endpoint.method);
  const resolvedPath = resolvePath(endpoint.path.replace(/^\/api/, ''), paramValues);

  async function handleSend() {
    setFormError(null);

    for (const name of paramNames) {
      if (!paramValues[name]) {
        setFormError(`"${name}" is required`);
        return;
      }
    }

    let parsedBody;
    if (hasBody && bodyText.trim()) {
      try {
        parsedBody = JSON.parse(bodyText);
      } catch {
        setFormError('Request body is not valid JSON');
        return;
      }
    }

    setSending(true);
    setResult(null);
    try {
      const res = await rawRequest(resolvedPath, {
        method: endpoint.method,
        token: endpoint.auth ? token : undefined,
        body: parsedBody !== undefined ? JSON.stringify(parsedBody) : undefined,
      });
      setResult(res);
    } catch (err) {
      setResult({ networkError: `${err.name || 'Error'}: ${err.message}` });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-2 rounded-md border border-gray-800 bg-black/30 p-3">
      {paramNames.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {paramNames.map((name) => (
            <label key={name} className="text-xs text-gray-400">
              <span className="mb-1 block font-mono">{name}</span>
              <input
                type="text"
                value={paramValues[name] || ''}
                onChange={(e) =>
                  setParamValues((prev) => ({ ...prev, [name]: e.target.value }))
                }
                className="w-28 rounded border border-gray-700 bg-deep-black px-2 py-1 text-sm text-white focus:border-night-mauve focus:outline-none"
              />
            </label>
          ))}
        </div>
      )}

      {hasBody && (
        <label className="mb-2 block text-xs text-gray-400">
          <span className="mb-1 block">Request body (JSON)</span>
          <textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            rows={Math.min(8, Math.max(3, bodyText.split('\n').length))}
            spellCheck={false}
            className="w-full rounded border border-gray-700 bg-deep-black px-2 py-1.5 font-mono text-sm text-white focus:border-night-mauve focus:outline-none"
          />
        </label>
      )}

      {endpoint.auth && !token && (
        <p className="mb-2 text-xs text-amber-400">
          No admin token set — this request will likely come back 401.
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSend}
          disabled={sending}
          className="rounded-md bg-night-mauve px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {sending ? 'Sending…' : 'Send'}
        </button>
        <span className="font-mono text-xs text-gray-500">
          {endpoint.method} {resolvedPath || '/'}
        </span>
      </div>

      {formError && (
        <p role="alert" className="mt-2 text-sm text-red-400">
          {formError}
        </p>
      )}

      {result && (
        <div className="mt-3">
          {result.networkError ? (
            <p role="alert" className="text-sm text-red-400">
              Network error: {result.networkError}
            </p>
          ) : (
            <>
              <p className={`mb-1 text-sm font-semibold ${resultTone(result)}`}>
                Status: {result.status}
              </p>
              <pre className="max-h-64 overflow-auto rounded bg-black/50 p-2 text-xs text-gray-300">
                {result.bodyIsUnparseable
                  ? '(non-JSON response)'
                  : result.body === null
                    ? '(empty response)'
                    : JSON.stringify(result.body, null, 2)}
              </pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default EndpointTryIt;
