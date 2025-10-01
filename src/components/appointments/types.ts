import type {AppointmentProduct} from '@/data/appointments';

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
