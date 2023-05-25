import {
  FormFieldDescription,
  Paragraph,
  Textbox,
  FormField as UtrechtFormField,
} from '@utrecht/component-library-react';
import {useField} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import {useIntl} from 'react-intl';
import {NumericFormat} from 'react-number-format';

import {Label, ValidationErrors} from 'components/forms';

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
}) => {
  const [fieldProps, {value, error}] = useField(name);
  const {locale} = useIntl();
  const generatedId = React.useId();
  id = id || generatedId;

  const invalid = !!error;

  // We get the decimal separator by formatting a arbitrary number, and then extracting the decimal separator
  const {decimalSeparator, thousandSeparator} = getSeparators(locale);
  const isInteger = step != null && Number.isInteger(step);

  // only pass the localized separators when we're not using type="number" input
  const separatorProps = useNumberType
    ? {}
    : {
        decimalSeparator,
        thousandSeparator,
        decimalScale: isInteger ? undefined : 2,
      };

  return (
    <UtrechtFormField type="text" invalid={invalid} className="utrecht-form-field--openforms">
      <Label id={id} isRequired={isRequired} disabled={disabled}>
        {label}
      </Label>
      <Paragraph>
        <NumericFormat
          // Note: the onChange handler does not handle any input sanitation
          {...fieldProps}
          value={value}
          id={id}
          className="utrecht-textbox--openforms"
          disabled={disabled}
          invalid={invalid}
          min={min}
          step={step}
          type={useNumberType ? 'number' : 'text'}
          customInput={Textbox}
          {...separatorProps}
        />
      </Paragraph>
      {description && <FormFieldDescription>{description}</FormFieldDescription>}
      <ValidationErrors error={error} />
    </UtrechtFormField>
  );
};

NumberField.propTypes = {
  name: PropTypes.string.isRequired,
  useNumberType: PropTypes.bool,
  min: PropTypes.number,
  step: PropTypes.number,
  label: PropTypes.node,
  isRequired: PropTypes.bool,
  description: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
};

export default NumberField;
