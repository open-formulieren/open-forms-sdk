import type {AnyComponentSchema} from '@open-formulieren/types';
import type {JSONObject} from '@open-formulieren/types/lib/types';

import {post, put} from '@/api';
import {type InvalidParam, ValidationError} from '@/errors';

import type {Submission} from './submissions';

/**
 * @see `#/components/schemas/SubmissionStep` in the API spec.
 */
export interface SubmissionStep {
  readonly id: string;
  readonly slug: string;
  readonly formStep: {
    readonly index: number;
    readonly configuration: {
      type?: 'form';
      components: AnyComponentSchema[];
    };
  };
  data: JSONObject | null;
  readonly isApplicable: boolean;
  readonly completed: boolean;
  readonly canSubmit: boolean;
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

interface SaveStepDataOptions {
  /**
   * Optionally skip calling the validate endpoint.
   *
   * In certain situations, the (potentially) invalid data can be submitted to continue
   * at a later time. This does not affect the validation of the submission at the end
   * of the process. If not skipped, the step validate endpoint will be called and any
   * validation errors will be thrown in a `ValidationError` instance.
   */
  skipValidation?: boolean;
}

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
  data: SubmissionStep['data'],
  options?: SaveStepDataOptions
): Promise<void> => {
  if (!options?.skipValidation) {
    // if data is not valid, this throws a `ValidationError` with the `asFormikProps`
    // method, which contains the errors in the suitable format for the formio-renderer.
    try {
      await post<null, SubmissionStepCreateOrUpdateBody>(`${resourceUrl}/validate`, {data});
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
  }
  await put<SubmissionStep, SubmissionStepCreateOrUpdateBody>(resourceUrl, {data});
};
