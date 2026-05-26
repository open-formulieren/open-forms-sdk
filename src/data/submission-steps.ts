import type {JSONObject} from '@open-formulieren/types';

import {post, put} from '@/api';
import {type InvalidParam, ValidationError} from '@/errors';

import type {FormioConfiguration} from './formio';
import type {LogicRule} from './logic';
import type {Submission} from './submissions';

/**
 * @see `#/components/schemas/SubmissionStep` in the API spec.
 */
export interface SubmissionStep {
  readonly id: string;
  /**
   * UUID of the associated form step.
   */
  readonly formStepUuid: string;
  readonly slug: string;
  /**
   * The Formio configuration with the definitions of the fields to render for the
   * end user.
   *
   * The side-effects of backend logic rule evaluation are applied here. For the variant
   * without side-effects applied, see `defaultConfiguration`.
   */
  readonly configuration: FormioConfiguration;
  /**
   * The 'initial' formio configuration of the step *before* server-side logic rule
   * mutations are applied.
   */
  readonly defaultConfiguration: FormioConfiguration | null;
  /**
   * Marker that indicates whether logic needs to be evaluated on the backend rather
   * than the frontend. This can be because of the nature of logic rules, but also
   * if particular dynamic expressions are used in the formio configuration.
   *
   * If true, then, `logicRules` must be an empty Array.
   */
  readonly requireBackendLogicEvaluation: boolean;
  /**
   * Collection of relevant logic rules to test and execute on this step.
   *
   * The backend only returns rules that can be evaluated in the frontend.
   * If backend evaluation is required, `logicRules` is an empty array.
   */
  readonly logicRules: LogicRule[];
  /**
   * (Existing) form submission data for this step, or a diff of data updates to
   * perform when returned as response of the server side check logic call.
   */
  data: JSONObject | null;
  /**
   * Flag to indicate whether the submit button is enabled or disabled. The value can
   * change as a result of logic rule evaluation. Read-only property at the API level,
   * but it can be mutated as part of the frontend logic evaluation.
   */
  canSubmit: boolean;
}

interface CheckLogicRequestBody {
  data: JSONObject;
}

/**
 * @see `#/components/schemas/SubmissionStateLogic` in the API spec.
 */
interface CheckLogicResult {
  submission: Submission;
  step: SubmissionStep;
}

/**
 * Call the backend logic check endpoint and relay the result(s).
 */
export const checkStepLogic = async (
  /**
   * API endpoint pointing to the step within its submission.
   */
  resourceUrl: string,
  /**
   * The (dirty) step data to use as input for the logic evaluation. Any fields that
   * do not pass (client-side) validation must already be removed.
   */
  values: JSONObject,
  /**
   * Abort controller signal - called to cancel an in-flight request.
   */
  abortSignal: AbortSignal
): Promise<CheckLogicResult> => {
  const result = await post<CheckLogicResult, CheckLogicRequestBody>(
    `${resourceUrl}/_check-logic`,
    {data: values},
    abortSignal
  );
  return result.data!;
};

type SubmissionStepCreateOrUpdateBody = Pick<SubmissionStep, 'data'>;

export const saveStepData = async (
  /**
   * API endpoint pointing to the step within its submission.
   */
  resourceUrl: string,
  /**
   * The form field values entered by the user, where the keys are the key of each
   * component describing each field and the values are the field values.
   *
   * Nesting can occur here, if a key like `foo.bar` is set, it creates a parent object
   * for the key `foo` with a child property `bar`.
   */
  data: SubmissionStep['data']
): Promise<void> => {
  // if data is not valid, this throws a `ValidationError` with the `asFormikProps`
  // method, which contains the errors in the suitable format for the formio-renderer.
  try {
    await put<SubmissionStep, SubmissionStepCreateOrUpdateBody>(resourceUrl, {data});
  } catch (error: unknown) {
    // strip out the `data` prefix, the API details are encapsulated from the caller
    if (error instanceof ValidationError) {
      const processedInvalidParams: InvalidParam[] = [];
      error.invalidParams.forEach(param => {
        if (!param.name.startsWith('data.')) return;
        processedInvalidParams.push({
          ...param,
          name: param.name.replace('data.', ''),
        } satisfies InvalidParam);
      });
      error.invalidParams = processedInvalidParams;
      throw error;
    } else {
      // otherwise simply rethrow
      throw error;
    }
  }
};
