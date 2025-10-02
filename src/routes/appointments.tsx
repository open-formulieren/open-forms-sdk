import {type RouteObject, redirect} from 'react-router';

import ErrorBoundary from '@/components/Errors/ErrorBoundary';

/**
 * Route subtree for appointment forms.
 */
const createAppointmentRoutes: RouteObject[] = [
  {
    index: true,
    loader: ({request}) => {
      const url = new URL(request.url);
      return redirect(`producten${url.search}`);
    },
  },
  {
    path: 'producten',
    lazy: async () => {
      const {ChooseProductStep} = await import('@/components/appointments');
      return {element: <ChooseProductStep navigateTo="../kalender" />};
    },
  },
  {
    path: 'kalender',
    lazy: async () => {
      const {LocationAndTimeStep} = await import('@/components/appointments');
      return {element: <LocationAndTimeStep navigateTo="../contactgegevens" />};
    },
  },
  {
    path: 'contactgegevens',
    lazy: async () => {
      const {ContactDetailsStep} = await import('@/components/appointments');
      return {element: <ContactDetailsStep navigateTo="../overzicht" />};
    },
  },
  {
    path: 'overzicht',
    lazy: async () => {
      const {Summary} = await import('@/components/appointments');
      return {element: <Summary />};
    },
  },
  {
    path: 'bevestiging',
    lazy: async () => {
      const {Confirmation} = await import('@/components/appointments');
      return {element: <Confirmation />};
    },
  },
];

const manageAppointmentRoutes = [
  {
    path: '',
    lazy: async () => {
      const {CancelAppointment} = await import('@/components/appointments');
      return {
        element: (
          <ErrorBoundary>
            <CancelAppointment />
          </ErrorBoundary>
        ),
      };
    },
  },
  {
    path: 'succes',
    lazy: async () => {
      const {CancelAppointmentSuccess} = await import('@/components/appointments');
      return {element: <CancelAppointmentSuccess />};
    },
  },
];

const appointmentRoutes = [
  {
    path: 'afspraak-annuleren',
    children: [
      {
        path: '*',
        children: manageAppointmentRoutes,
      },
    ],
  },
  {
    path: 'afspraak-maken',
    children: [
      {
        path: '*',
        children: createAppointmentRoutes,
        lazy: async () => {
          const {CreateAppointment} = await import('@/components/appointments');
          return {element: <CreateAppointment />};
        },
      },
    ],
  },
];

export default appointmentRoutes;
