import {UnorderedList, UnorderedListItem} from '@utrecht/component-library-react';
import {FormattedMessage, useIntl} from 'react-intl';

import type {StepSummaryData} from '@/data/submissions';

/**
 * Error objects are complex datastructures with possibly multiple levels of nesting.
 * This type describes the leaf nodes in such an object, i.e. the nodes that don't have
 * any more children themselves.
 *
 * This corresponds to a simple string for a single-value field error, or a list of
 * error messages for a single-value field, or a list of error messages for a
 * multi-value field (which has an intrinsic array type for the value).
 */
type ErrorLeafNode = string | string[];

/**
 * Some data/field error can be leaf node, or complex nesting may apply due to dots
 * used in the data key, which creates a nested structure. Additionally, some component
 * types have an intrinsic array value type, which may contain nested objects (customer
 * profile, editgrid...)
 */
type FieldError = ErrorLeafNode | {[k: string]: FieldError} | FieldError[];

const normalizeError = (error: string | string[]): string[] =>
  Array.isArray(error) ? error : [error];

interface StepErrors {
  nonFieldErrors?: string[];
  data?: {[k: string]: FieldError};
}

export interface StepValidationErrorsProps {
  name: string;
  errors: StepErrors;
  stepData: StepSummaryData['data'];
}

const StepValidationErrors: React.FC<StepValidationErrorsProps> = ({errors, name, stepData}) => {
  const intl = useIntl();
  const {nonFieldErrors = [], data = {}} = errors;

  const allErrorMessages = [...normalizeError(nonFieldErrors)];

  // related the data errors to their matching components
  Object.entries(data).map(([key, errorMessage]) => {
    // errorMessage cannot be undefined, since that is not serialiable in JSON from the
    // backend
    const normalizedErrorMessage = normalizeError(errorMessage!);
    const stepDataItem = stepData.find(item => item.component.key === key);

    for (const error of normalizedErrorMessage) {
      const message = intl.formatMessage(
        {
          description: 'Overview page, validation error message for step field.',
          defaultMessage: "Field ''{label}'': {error}",
        },
        {
          // stepDataItem should not be undefined under normal operations, unless there's
          // a bug in the backend
          label: stepDataItem?.name ?? '(unknown component)',
          error: error,
        }
      );
      allErrorMessages.push(message);
    }
  });

  return (
    <>
      <FormattedMessage
        description="Overview page, title before listing the validation errors for a step"
        defaultMessage="Problems in form step ''{name}''"
        values={{name}}
      />
      <UnorderedList>
        {allErrorMessages.map(error => (
          <UnorderedListItem key={error}>{error}</UnorderedListItem>
        ))}
      </UnorderedList>
    </>
  );
};

export interface ValidationErrorsProps {
  /**
   * Validation errors as reconstructed from the backend invalidParams
   */
  errors: {
    steps?: StepErrors[];
  };
  /**
   * Array of summary data per step.
   */
  summaryData: StepSummaryData[];
}

/**
 * Render the validation errors received from the backend.
 */
const ValidationErrors: React.FC<ValidationErrorsProps> = ({errors, summaryData}) => {
  const {steps = []} = errors;
  if (steps.length === 0) return null;
  return (
    <UnorderedList>
      {steps.map((stepErrors, index) => (
        <UnorderedListItem key={summaryData[index].slug}>
          <StepValidationErrors
            errors={stepErrors}
            name={summaryData[index].name}
            stepData={summaryData[index].data}
          />
        </UnorderedListItem>
      ))}
    </UnorderedList>
  );
};

export default ValidationErrors;
