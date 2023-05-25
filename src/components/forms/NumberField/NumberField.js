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
import {useIntl} from 'react-intl';
import {NumericFormat} from 'react-number-format';

import {Label} from 'components/forms';
import {getBEMClassName} from 'utils';

const getSeparators = locale => {
  const numberFormat = new Intl.NumberFormat(locale);
  const parts = numberFormat.formatToParts(1000.1);
  const decimalSeparator = parts.find(part => part.type === 'decimal').value;
  const thousandSeparator = parts.find(part => part.type === 'group').value;
  return {decimalSeparator, thousandSeparator};
};

const NumberField = ({
  name,
  min,
  step,
  useNumberType = false, // number type can be convenient for small numbers with the +- spinner buttons
  label = '',
  isRequired = false,
  description = '',
  id = '',
  disabled = false,
  invalid = false,
}) => {
  const [field, meta, helpers] = useField(name);
  const {locale} = useIntl();

  const inputClassName = getBEMClassName('input', [invalid && 'invalid'].filter(Boolean));

  // We get the decimal separator by formatting a arbitrary number, and then extracting the decimal separator
  const {decimalSeparator, thousandSeparator} = getSeparators(locale);
  const isInteger = step != null && Number.isInteger(step);

  const inputProps = {
    // To handle the State in formik
    // It is important to note that the onChange handler, **DOES NOT** handle any sanitization of the input.
    ...field,
    value: meta.value,

    // These are passed down to the customInput
    id,
    className: inputClassName,
    disabled,
    invalid,
    min,
    step,
    type: useNumberType ? 'number' : 'text',

    // These are for the NumericFormat component
    customInput: Textbox,
    // only pass the localized separators when we're not using type="number" input
    ...(!useNumberType
      ? {
          decimalSeparator,
          thousandSeparator,
          decimalScale: isInteger ? undefined : 2,
        }
      : {}),
  };

  return (
    <UtrechtFormField type="text" invalid={invalid.toString()}>
      <Label id={id} isRequired={isRequired} disabled={disabled}>
        {label}
      </Label>
      <Paragraph>
        <NumericFormat {...inputProps} />
      </Paragraph>
      {description && <FormFieldDescription invalid={invalid}>{description}</FormFieldDescription>}
    </UtrechtFormField>
  );
};

NumberField.propTypes = {
  name: PropTypes.string.isRequired,
  useNumberType: PropTypes.bool,
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
