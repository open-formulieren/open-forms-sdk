import type {FormikErrors, FormikTouched} from 'formik';
import React from 'react';

import type {AppointmentProduct} from '@/data/appointments';
import type {Submission} from '@/data/submissions';

export interface AppointmentConfigContext {
  supportsMultipleProducts: boolean;
}

const AppointmentConfigContext = React.createContext<AppointmentConfigContext>({
  supportsMultipleProducts: true,
});
AppointmentConfigContext.displayName = 'AppointmentConfigContext';

export type AppoinmentStep = 'producten' | 'kalender' | 'contactgegevens';

/**
 * Information gathered per step to create an appointment.
 *
 * The keys are the slugs/identifiers of the individual steps.
 */
export interface AppointmentDataByStep {
  producten: {
    products: AppointmentProduct[];
  };
  kalender: {
    /**
     * Identifier of the location for the appointment.
     */
    location: string;
    /**
     * ISO-8601 formatted date.
     */
    date: string;
    /**
     * ISO-8601 formatted datetime - the date part must equal the `date` property.
     */
    datetime: string;
  };
  /**
   * The contact details from the dynamic backend Formio definitions - no fixed structure
   * is available.
   *
   * Only primitives are supported.
   *
   * @todo: the contactDetails key is new - incorporate it everywhere!
   */
  contactgegevens: {
    contactDetails: Record<string, string | number | boolean>;
  };
}

// create intersection of all the steps, which is the final state to submit to the
// backend
type AppointmentData = AppointmentDataByStep['producten'] &
  AppointmentDataByStep['kalender'] &
  AppointmentDataByStep['contactgegevens'];

export interface CreateAppointmentContextType<S extends AppoinmentStep = AppoinmentStep> {
  submission: Submission | null;
  appointmentData: Partial<AppointmentData>;
  stepData: Partial<AppointmentDataByStep[S]>;
  submittedSteps: AppoinmentStep[];
  submitStep: (values: AppointmentDataByStep[S]) => void;
  setErrors: (errors: {
    initialTouched: FormikTouched<AppointmentDataByStep[S]>;
    initialErrors: FormikErrors<AppointmentDataByStep[S]>;
  }) => void;
  stepErrors: {
    initialTouched: FormikTouched<AppointmentDataByStep[S]>;
    initialErrors: FormikErrors<AppointmentDataByStep[S]>;
  };
  clearStepErrors: () => void;
  reset: () => void;
}

const CreateAppointmentContext = React.createContext<CreateAppointmentContextType>({
  submission: null,
  appointmentData: {},
  stepData: {},
  submittedSteps: [],
  submitStep: () => {},
  setErrors: () => {},
  stepErrors: {initialTouched: {}, initialErrors: {}},
  clearStepErrors: () => {},
  reset: () => window.sessionStorage.clear(),
});
CreateAppointmentContext.displayName = 'CreateAppointmentContext';

export {AppointmentConfigContext, CreateAppointmentContext};
