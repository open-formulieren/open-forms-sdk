import {createState} from 'state-pool';

import {post} from '@/api';

import type {Form} from './forms';

/**
 * @see `#/components/schemas/Submission` in the API spec.
 */
export interface SubmissionCreateBody {
  form: string;
  formUrl: string;
  anonymous?: boolean;
  initialDataReference?: string;
}

/**
 * @see `#/components/schemas/NestedSubmissionStep` in the API spec.
 */
export interface NestedSubmissionStep {
  id: string;
  name: string;
  url: string;
  formStep: string;
  isApplicable: boolean;
  completed: boolean;
  canSubmit: boolean;
}

/**
 * The shape of a submission as returned from a detail/create endpoint.
 *
 * @see `#/components/schemas/Submission` in the API spec.
 */
export interface Submission {
  id: string;
  url: string;
  form: string;
  steps: NestedSubmissionStep[];
  submissionAllowed: 'yes' | 'no_with_overview' | 'no_without_overview';
  isAuthenticated: boolean;
  payment: {
    isRequired: boolean;
    amount: null | string; // decimal serialized to string
    hasPaid: boolean;
  };
  formUrl: string;
  initialDataReference: string;
}

/**
 * Create a submission instance from a given form instance
 * @param baseUrl - The Open Forms backend baseUrl of the API (e.g. https://example.com/api/v2/)
 * @param form - The relevant Open Forms form instance.
 * @param formUrl - The client-side URL hosting the form entrypoint.
 * @param initialDataReference - The data reference provided by the external party.
 * @return - The Submission instance.
 */
export const createSubmission = async (
  baseUrl: string,
  form: Form,
  formUrl: string,
  signal: AbortSignal,
  initialDataReference: string,
  anonymous = false
): Promise<Submission> => {
  const createData: SubmissionCreateBody = {
    form: form.url,
    formUrl,
    anonymous,
    initialDataReference: initialDataReference ? initialDataReference : undefined,
  };
  const submissionResponse = await post<Submission>(`${baseUrl}submissions`, createData, signal);
  return submissionResponse.data!;
};

export interface GlobalSubmissionState {
  hasSubmission: boolean;
}

export const globalSubmissionState = createState<GlobalSubmissionState>({hasSubmission: false});

export const flagActiveSubmission = (): void => {
  globalSubmissionState.updateValue(state => {
    state.hasSubmission = true;
  });
};

export const flagNoActiveSubmission = (): void => {
  globalSubmissionState.updateValue(state => {
    state.hasSubmission = false;
  });
};
