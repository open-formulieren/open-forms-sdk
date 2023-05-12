import {FormFieldDescription, FormLabel, Paragraph} from '@utrecht/component-library-react';
import {Field} from 'formik';
import PropTypes from 'prop-types';
import Select from 'react-select';

import {getBEMClassName} from '../../../utils';

export const SelectField = ({
  name = '',
  label = '',
  id = '',
  isRequired = false,
  description = '',
  disabled = false,
  invalid = false,
  options = [],
}) => {
  const labelClassName = getBEMClassName('label', [isRequired && 'required'].filter(Boolean));

  return (
    <>
      <Paragraph className={labelClassName}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
      </Paragraph>
      <Field
        name={name}
        component={Select}
        inputId={id}
        components={{DropdownIndicator: () => null, IndicatorSeparator: () => null}}
        classNames={{
          control: state => {
            return getBEMClassName('rs-select', [
              state.isFocused && 'focus',
              disabled && 'disabled',
              invalid && 'invalid',
              isRequired && 'required',
            ]);
          },
          menu: () => {
            return getBEMClassName('rs-select-menu');
          },
          option: state => {
            return getBEMClassName('rs-select-option', [state.isFocused && 'focus']);
          },
        }}
        options={options}
        unstyled
        isDisabled={disabled}
      />
      {description && <FormFieldDescription invalid={invalid}>{description}</FormFieldDescription>}
    </>
  );
};

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  id: PropTypes.string,
  isRequired: PropTypes.bool,
  description: PropTypes.string,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
};
