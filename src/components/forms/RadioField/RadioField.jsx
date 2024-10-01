import {
  Fieldset,
  FieldsetLegend,
  FormField,
  FormLabel,
  Paragraph,
  RadioButton,
} from '@utrecht/component-library-react';
import {Field, useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

import {HelpText, ValidationErrors} from 'components/forms';
import {LabelContent} from 'components/forms/Label';

/**
 * A radio field with a set of options.
 *
 * @reference https://nl-design-system.github.io/utrecht/storybook-react/?path=/docs/react-component-form-field-radio-group--docs
 */
export const RadioField = ({
  name,
  label = '',
  isRequired = false,
  description = '',
  id = '',
  disabled = false,
  options = [],
  ...inputProps
}) => {
  const {getFieldMeta} = useFormikContext();
  const generatedId = React.useId();
  id = id || generatedId;

  const {error, touched} = getFieldMeta(name);
  const invalid = touched && !!error;
  const descriptionid = `${id}-description`;
  return (
    <Fieldset
      className="utrecht-form-fieldset--openforms"
      disabled={disabled}
      invalid={invalid}
      role="radiogroup"
      aria-describedby={description ? descriptionid : undefined}
    >
      <FieldsetLegend className="utrecht-form-field__label">
        <LabelContent disabled={disabled} isRequired={isRequired}>
          {label}
        </LabelContent>
      </FieldsetLegend>

      {options.map(({value: optionValue, label: optionLabel}, index) => (
        <FormField key={optionValue} type="radio" className="utrecht-form-field--openforms">
          <Field
            as={RadioButton}
            type="radio"
            className="utrecht-form-field__input"
            id={`${id}-opt-${index}`}
            name={name}
            value={optionValue}
            {...inputProps}
          />
          <Paragraph className="utrecht-form-field__label utrecht-form-field__label--radio">
            <FormLabel
              htmlFor={`${id}-opt-${index}`}
              disabled={disabled}
              type="radio"
              className="utrecht-form-label--openforms"
            >
              {optionLabel}
            </FormLabel>
          </Paragraph>
        </FormField>
      ))}

      <HelpText id={descriptionid}>{description}</HelpText>
      {touched && <ValidationErrors error={error} />}
    </Fieldset>
  );
};

RadioField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  description: PropTypes.node,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RadioField;
