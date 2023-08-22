import * as Sentry from '@sentry/react';
import {Integrations} from '@sentry/tracing';

import {getVersion} from 'utils';

const initialiseSentry = (sentryDSN, env) => {
  if (!sentryDSN) return;

  Sentry.init({
    dsn: sentryDSN,
    integrations: [new Integrations.BrowserTracing()],
    environment: env,
    tracesSampleRate: 1.0,
    release: getVersion(),
  });
};

export default initialiseSentry;
