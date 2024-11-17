import ErrorBoundary from 'components/Errors/ErrorBoundary';

import {CancelAppointment, CancelAppointmentSuccess} from '../cancel';

export const routes = [
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
