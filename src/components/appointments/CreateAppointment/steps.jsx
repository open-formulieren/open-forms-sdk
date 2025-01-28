import {defineMessage} from 'react-intl';

export const APPOINTMENT_STEPS = [
  {
    path: 'producten',
    name: defineMessage({
      description: "Appointments navbar title for 'products' step",
      defaultMessage: 'Product',
    }),
  },
  {
    path: 'kalender',
    name: defineMessage({
      description: "Appointments navbar title for 'location and time' step",
      defaultMessage: 'Location and time',
    }),
  },
  {
    path: 'contactgegevens',
    name: defineMessage({
      description: "Appointments navbar title for 'contact details' step",
      defaultMessage: 'Contact details',
    }),
  },
];

export const APPOINTMENT_STEP_PATHS = APPOINTMENT_STEPS.map(s => s.path);
