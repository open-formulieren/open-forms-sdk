import type {JSONObject} from '@open-formulieren/types/lib/types';

import {post} from '@/api';

import type {SubmissionStatementConfiguration} from './forms';
import type {Submission} from './submissions';

/**
 * @see `#/components/schemas/AppointmentProduct` in the API spec.
 */
export interface Product {
  code: string;
  identifier: string;
  name: string;
}

/**
 * @see `#/components/schemas/Location` in the API spec.
 */
export interface Location {
  identifier: string;
  name: string;
}

/**
 * @see `#/components/schemas/Date` in the API spec.
 */
export interface AppointmentDate {
  /**
   * Date string in ISO-8601 format, date only without time information.
   */
  date: string;
}

/**
 * @see `#/components/schemas/Time` in the API spec.
 */
export interface AppointmentTime {
  /**
   * Datetime string in ISO-8601 format.
   */
  time: string;
}

/**
 * @see `#/components/schemas/_AppointmentProduct` in the API spec.
 */
export interface AppointmentProduct {
  /**
   * Identifier of the selected product.
   */
  productId: string;
  amount: number;
}

type StatementValues = Partial<Record<SubmissionStatementConfiguration['key'], boolean>>;

/**
 * The shape of the appointment (creation) data.
 *
 * @see `#/components/schemas/Appointment` in the API spec.
 *
 * @todo statementOfTruthAccepted is missing in the backend API.
 */
interface AppointmentBase {
  submission: string;
  products: AppointmentProduct[];
  location: string;
  date: string;
  datetime: string;
  contactDetails: JSONObject;
}

export type AppointmentCreateBody = AppointmentBase & StatementValues;

export interface Appointment extends AppointmentBase {
  statusUrl: string;
}

export const createAppointment = async (
  baseUrl: string,
  submission: Submission,
  products: AppointmentProduct[],
  location: string,
  date: string,
  datetime: string,
  contactDetails: JSONObject,
  statementValues: StatementValues
): Promise<Appointment> => {
  const response = await post<Appointment, AppointmentCreateBody>(
    `${baseUrl}appointments/appointments`,
    {
      submission: submission.url,
      products,
      location,
      date,
      datetime,
      contactDetails,
      ...statementValues,
    }
  );
  return response.data!;
};

/**
 * Request body shape for appointment cancellation.
 *
 * @see `#/components/schemas/CancelAppointmentInput` in the API spec.
 *
 */
interface AppointmentCancelBody {
  email: string;
}

export const cancelAppointment = async (
  baseUrl: string,
  submissionId: string,
  email: string
): Promise<void> => {
  const endpoint = `${baseUrl}appointments/${submissionId}/cancel`;
  await post<null, AppointmentCancelBody>(endpoint, {email});
};
