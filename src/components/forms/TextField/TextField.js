import {Paragraph, Textbox, FormField as UtrechtFormField} from '@utrecht/component-library-react';
import {Field, useFormikContext} from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

import {HelpText, Label, ValidationErrors, Wrapper} from 'components/forms';

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
  const generatedId = React.useId();
  id = id || generatedId;

  const {error, touched} = getFieldMeta(name);
  const invalid = touched && !!error;
  return (
    <Wrapper>
      <UtrechtFormField type="text" invalid={invalid} className="utrecht-form-field--openforms">
        <Label id={id} isRequired={isRequired} disabled={disabled}>
          {label}
        </Label>
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
        <HelpText>{description}</HelpText>
        {touched && <ValidationErrors error={error} />}
      </UtrechtFormField>
    </Wrapper>
  );
};

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  description: PropTypes.node,
  id: PropTypes.string,
  disabled: PropTypes.bool,
};

export default TextField;
