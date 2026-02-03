import type {JSONValue} from '@open-formulieren/types';

import {post} from '@/api';

/**
 * @see `#/components/schemas/ValidationInput` in the API spec.
 */
export interface ValidationInput {
  /**
   * UUID of the submission.
   */
  submissionUuid: string;
  /**
   * The form field (input) value to validate.
   */
  value: JSONValue;
}

/**
 * @see `#/components/schemas/ValidationResult` in the API spec.
 */
export interface ValidationResult {
  /**
   * Boolean indicating value passed validation.
   */
  isValid: boolean;
  /**
   * List of validation error messages for display.
   */
  messages: string[];
}

export const validateValue = async (
  baseUrl: string,
  plugin: string,
  submissionId: string,
  value: JSONValue
): Promise<ValidationResult> => {
  const endpoint = `${baseUrl}validation/plugins/${plugin}`;
  const result = await post<ValidationResult, ValidationInput>(endpoint, {
    submissionUuid: submissionId,
    value,
  });
  return result.data!;
};
