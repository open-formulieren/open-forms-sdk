import {Navigate, Outlet, useMatch} from 'react-router-dom';

import {Cosign, cosignRoutes} from 'components/CoSign';
import ErrorBoundary from 'components/Errors/ErrorBoundary';
import Form from 'components/Form';
import SessionExpired from 'components/Sessions/SessionExpired';
import {
  CreateAppointment,
  appointmentRoutes,
  manageAppointmentRoutes,
} from 'components/appointments';
import formRoutes from 'components/formRoutes';
import useFormContext from 'hooks/useFormContext';
import useQuery from 'hooks/useQuery';
import useZodErrorMap from 'hooks/useZodErrorMap';

export const routes = [
  {
    path: 'afspraak-annuleren/*',
    children: manageAppointmentRoutes,
  },
  {
    path: 'afspraak-maken/*',
    element: <CreateAppointment />,
    children: appointmentRoutes,
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
  const query = useQuery();
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
          search: `?${query}`,
        }}
      />
    );
  }
  return <Outlet />;
};

App.propTypes = {};

export default App;
