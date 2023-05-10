import {
  FormFieldDescription,
  FormLabel,
  Paragraph,
  Textbox,
  FormField as UtrechtFormField,
} from '@utrecht/component-library-react';
import {useField} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

import {getBEMClassName} from 'utils';

const NumberField = ({
  name,
  min,
  step,
  label = '',
  isRequired = false,
  description = '',
  id = '',
  disabled = false,
  invalid = false,
}) => {
  // We have to use the hook here instead of the Field component since we need to intercept the onChange event
  const [field] = useField(name);

  const labelClassName = getBEMClassName('label', [isRequired && 'required'].filter(Boolean));

  const onChange = e => {
    const inputValue = e.target.value;
    const numericValue = Number(inputValue);

    // Check if the input value is not a number and not a minus sign
    if (isNaN(numericValue) && inputValue !== '-') {
      return;
    }
    // Check if the numeric value is below the minimum value
    if (min && numericValue < min) {
      return;
    }
    // Check if the numeric value is not divisible by the step value
    if (step && (numericValue % step !== 0 || inputValue.includes('.'))) {
      return;
    }
    field.onChange(e);
  };

  const inputProps = {
    ...field,
    id,
    disabled,
    invalid,
    min,
    step,
    type: 'text',
    onChange,
  };
  return (
    <UtrechtFormField type="text" invalid={invalid.toString()}>
      <Paragraph className={labelClassName}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
      </Paragraph>
      <Paragraph>
        <Textbox {...inputProps} />
      </Paragraph>
      {description && <FormFieldDescription invalid={invalid}>{description}</FormFieldDescription>}
    </UtrechtFormField>
  );
};
NumberField.propTypes = {
  name: PropTypes.string.isRequired,
  min: PropTypes.number,
  step: PropTypes.number,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  description: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
};

export default NumberField;
