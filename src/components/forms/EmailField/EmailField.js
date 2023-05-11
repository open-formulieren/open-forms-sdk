import {
  FormFieldDescription,
  FormLabel,
  Paragraph,
  Textbox,
  FormField as UtrechtFormField,
} from '@utrecht/component-library-react';
import {Field} from 'formik';
import React from 'react';

import {getBEMClassName} from 'utils';

export const EmailField = ({
  name = '',
  label = '',
  isRequired = false,
  description = '',
  id = '',
  disabled = false,
  invalid = false,
}) => {
  const labelClassName = getBEMClassName('label', [isRequired && 'required'].filter(Boolean));

  const inputProps = {
    name,
    as: Textbox,
    id,
    disabled,
    invalid,
    type: 'email', // Set the input type to 'email'
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
