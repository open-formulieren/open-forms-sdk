import {Navigate, Outlet, useMatch, useSearchParams} from 'react-router-dom';

import {Cosign} from 'components/CoSign';
import ErrorBoundary from 'components/Errors/ErrorBoundary';
import Form from 'components/Form';
import SessionExpired from 'components/Sessions/SessionExpired';
import {CreateAppointment} from 'components/appointments';
import useFormContext from 'hooks/useFormContext';
import useZodErrorMap from 'hooks/useZodErrorMap';
import {cosignRoutes, createAppointmentRoutes, formRoutes, manageAppointmentRoutes} from 'routes';

export const routes = [
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
];

/*
Top level router - routing between an actual form or supporting screens.
 */
const App = () => {
  const form = useFormContext();
  const [params] = useSearchParams();
  const appointmentMatch = useMatch('afspraak-maken/*');
  const appointmentCancelMatch = useMatch('afspraak-annuleren/*');
  const isSessionExpiryMatch = useMatch('sessie-verlopen');

  // register localized error messages in the default zod error map
  useZodErrorMap();

  const isAppointment = form.appointmentOptions?.isAppointment ?? false;
  if (isAppointment && !appointmentMatch && !appointmentCancelMatch && !isSessionExpiryMatch) {
    return (
      <Navigate
        replace
        to={{
          pathname: '../afspraak-maken',
          search: `?${params}`,
        }}
      />
    );
  }
  return <Outlet />;
};

App.propTypes = {};

export default App;
