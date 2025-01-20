import ErrorBoundary from 'components/Errors/ErrorBoundary';
import Confirmation from 'components/appointments/CreateAppointment/Confirmation';
import Summary from 'components/appointments/CreateAppointment/Summary';
import {APPOINTMENT_STEPS, LandingPage} from 'components/appointments/CreateAppointment/steps';
import {CancelAppointment, CancelAppointmentSuccess} from 'components/appointments/cancel';

/**
 * Route subtree for appointment forms.
 */
const createAppointmentRoutes = [
  {
    path: '',
    element: <LandingPage />,
  },
  ...APPOINTMENT_STEPS.map(({path, element}) => ({path, element})),
  {
    path: 'overzicht',
    element: <Summary />,
  },
  {
    path: 'bevestiging',
    element: <Confirmation />,
  },
];

const manageAppointmentRoutes = [
  {
    path: '',
    element: (
      <ErrorBoundary>
        <CancelAppointment />
      </ErrorBoundary>
    ),
  },
  {
    path: 'succes',
    element: <CancelAppointmentSuccess />,
  },
];

export {createAppointmentRoutes, manageAppointmentRoutes};
