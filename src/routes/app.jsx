import App from 'components/App';
import {Cosign} from 'components/CoSign';
import ErrorBoundary from 'components/Errors/ErrorBoundary';
import Form from 'components/Form';
import SessionExpired from 'components/Sessions/SessionExpired';
import {CreateAppointment} from 'components/appointments';

import {createAppointmentRoutes, manageAppointmentRoutes} from './appointments';
import cosignRoutes from './cosign';
import formRoutes from './form';

/**
 * Main app entrypoint routes.
 *
 * These routes are the top-level routes, dividing the SDK into distinct features/
 * chunks.
 *
 * @todo - soon-ish we can use dynamic loading to split up the bundle for lazy loading
 * and reduce the initial load time.
 */
const routes = [
  {
    path: '*',
    element: <App />,
    children: [
      {
        path: 'afspraak-annuleren/*',
        children: manageAppointmentRoutes,
      },
      {
        path: 'afspraak-maken/*',
        element: <CreateAppointment />,
        children: createAppointmentRoutes,
      },
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
