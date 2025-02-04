import {UnorderedList, UnorderedListItem} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';
import {FormattedMessage, useIntl} from 'react-intl';

const ErrorType = PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]);

const normalizeError = error => (Array.isArray(error) ? error : [error]);

const StepValidationErrors = ({errors, name, stepData}) => {
  const intl = useIntl();
  const {nonFieldErrors = [], data = {}} = errors;

  const allErrorMessages = [...normalizeError(nonFieldErrors)];

  // related the data errors to their matching components
  Object.entries(data).map(([key, errorMessage]) => {
    const normalizedErrorMessage = normalizeError(errorMessage);
    const stepDataItem = stepData.find(item => item.component.key === key);

    for (const error of normalizedErrorMessage) {
      const message = intl.formatMessage(
        {
          description: 'Overview page, validation error message for step field.',
          defaultMessage: "Field ''{label}'': {error}",
        },
        {
          label: stepDataItem.name,
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
      <UnorderedList className="utrecht-unordered-list--distanced">
        {allErrorMessages.map(error => (
          <UnorderedListItem key={error}>{error}</UnorderedListItem>
        ))}
      </UnorderedList>
    </>
  );
};

StepValidationErrors.propTypes = {
  errors: PropTypes.shape({
    nonFieldErrors: ErrorType,
    // keys are the component key names
    data: PropTypes.objectOf(ErrorType),
  }).isRequired,
  name: PropTypes.string.isRequired,
  stepData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.array,
        PropTypes.number,
        PropTypes.bool,
      ]),
      component: PropTypes.object.isRequired,
    })
  ).isRequired,
};

/**
 * Render the validation errors received from the backend.
 */
const ValidationErrors = ({errors, summaryData}) => {
  const {steps = []} = errors;
  if (steps.length === 0) return null;
  return (
    <UnorderedList className="utrecht-unordered-list--distanced">
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

ValidationErrors.propTypes = {
  /**
   * Validation errors as reconstructed from the backend invalidParams
   */
  errors: PropTypes.shape({
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        nonFieldErrors: ErrorType,
        // keys are the component key names
        data: PropTypes.objectOf(ErrorType),
      })
    ),
  }),
  /**
   * Array of summary data per step.
   */
  summaryData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object,
            PropTypes.array,
            PropTypes.number,
            PropTypes.bool,
          ]),
          component: PropTypes.object.isRequired,
        })
      ).isRequired,
    })
  ),
};

export default ValidationErrors;
