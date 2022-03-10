import React, { lazy, Suspense } from 'react';

import { isAuthenticated } from '../../client/state/auth';

const Client = lazy(() => import('../templates/client/Client'));
const Auth = lazy(() => import('../templates/auth/Auth'));

function App() {
  return (
    <Suspense fallback={<div />}>
      {isAuthenticated() ? <Client /> : <Auth />}
    </Suspense>
  );
}

export default App;
