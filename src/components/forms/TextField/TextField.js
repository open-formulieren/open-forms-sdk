import {
  FormFieldDescription,
  FormLabel,
  Paragraph,
  Textbox,
  FormField as UtrechtFormField,
} from '@utrecht/component-library-react';
import {Field} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

import {getBEMClassName} from 'utils';

export const TextField = ({
  name,
  label = '',
  isRequired = false,
  description = '',
  id = '',
  disabled = false,
  invalid = false,
}) => {
  const labelClassName = getBEMClassName('label', [isRequired && 'required'].filter(Boolean));

  const inputProps = {
    id,
    disabled,
    invalid,
  };

  return (
    <UtrechtFormField type={'text'} invalid={invalid}>
      <Paragraph className={labelClassName}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
      </Paragraph>
      <Paragraph>
        <Field name={name} as={Textbox} {...inputProps} />
      </Paragraph>
      {description && <FormFieldDescription invalid={invalid}>{description}</FormFieldDescription>}
    </UtrechtFormField>
  );
};

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  description: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
};

export default TextField;
