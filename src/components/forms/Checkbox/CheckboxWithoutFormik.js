import {Checkbox, FormField} from '@utrecht/component-library-react';
import PropTypes from 'prop-types';
import React, {useId} from 'react';

import {LabelContent} from '../Label';

const CheckboxWithoutFormik = ({
  name,
  id,
  label,
  value,
  isRequired = false,
  onChange,
  disabled = false,
}) => {
  const defaultId = useId();
  id = id || defaultId;
  return (
    <FormField type="checkbox" className="utrecht-form-field--openforms">
      <Checkbox
        name={name}
        id={id}
        required={isRequired}
        value={value}
        onChange={onChange}
        appearance="custom"
        className="utrecht-form-field__input utrecht-custom-checkbox utrecht-custom-checkbox--html-input utrecht-custom-checkbox--openforms"
      />
      <div className="utrecht-form-field__label utrecht-form-field__label--checkbox">
        <LabelContent id={id} isRequired={isRequired} disabled={disabled} type="checkbox">
          {label}
        </LabelContent>
      </div>
    </FormField>
  );
};

CheckboxWithoutFormik.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  label: PropTypes.node.isRequired,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default CheckboxWithoutFormik;
