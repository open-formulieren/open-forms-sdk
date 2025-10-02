import {defineMessage} from 'react-intl';
import type {MessageDescriptor} from 'react-intl';

import type {AppoinmentStep} from '../types';

interface StepAndName {
  path: AppoinmentStep;
  name: MessageDescriptor;
}

export const APPOINTMENT_STEPS: StepAndName[] = [
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

export const APPOINTMENT_STEP_PATHS: AppoinmentStep[] = APPOINTMENT_STEPS.map(s => s.path);
