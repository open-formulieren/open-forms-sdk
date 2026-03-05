import type {JSONObject} from '@open-formulieren/types';
import type {FormikErrors, FormikTouched} from 'formik';

import type {AppointmentProduct} from '@/data/appointments';

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
    contactDetails: JSONObject;
  };
}

export type AppoinmentStep = {[K in keyof AppointmentDataByStep]: K}[keyof AppointmentDataByStep];

// create intersection of all the steps, which is the final state to submit to the
// backend
export type AppointmentData = AppointmentDataByStep['producten'] &
  AppointmentDataByStep['kalender'] &
  AppointmentDataByStep['contactgegevens'];

/**
 * The Formik `initialTouched` and `initialErrors` data structures for all the possible
 * appointment data keys, with the correct deep structure.
 */
export interface AppointmentErrors {
  initialTouched: FormikTouched<AppointmentData>;
  initialErrors: FormikErrors<AppointmentData>;
}
