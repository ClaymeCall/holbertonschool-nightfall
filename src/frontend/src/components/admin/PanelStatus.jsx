import React from 'react';
import Alert from '../ui/Alert';
import Skeleton from '../ui/Skeleton';

// The states every admin panel shares besides its list: not signed in,
// loading, load error, and empty. `name` is the plural noun ("expériences").
function PanelStatus({
  token,
  loading,
  error,
  isEmpty,
  name,
  emptyText,
  skeletonCount,
  skeletonClass,
  skeletonGap = 'space-y-3',
}) {
  return (
    <>
      {!token && (
        <p className="text-sm text-ink-muted">Connectez-vous en administrateur pour voir les {name}.</p>
      )}

      {token && loading && (
        <div role="status" className={skeletonGap}>
          <span className="sr-only">Chargement des {name}…</span>
          {Array.from({ length: skeletonCount }, (_, index) => (
            <Skeleton key={index} className={skeletonClass} />
          ))}
        </div>
      )}

      {token && error && (
        <Alert variant="error">
          Impossible de charger les {name} : {error.message}
          {error.status === 401 && ' (jeton manquant ou expiré)'}
          {error.status === 403 && " (ce compte n'est pas administrateur)"}
        </Alert>
      )}

      {token && isEmpty && <p className="text-sm text-ink-muted">{emptyText}</p>}
    </>
  );
}

export default PanelStatus;
