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
    hydrateFallbackElement: <></>,
  },
  {
    path: 'producten',
    lazy: async () => {
      const {ChooseProductStep} = await import('@/components/appointments');
      return {element: <ChooseProductStep navigateTo="../kalender" />};
    },
    hydrateFallbackElement: <></>,
  },
  {
    path: 'kalender',
    lazy: async () => {
      const {LocationAndTimeStep} = await import('@/components/appointments');
      return {element: <LocationAndTimeStep navigateTo="../contactgegevens" />};
    },
    hydrateFallbackElement: <></>,
  },
  {
    path: 'contactgegevens',
    lazy: async () => {
      const {ContactDetailsStep} = await import('@/components/appointments');
      return {element: <ContactDetailsStep navigateTo="../overzicht" />};
    },
    hydrateFallbackElement: <></>,
  },
  {
    path: 'overzicht',
    lazy: async () => {
      const {Summary} = await import('@/components/appointments');
      return {element: <Summary />};
    },
    hydrateFallbackElement: <></>,
  },
  {
    path: 'bevestiging',
    lazy: async () => {
      const {Confirmation} = await import('@/components/appointments');
      return {element: <Confirmation />};
    },
    hydrateFallbackElement: <></>,
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
    hydrateFallbackElement: <></>,
  },
  {
    path: 'succes',
    lazy: async () => {
      const {CancelAppointmentSuccess} = await import('@/components/appointments');
      return {element: <CancelAppointmentSuccess />};
    },
    hydrateFallbackElement: <></>,
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
        hydrateFallbackElement: <></>,
      },
    ],
  },
];

export default appointmentRoutes;
