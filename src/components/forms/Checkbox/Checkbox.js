import {FormField, Checkbox as UtrechtCheckbox} from '@utrecht/component-library-react';
import {Field, useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import React, {useId} from 'react';

import {HelpText, ValidationErrors} from 'components/forms';

import {LabelContent} from '../Label';

const Checkbox = ({
  name,
  label,
  isRequired = false,
  description = '',
  id = '',
  disabled = false,
  ...inputProps
}) => {
  const {getFieldMeta} = useFormikContext();
  const generatedId = useId();
  id = id || generatedId;

  const {error, touched} = getFieldMeta(name);
  const invalid = touched && !!error;

  return (
    <FormField type="checkbox" invalid={invalid} className="utrecht-form-field--openforms">
      <div className="utrecht-form-field__label utrecht-form-field__label--checkbox">
        <LabelContent id={id} isRequired={isRequired} disabled={disabled} type="checkbox">
          {label}
        </LabelContent>
      </div>
      <Field
        name={name}
        as={UtrechtCheckbox}
        type="checkbox"
        id={id}
        className="utrecht-form-field__input utrecht-custom-checkbox utrecht-custom-checkbox--html-input utrecht-custom-checkbox--openforms"
        disabled={disabled}
        invalid={invalid}
        required={isRequired}
        appearance="custom"
        aria-describedby={invalid ? `${id}-error-message` : undefined}
        {...inputProps}
      />
      <HelpText>{description}</HelpText>
      {touched && <ValidationErrors error={error} inputId={id} />}
    </FormField>
  );
};

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  isRequired: PropTypes.bool,
  description: PropTypes.node,
  id: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Checkbox;
