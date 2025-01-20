import {defineMessage} from 'react-intl';
import {Navigate, useSearchParams} from 'react-router-dom';

import {ChooseProductStep, ContactDetailsStep, LocationAndTimeStep} from '../steps';

export const APPOINTMENT_STEPS = [
  {
    path: 'producten',
    element: <ChooseProductStep navigateTo="../kalender" />,
    name: defineMessage({
      description: "Appointments navbar title for 'products' step",
      defaultMessage: 'Product',
    }),
  },
  {
    path: 'kalender',
    element: <LocationAndTimeStep navigateTo="../contactgegevens" />,
    name: defineMessage({
      description: "Appointments navbar title for 'location and time' step",
      defaultMessage: 'Location and time',
    }),
  },
  {
    path: 'contactgegevens',
    element: <ContactDetailsStep navigateTo="../overzicht" />,
    name: defineMessage({
      description: "Appointments navbar title for 'contact details' step",
      defaultMessage: 'Contact details',
    }),
  },
];

export const APPOINTMENT_STEP_PATHS = APPOINTMENT_STEPS.map(s => s.path);

export const LandingPage = () => {
  const [params] = useSearchParams();
  return (
    <Navigate
      replace
      to={{
        pathname: APPOINTMENT_STEP_PATHS[0],
        search: `?${params}`,
      }}
    />
  );
};
