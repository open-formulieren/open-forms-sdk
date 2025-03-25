import * as Sentry from '@sentry/react';

import {getVersion} from '@/utils';

const initialiseSentry = (sentryDSN: string, env: string): void => {
  if (!sentryDSN) return;

  Sentry.init({
    dsn: sentryDSN,
    integrations: [],
    environment: env,
    release: getVersion(),
  });
};

export default initialiseSentry;
