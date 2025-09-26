import type {RouteObject} from 'react-router';

import App from '@/components/App';
import {Cosign} from '@/components/CoSign';
import ErrorBoundary from '@/components/Errors/ErrorBoundary';
import Form from '@/components/Form';
import SessionExpired from '@/components/Sessions/SessionExpired';

import appointmentRoutes from './appointments';
import cosignRoutes from './cosign';
import formRoutes from './form';

/**
 * Main app entrypoint routes.
 *
 * These routes are the top-level routes, dividing the SDK into distinct features/
 * chunks.
 */
const routes: RouteObject[] = [
  {
    path: '*',
    element: <App />,
    children: [
      {
        path: 'cosign/*',
        element: <Cosign />,
        children: cosignRoutes,
      },
      {
        path: 'sessie-verlopen',
        element: (
          <ErrorBoundary useCard>
            <SessionExpired />
          </ErrorBoundary>
        ),
      },
      // appointments splat
      {
        path: '*',
        children: appointmentRoutes,
      },
      // All the rest goes to the formio-based form flow
      {
        path: '*',
        element: (
          <ErrorBoundary useCard>
            <Form />
          </ErrorBoundary>
        ),
        children: formRoutes,
      },
    ],
  },
];

export default routes;
