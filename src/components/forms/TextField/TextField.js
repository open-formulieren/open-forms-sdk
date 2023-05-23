import {
  FormFieldDescription,
  FormLabel,
  Paragraph,
  Textbox,
  FormField as UtrechtFormField,
} from '@utrecht/component-library-react';
import {Field, useFormikContext} from 'formik';
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
  ...inputProps
}) => {
  const {getFieldMeta} = useFormikContext();
  const {error} = getFieldMeta(name);

  const labelClassName = getBEMClassName('label', [isRequired && 'required'].filter(Boolean));
  const invalid = !!error;

  return (
    <UtrechtFormField type="text" invalid={invalid} className="utrecht-form-field--openforms">
      <Paragraph className={labelClassName}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
      </Paragraph>
      <Paragraph>
        <Field
          name={name}
          as={Textbox}
          id={id}
          className="utrecht-textbox--openforms"
          disabled={disabled}
          invalid={invalid}
          {...inputProps}
        />
      </Paragraph>
      {description && <FormFieldDescription>{description}</FormFieldDescription>}
      {invalid && (
        <FormFieldDescription invalid className="utrecht-form-field-description--openforms-errors">
          {error}
        </FormFieldDescription>
      )}
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
};

export default TextField;
