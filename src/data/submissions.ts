import type {AnyComponentSchema} from '@open-formulieren/types';
import type {JSONValue} from '@open-formulieren/types/lib/types';
import {createState} from 'state-pool';

import {get, post} from '@/api';

import type {Form, SubmissionStatementConfiguration} from './forms';

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
  payment:
    | {
        isRequired: false;
        amount: null;
        hasPaid: false;
      }
    | {
        isRequired: true;
        amount: string; // decimal serialized to string
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
  signal: AbortSignal | null,
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

/**
 * The shape of the component summary data for a single component.
 *
 * @see `#/components/schemas/SubmissionComponentSummary` in the API spec.
 */
export interface ComponentSummary {
  /**
   * Display name of the component, usually the label.
   */
  name: string;
  /**
   * Raw value of the component.
   */
  value: JSONValue;
  /**
   * The component definition for which the value is paired.
   */
  component: AnyComponentSchema;
}

/**
 * The shape of the submission step summary data, for a single step.
 *
 * @see `#/components/schemas/SubmissionStepSummary` in the API spec.
 */
export interface StepSummaryData {
  /**
   * Slug of the form definition used in the form step.
   */
  slug: string;
  /**
   * Name of the form definition used in the form step.
   */
  name: string;
  /**
   * Array of components and their values in the form step.
   */
  data: ComponentSummary[];
}

export const loadSummaryData = async (
  baseUrl: string,
  submissionId: string
): Promise<StepSummaryData[]> => {
  const endpoint = `${baseUrl}submissions/${submissionId}/summary`;
  const result = await get<StepSummaryData[]>(endpoint);
  return result!;
};

/**
 * The shape of the submission step summary data, for a single step.
 *
 * @see `#/components/schemas/SubmissionCompletion` in the API spec.
 */
type SubmissionCompleteBody = Partial<Record<SubmissionStatementConfiguration['key'], boolean>>;

/**
 * The shape of the submission step summary data, for a single step.
 *
 * @see `#/components/schemas/SubmissionCompletion` in the API spec.
 */
interface SubmissionCompleteResponseData extends SubmissionCompleteBody {
  /**
   * The endpoint to poll to get the background processing status.
   */
  statusUrl: string;
}

export const completeSubmission = async (
  baseUrl: string,
  submissionId: string,
  statementValues: SubmissionCompleteBody
): Promise<SubmissionCompleteResponseData> => {
  const endpoint = `${baseUrl}submissions/${submissionId}/_complete`;
  const result = await post<SubmissionCompleteResponseData, SubmissionCompleteBody>(
    endpoint,
    statementValues
  );
  return result.data!;
};

export type CosignConfirmBody = Record<SubmissionStatementConfiguration['key'], boolean>;

interface CosignResponseData {
  reportDownloadUrl: string;
}

export const confirmCosign = async (
  baseUrl: string,
  submissionId: string,
  statementValues: CosignConfirmBody
): Promise<CosignResponseData> => {
  const endpoint = `${baseUrl}submissions/${submissionId}/cosign`;
  const result = await post<CosignResponseData, CosignConfirmBody>(endpoint, statementValues);
  return result.data!;
};
