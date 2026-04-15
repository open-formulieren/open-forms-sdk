import {afterEach, beforeAll} from 'vitest';

import mswWorker from '@/api-mocks/msw-worker';
import '@/styles.scss';

beforeAll(async () => {
  // set up HTTP mocks
  await mswWorker.start({
    onUnhandledRequest: 'error',
    quiet: true,
  });
});

afterEach(() => mswWorker.resetHandlers());
