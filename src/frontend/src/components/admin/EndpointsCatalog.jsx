import React from 'react';
import { API_ENDPOINTS } from '../../data/apiEndpoints';

const METHOD_STYLES = {
  GET: 'bg-sky-900/60 text-sky-300',
  POST: 'bg-emerald-900/60 text-emerald-300',
  PUT: 'bg-amber-900/60 text-amber-300',
  PATCH: 'bg-amber-900/60 text-amber-300',
  DELETE: 'bg-blood-red/40 text-red-300',
};

function MethodBadge({ method }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-mono font-bold ${METHOD_STYLES[method] || 'bg-gray-800 text-gray-300'}`}
    >
      {method}
    </span>
  );
}

function StatusBadge({ status }) {
  const isImplemented = status === 'implemented';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isImplemented ? 'bg-emerald-900/60 text-emerald-300' : 'bg-gray-800 text-gray-400'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isImplemented ? 'bg-emerald-400' : 'bg-gray-500'}`}
        aria-hidden="true"
      />
      {isImplemented ? 'Implemented' : 'Planned'}
    </span>
  );
}

function EndpointsCatalog() {
  const implementedCount = API_ENDPOINTS.filter((e) => e.status === 'implemented').length;

  return (
    <section aria-labelledby="endpoints-heading" className="mb-10">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="endpoints-heading" className="text-xl font-bold text-white">
          API endpoints
        </h2>
        <p className="text-sm text-gray-400">
          {implementedCount} of {API_ENDPOINTS.length} implemented
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-gray-900/60 text-gray-400">
              <th scope="col" className="px-4 py-2 font-medium">
                Method
              </th>
              <th scope="col" className="px-4 py-2 font-medium">
                Path
              </th>
              <th scope="col" className="px-4 py-2 font-medium">
                Description
              </th>
              <th scope="col" className="px-4 py-2 font-medium">
                Access
              </th>
              <th scope="col" className="px-4 py-2 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {API_ENDPOINTS.map((endpoint) => (
              <tr
                key={`${endpoint.method} ${endpoint.path}`}
                className="border-t border-gray-800 align-top"
              >
                <td className="px-4 py-2">
                  <MethodBadge method={endpoint.method} />
                </td>
                <td className="px-4 py-2 font-mono text-gray-200">{endpoint.path}</td>
                <td className="px-4 py-2 text-gray-300">{endpoint.description}</td>
                <td className="px-4 py-2 text-gray-400">{endpoint.access}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={endpoint.status} />
                  {endpoint.issue && (
                    <span className="ml-2 text-xs text-gray-500">#{endpoint.issue}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default EndpointsCatalog;
